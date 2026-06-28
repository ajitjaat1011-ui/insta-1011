import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Only allow Instagram CDN URLs
  if (
    !url.includes("cdninstagram.com") &&
    !url.includes("instagram.com") &&
    !url.includes("fbcdn.net")
  ) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    // Use curl to bypass TLS fingerprinting
    const buffer = execSync(
      `curl -s -m 10 -L -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" -H "Referer: https://www.instagram.com/" "${url}"`,
      { maxBuffer: 10 * 1024 * 1024, timeout: 15000 }
    );

    const contentType = url.includes(".mp4") ? "video/mp4" : "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
