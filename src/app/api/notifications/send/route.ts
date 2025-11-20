import { NextRequest, NextResponse } from "next/server";
import {
  sendMiniAppNotification,
  sendBatchNotifications,
  getAllNotificationTokens,
} from "@/lib/notifications";

/**
 * API endpoint for sending notifications
 * 
 * POST /api/notifications/send
 * 
 * Body:
 * - single: { fid, appFid, title, body, targetUrl?, notificationId? }
 * - batch: { title, body, targetUrl, notificationId, broadcast?: boolean }
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Single user notification
    if (body.fid && body.appFid) {
      const result = await sendMiniAppNotification({
        fid: body.fid,
        appFid: body.appFid,
        title: body.title,
        body: body.body,
        targetUrl: body.targetUrl,
        notificationId: body.notificationId,
      });

      return NextResponse.json({
        success: result.state === "success",
        state: result.state,
        error: result.error,
      });
    }

    // Batch/broadcast notification
    if (body.broadcast || body.tokens) {
      let tokens;

      if (body.broadcast) {
        // Send to all registered users
        const allTokens = await getAllNotificationTokens();
        tokens = allTokens.map(t => ({
          token: t.details.token,
          url: t.details.url,
          fid: t.fid,
          appFid: t.appFid,
        }));
      } else {
        // Send to specific tokens
        tokens = body.tokens;
      }

      if (!tokens || tokens.length === 0) {
        return NextResponse.json(
          { error: "No notification tokens available" },
          { status: 400 }
        );
      }

      const result = await sendBatchNotifications({
        notificationId: body.notificationId || crypto.randomUUID(),
        title: body.title,
        body: body.body,
        targetUrl: body.targetUrl || process.env.NEXT_PUBLIC_APP_URL || "",
        tokens,
      });

      return NextResponse.json({
        success: result.successful > 0,
        ...result,
      });
    }

    return NextResponse.json(
      { error: "Invalid request: must provide fid+appFid or broadcast flag" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[API] Notification send error:", error);
    return NextResponse.json(
      { error: "Failed to send notification", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/send
 * Get notification statistics
 */
export async function GET() {
  try {
    const allTokens = await getAllNotificationTokens();
    
    return NextResponse.json({
      totalUsers: allTokens.length,
      tokens: allTokens.map(t => ({
        fid: t.fid,
        appFid: t.appFid,
        hasToken: !!t.details.token,
      })),
    });
  } catch (error) {
    console.error("[API] Get notification tokens error:", error);
    return NextResponse.json(
      { error: "Failed to get notification data" },
      { status: 500 }
    );
  }
}
