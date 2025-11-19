import { NextResponse } from "next/server";

import { getMiniAppManifest } from "@/../minikit.config";

export const dynamic = "force-static";
export const revalidate = 60;

export function GET() {
  const manifest = getMiniAppManifest();

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
    },
  });
}