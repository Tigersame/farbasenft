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

export async function sendMiniAppNotification({
  fid,
  appFid,
  title,
  body,
  targetUrl,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
  targetUrl?: string;
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

  try {
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: crypto.randomUUID(),
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

