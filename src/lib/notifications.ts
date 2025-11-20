/**
 * Notification storage and sending utilities
 * 
 * In a production app, this would use a database (PostgreSQL, MongoDB, etc.)
 * For now, we use in-memory storage for demonstration.
 */

export interface NotificationDetails {
  url: string;
  token: string;
}

interface UserNotificationKey {
  fid: number;
  appFid: number;
}

// In-memory storage - replace with database in production
const notificationStore = new Map<string, NotificationDetails>();

/**
 * Generate a unique key for a user-client combination
 */
function getUserKey(fid: number, appFid: number): string {
  return `${fid}:${appFid}`;
}

/**
 * Save notification details for a user
 */
export async function saveUserNotificationDetails(
  fid: number,
  appFid: number,
  notificationDetails: NotificationDetails
): Promise<void> {
  const key = getUserKey(fid, appFid);
  notificationStore.set(key, notificationDetails);
  console.log(`[Notifications] Saved notification details for FID ${fid}, AppFID ${appFid}`);
}

/**
 * Get notification details for a user
 */
export async function getUserNotificationDetails(
  fid: number,
  appFid: number
): Promise<NotificationDetails | null> {
  const key = getUserKey(fid, appFid);
  return notificationStore.get(key) || null;
}

/**
 * Delete notification details for a user
 */
export async function deleteUserNotificationDetails(
  fid: number,
  appFid: number
): Promise<void> {
  const key = getUserKey(fid, appFid);
  notificationStore.delete(key);
  console.log(`[Notifications] Deleted notification details for FID ${fid}, AppFID ${appFid}`);
}

/**
 * Send a notification to a user
 */
export interface SendNotificationResult {
  state: "success" | "error" | "no_token" | "rate_limit";
  error?: unknown;
}

export interface SendNotificationRequest {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: string[];
}

export interface SendNotificationResponse {
  successfulTokens: string[];
  invalidTokens: string[];
  rateLimitedTokens: string[];
}

/**
 * Get all stored notification tokens
 * Useful for sending broadcast notifications
 */
export async function getAllNotificationTokens(): Promise<
  Array<{ fid: number; appFid: number; details: NotificationDetails }>
> {
  const tokens: Array<{ fid: number; appFid: number; details: NotificationDetails }> = [];
  
  for (const [key, details] of notificationStore.entries()) {
    const [fidStr, appFidStr] = key.split(':');
    tokens.push({
      fid: parseInt(fidStr),
      appFid: parseInt(appFidStr),
      details,
    });
  }
  
  return tokens;
}

/**
 * Send notifications to multiple users in batches
 * Automatically handles batching of up to 100 tokens per request
 * 
 * @param notificationId Stable identifier for deduplication (e.g., "daily-reminder-2025-11-20")
 * @param title Notification title (max 32 chars)
 * @param body Notification body (max 128 chars)
 * @param targetUrl URL to open when clicked (max 1024 chars)
 * @param tokens Array of notification tokens
 */
export async function sendBatchNotifications({
  notificationId,
  title,
  body,
  targetUrl,
  tokens,
}: {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: Array<{ token: string; url: string; fid: number; appFid: number }>;
}): Promise<{
  successful: number;
  failed: number;
  rateLimited: number;
  invalidated: number;
}> {
  // Validate lengths
  if (notificationId.length > 128) {
    throw new Error("notificationId must be <= 128 characters");
  }
  if (title.length > 32) {
    console.warn(`[Notifications] Title truncated from ${title.length} to 32 chars`);
    title = title.substring(0, 32);
  }
  if (body.length > 128) {
    console.warn(`[Notifications] Body truncated from ${body.length} to 128 chars`);
    body = body.substring(0, 128);
  }
  if (targetUrl.length > 1024) {
    throw new Error("targetUrl must be <= 1024 characters");
  }

  // Group tokens by URL (different Farcaster clients may have different URLs)
  const tokensByUrl = new Map<string, typeof tokens>();
  for (const token of tokens) {
    const existing = tokensByUrl.get(token.url) || [];
    existing.push(token);
    tokensByUrl.set(token.url, existing);
  }

  let successful = 0;
  let failed = 0;
  let rateLimited = 0;
  let invalidated = 0;

  // Send to each URL in batches of 100
  for (const [url, urlTokens] of tokensByUrl.entries()) {
    // Batch into groups of 100
    for (let i = 0; i < urlTokens.length; i += 100) {
      const batch = urlTokens.slice(i, i + 100);
      const tokenStrings = batch.map(t => t.token);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
            title,
            body,
            targetUrl,
            tokens: tokenStrings,
          } satisfies SendNotificationRequest),
        });

        if (response.status === 200) {
          const responseData = (await response.json()) as SendNotificationResponse;

          successful += responseData.successfulTokens?.length || 0;
          rateLimited += responseData.rateLimitedTokens?.length || 0;
          
          // Remove invalidated tokens from storage
          if (responseData.invalidTokens?.length > 0) {
            invalidated += responseData.invalidTokens.length;
            for (const token of batch) {
              if (responseData.invalidTokens.includes(token.token)) {
                await deleteUserNotificationDetails(token.fid, token.appFid);
              }
            }
          }
        } else {
          failed += tokenStrings.length;
          console.error(`[Notifications] Batch request failed: ${response.status}`);
        }
      } catch (error) {
        failed += tokenStrings.length;
        console.error(`[Notifications] Batch send error:`, error);
      }
    }
  }

  console.log(
    `[Notifications] Batch complete: ${successful} sent, ${failed} failed, ` +
    `${rateLimited} rate limited, ${invalidated} invalidated`
  );

  return { successful, failed, rateLimited, invalidated };
}

export async function sendMiniAppNotification({
  fid,
  appFid,
  title,
  body,
  targetUrl,
  notificationId,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
  targetUrl?: string;
  notificationId?: string; // Optional stable ID for deduplication
}): Promise<SendNotificationResult> {
  const notificationDetails = await getUserNotificationDetails(fid, appFid);
  
  if (!notificationDetails) {
    console.log(`[Notifications] No token found for FID ${fid}, AppFID ${appFid}`);
    return { state: "no_token" };
  }

  // Validate title and body lengths
  if (title.length > 32) {
    console.warn(`[Notifications] Title exceeds 32 characters: ${title.length}`);
    title = title.substring(0, 32);
  }
  if (body.length > 128) {
    console.warn(`[Notifications] Body exceeds 128 characters: ${body.length}`);
    body = body.substring(0, 128);
  }

  const appUrl = targetUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  if (appUrl.length > 1024) {
    return { state: "error", error: "targetUrl exceeds 1024 characters" };
  }

  // Generate or use provided notification ID
  const finalNotificationId = notificationId || crypto.randomUUID();

  try {
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: finalNotificationId,
        title,
        body,
        targetUrl: appUrl,
        tokens: [notificationDetails.token],
      } satisfies SendNotificationRequest),
    });

    const responseJson = await response.json();

    if (response.status === 200) {
      const responseData = responseJson as SendNotificationResponse;
      
      if (responseData.rateLimitedTokens?.length > 0) {
        console.warn(`[Notifications] Rate limited for tokens: ${responseData.rateLimitedTokens.join(", ")}`);
        return { state: "rate_limit" };
      }

      if (responseData.invalidTokens?.length > 0) {
        // Token is invalid, delete it
        console.warn(`[Notifications] Invalid tokens detected, deleting: ${responseData.invalidTokens.join(", ")}`);
        await deleteUserNotificationDetails(fid, appFid);
      }

      if (responseData.successfulTokens?.length > 0) {
        console.log(`[Notifications] Successfully sent notification to FID ${fid}, AppFID ${appFid}`);
        return { state: "success" };
      }

      return { state: "success" };
    } else {
      console.error(`[Notifications] Error response: ${response.status}`, responseJson);
      return { state: "error", error: responseJson };
    }
  } catch (error) {
    console.error(`[Notifications] Failed to send notification:`, error);
    return { state: "error", error };
  }
}

