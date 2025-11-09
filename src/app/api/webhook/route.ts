import { NextResponse } from "next/server";

type MiniAppEvent = {
  type: string;
  payload?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let event: MiniAppEvent | null = null;

  try {
    event = await request.json();
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload", detail: String(error) },
      { status: 400 },
    );
  }

  console.info("[farbasenft] webhook received", event);

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    echo: event,
  });
}

export function GET() {
  return NextResponse.json({
    ok: true,
    message: "farbasenft webhook endpoint ready",
    docs: "https://docs.base.org/mini-apps/quickstart/create-new-miniapp",
  });
}


