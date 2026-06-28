import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { searchHistory, analysisCache } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchInstagramProfile } from "@/lib/instagram";

function proxyUrl(url: string): string {
  if (!url) return "";
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body?.username;

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 1 || cleanUsername.length > 30) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // Check cache (30 min)
    try {
      const cached = await db
        .select()
        .from(analysisCache)
        .where(eq(analysisCache.username, cleanUsername))
        .limit(1);

      if (cached.length > 0) {
        const cacheAge = Date.now() - new Date(cached[0].cachedAt).getTime();
        if (cacheAge < 1800000) {
          await db
            .update(analysisCache)
            .set({ hitCount: (cached[0].hitCount || 0) + 1 })
            .where(eq(analysisCache.username, cleanUsername))
            .catch(() => {});

          await db.insert(searchHistory).values({
            username: cleanUsername,
            profileData: cached[0].profileData,
          }).catch(() => {});

          return NextResponse.json({
            profile: cached[0].profileData,
            analysis: cached[0].analysisData,
            cached: true,
          });
        }
      }
    } catch {
      // DB error, continue to fetch
    }

    // Fetch fresh data
    const result = await fetchInstagramProfile(cleanUsername);

    if (!result) {
      return NextResponse.json(
        { error: "Could not fetch this profile. The account may not exist, be private, or Instagram is temporarily rate-limiting. Please try again in a moment." },
        { status: 404 }
      );
    }

    // Proxy all image URLs so browser can load them
    result.profile.profilePicUrl = proxyUrl(result.profile.profilePicUrl);
    result.profile.recentPosts = result.profile.recentPosts.map((post) => ({
      ...post,
      imageUrl: proxyUrl(post.imageUrl),
    }));

    // Cache result
    try {
      const existing = await db
        .select()
        .from(analysisCache)
        .where(eq(analysisCache.username, cleanUsername))
        .limit(1);

      const profileJson = JSON.parse(JSON.stringify(result.profile));
      const analysisJson = JSON.parse(JSON.stringify(result.analysis));

      if (existing.length > 0) {
        await db
          .update(analysisCache)
          .set({
            profileData: profileJson,
            analysisData: analysisJson,
            cachedAt: new Date(),
            hitCount: (existing[0].hitCount || 0) + 1,
          })
          .where(eq(analysisCache.username, cleanUsername));
      } else {
        await db.insert(analysisCache).values({
          username: cleanUsername,
          profileData: profileJson,
          analysisData: analysisJson,
        });
      }

      await db.insert(searchHistory).values({
        username: cleanUsername,
        profileData: profileJson,
      });
    } catch (dbErr) {
      console.error("DB write error:", dbErr);
    }

    return NextResponse.json({
      profile: result.profile,
      analysis: result.analysis,
      cached: false,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
