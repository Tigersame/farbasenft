import { NextRequest, NextResponse } from "next/server";
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";
import {
  saveUserNotificationDetails,
  deleteUserNotificationDetails,
  sendMiniAppNotification,
} from "@/lib/notifications";

/**
 * Webhook endpoint for Base Mini App events
 * 
 * Handles:
 * - miniapp_added: When user adds the Mini App
 * - miniapp_removed: When user removes the Mini App
 * - notifications_enabled: When user enables notifications
 * - notifications_disabled: When user disables notifications
 * 
 * Documentation: https://docs.base.org/mini-apps/core-concepts/notifications
 */
export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json();

    // Parse and verify the webhook event
    let data;
    try {
      data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
      // Events are signed by the app key of a user with a JSON Farcaster Signature
    } catch (error) {
      console.error("[Webhook] Verification failed:", error);
      return NextResponse.json(
        { error: "Invalid signature or verification failed" },
        { status: 401 }
      );
    }

    // Extract webhook data
    const fid = data.fid;
    const appFid = data.appFid; // The FID of the client app (Base app is 309857)
    const event = data.event;

    console.log(`[Webhook] Received event: ${event.event} for FID ${fid}, AppFID ${appFid}`);

    // Handle different event types
    try {
      switch (event.event) {
        case "miniapp_added":
          if (event.notificationDetails) {
            await saveUserNotificationDetails(fid, appFid, event.notificationDetails);
            // Send welcome notification
            await sendMiniAppNotification({
              fid,
              appFid,
              title: "Welcome to farbasenft!",
              body: "Your Mini App is now added. Start exploring NFTs!",
            });
          }
          break;

        case "miniapp_removed":
          // Delete notification details
          await deleteUserNotificationDetails(fid, appFid);
          break;

        case "notifications_enabled":
          // Save new notification details and send confirmation
          if (event.notificationDetails) {
            await saveUserNotificationDetails(fid, appFid, event.notificationDetails);
            await sendMiniAppNotification({
              fid,
              appFid,
              title: "Notifications enabled",
              body: "You'll receive updates about your NFTs and marketplace activity.",
            });
          }
          break;

        case "notifications_disabled":
          // Delete notification details
          await deleteUserNotificationDetails(fid, appFid);
          break;

        default:
          console.warn(`[Webhook] Unknown event type:`, event);
      }
    } catch (error) {
      console.error("[Webhook] Error processing webhook:", error);
      // Still return 200 to avoid retries for processing errors
      // But log the error for debugging
    }

    // Return success response quickly (within 10 seconds)
    // Base app waits for successful response before activating tokens
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Webhook] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({
    ok: true,
    message: "farbasenft webhook endpoint ready",
    docs: "https://docs.base.org/mini-apps/core-concepts/notifications",
  });
}
