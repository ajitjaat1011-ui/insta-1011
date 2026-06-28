import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { db } from "@/db";
import { analysisCache } from "@/db/schema";
import { eq } from "drizzle-orm";

function clean(s: unknown): string {
  if (s === null || s === undefined) return "";
  const str = String(s);
  let out = "";
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c >= 32 && c <= 126) out += str[i];
  }
  return out.replace(/\s+/g, " ").trim();
}

function fmt(n: number): string {
  if (!n && n !== 0) return "0";
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPDF(profile: any, analysis: any): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const m = 14;
  let y = 0;

  type C = { r: number; g: number; b: number };
  const rgb = (r: number, g: number, b: number): C => ({ r, g, b });
  const purple = rgb(168, 85, 247), pink = rgb(236, 72, 153), white = rgb(255, 255, 255);
  const gray = rgb(140, 140, 150), dG = rgb(90, 90, 100), bg = rgb(15, 15, 22);
  const card = rgb(25, 25, 38), green = rgb(34, 197, 94), red = rgb(239, 68, 68), orange = rgb(249, 115, 22);

  const fill = (c: C) => doc.setFillColor(c.r, c.g, c.b);
  const txt = (c: C) => doc.setTextColor(c.r, c.g, c.b);
  const drw = (c: C) => doc.setDrawColor(c.r, c.g, c.b);
  const B = () => doc.setFont("helvetica", "bold");
  const N = () => doc.setFont("helvetica", "normal");
  const S = (s: number) => doc.setFontSize(s);

  fill(bg); doc.rect(0, 0, W, H, "F");
  fill(purple); doc.rect(0, 0, W / 3, 3.5, "F");
  fill(pink); doc.rect(W / 3, 0, W / 3, 3.5, "F");
  fill(orange); doc.rect((W * 2) / 3, 0, W / 3, 3.5, "F");

  y = 16; B(); S(26); txt(purple); doc.text("Insta", m, y);
  txt(white); doc.text(" 1011", m + doc.getTextWidth("Insta"), y);
  y += 6; N(); S(8); txt(dG);
  doc.text("INSTAGRAM PROFILE INTELLIGENCE REPORT", m, y);
  const ds = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text("Generated: " + ds, W - m, y, { align: "right" });
  y += 6; drw(rgb(50, 50, 60)); doc.setLineWidth(0.25); doc.line(m, y, W - m, y);

  y += 10; B(); S(10); txt(purple); doc.text("PROFILE OVERVIEW", m, y);
  y += 6; fill(card); doc.roundedRect(m, y, W - m * 2, 32, 3, 3, "F");
  S(18); B(); txt(white);
  const un = "@" + clean(profile.username);
  doc.text(un, m + 6, y + 11);
  if (profile.isVerified) {
    fill(rgb(59, 130, 246)); doc.circle(m + 6 + doc.getTextWidth(un) + 5, y + 8.5, 3, "F");
    S(7); txt(white); doc.text("V", m + 6 + doc.getTextWidth(un) + 3.8, y + 10);
  }
  S(10); N(); txt(gray);
  const fn = clean(profile.fullName); if (fn) doc.text(fn, m + 6, y + 19);
  S(8); txt(purple); const ct = clean(profile.category); if (ct) doc.text(ct, m + 6, y + 26);
  y += 38;

  const sw = (W - m * 2 - 8) / 3;
  [["POSTS", fmt(profile.postsCount || 0)], ["FOLLOWERS", fmt(profile.followersCount || 0)], ["FOLLOWING", fmt(profile.followingCount || 0)]].forEach(([l, v], i) => {
    const x = m + i * (sw + 4);
    fill(card); doc.roundedRect(x, y, sw, 20, 2, 2, "F");
    S(15); B(); txt(white); doc.text(v, x + sw / 2, y + 9, { align: "center" });
    S(6.5); N(); txt(dG); doc.text(l, x + sw / 2, y + 16, { align: "center" });
  }); y += 26;

  const bio = clean(profile.biography);
  if (bio) {
    S(8); N(); txt(gray);
    const ls = (doc.splitTextToSize(bio, W - m * 2 - 12) as string[]).slice(0, 3);
    const bh = 6 + ls.length * 3.8;
    fill(card); doc.roundedRect(m, y, W - m * 2, bh, 2, 2, "F");
    doc.text(ls, m + 6, y + 5); y += bh + 4;
  }

  y += 4; B(); S(10); txt(purple); doc.text("POPULARITY SCORE", m, y);
  y += 6; fill(card); doc.roundedRect(m, y, W - m * 2, 40, 3, 3, "F");
  const cx = m + 26, cy = y + 20, cr = 14;
  drw(rgb(40, 40, 55)); doc.setLineWidth(2.5); doc.circle(cx, cy, cr, "S");
  const sc = analysis.popularityScore || 0;
  if (sc >= 80) drw(green); else if (sc >= 50) drw(purple); else drw(red);
  doc.setLineWidth(2.5); doc.circle(cx, cy, cr, "S");
  S(20); B(); txt(white); doc.text(String(sc), cx, cy + 2, { align: "center" });
  S(5.5); txt(dG); doc.text("SCORE", cx, cy + 8, { align: "center" });

  [["Quality", clean(analysis.accountQuality)], ["Growth", clean(analysis.growthPotential)], ["Reach", clean(analysis.audienceReach)]].forEach(([l, v], i) => {
    const lx = m + 56 + i * 38;
    S(6.5); N(); txt(dG); doc.text(l, lx, y + 10);
    S(8.5); B(); txt(white); doc.text(v || "-", lx, y + 16);
  });
  S(6.5); N(); txt(dG); doc.text("Account Age", m + 56, y + 28);
  S(8.5); B(); txt(white); doc.text(clean(analysis.accountAgeLabel) || "-", m + 56, y + 34);
  S(6.5); N(); txt(dG); doc.text("Created", m + 110, y + 28);
  S(8.5); B(); txt(white); doc.text(clean(analysis.accountCreatedApprox) || "-", m + 110, y + 34);
  y += 46;

  B(); S(10); txt(purple); doc.text("ENGAGEMENT METRICS", m, y); y += 6;
  const mets: [string, string][] = [
    ["Engagement Rate", (analysis.engagementRate || 0) + "%"],
    ["Avg Likes / Post", fmt(analysis.avgLikes || 0)],
    ["Avg Comments / Post", fmt(analysis.avgComments || 0)],
    ["Follower Ratio", fmt(analysis.followerToFollowingRatio || 0) + ":1"],
    ["Post Frequency", clean(analysis.postFrequency) || "-"],
    ["Posts Per Day", String(analysis.postsPerDay || 0)],
  ];
  const mw = (W - m * 2 - 4) / 2;
  mets.forEach(([l, v], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const mx = m + col * (mw + 4), my2 = y + row * 14;
    fill(card); doc.roundedRect(mx, my2, mw, 12, 2, 2, "F");
    S(7.5); N(); txt(gray); doc.text(l, mx + 4, my2 + 5.5);
    S(9); B(); txt(white); doc.text(v, mx + mw - 4, my2 + 8, { align: "right" });
  }); y += 48;

  B(); S(10); txt(green); doc.text("AUTHENTICITY ANALYSIS", m, y); y += 6;
  fill(card); doc.roundedRect(m, y, W - m * 2, 34, 3, 3, "F");
  S(7); N(); txt(dG); doc.text("Authenticity Score", m + 6, y + 7);
  S(20); B();
  const asc2 = analysis.authenticityScore || 0;
  if (asc2 >= 75) txt(green); else if (asc2 >= 50) txt(rgb(245, 158, 11)); else txt(red);
  doc.text(asc2 + "%", m + 6, y + 18);
  S(8); txt(white); doc.text(clean(analysis.botLabel) || "-", m + 6, y + 26);

  const ac: [string, string, C][] = [
    ["Bot Score", (analysis.botScore || 0) + "/100", white],
    ["Est. Real Followers", fmt(analysis.estimatedRealFollowers || 0), green],
    ["Est. Fake %", (analysis.estimatedFakePercent || 0) + "%", red],
  ];
  ac.forEach(([l, v, c], i) => {
    const ax = m + 60 + i * 38;
    S(6.5); N(); txt(dG); doc.text(l, ax, y + 7);
    S(10); B(); txt(c); doc.text(v, ax, y + 15);
  }); y += 40;

  B(); S(10); txt(pink); doc.text("CONTENT BREAKDOWN", m, y); y += 6;
  fill(card); doc.roundedRect(m, y, W - m * 2, 18, 2, 2, "F");
  const cs: [string, string][] = [
    ["Photos", String(analysis.contentType?.photos || 0)],
    ["Videos", String(analysis.contentType?.videos || 0)],
    ["Avg Caption", (analysis.captionAvgLength || 0) + " chars"],
    ["Hashtags", (analysis.hashtagUsage || 0) + "/" + (profile.recentPosts?.length || 0)],
  ];
  const cw = (W - m * 2) / 4;
  cs.forEach(([l, v], i) => {
    const cx2 = m + i * cw;
    S(6.5); N(); txt(dG); doc.text(l, cx2 + cw / 2, y + 6, { align: "center" });
    S(10); B(); txt(white); doc.text(v, cx2 + cw / 2, y + 13, { align: "center" });
  });

  const fy = H - 14;
  drw(rgb(50, 50, 60)); doc.setLineWidth(0.2); doc.line(m, fy - 4, W - m, fy - 4);
  S(7.5); N(); txt(dG);
  doc.text("Generated by Insta 1011  |  instagram.com/ARVINDJAAT1011", m, fy);
  doc.text("Real Instagram Profile Intelligence", W - m, fy, { align: "right" });
  fill(purple); doc.rect(0, H - 3, W / 3, 3, "F");
  fill(pink); doc.rect(W / 3, H - 3, W / 3, 3, "F");
  fill(orange); doc.rect((W * 2) / 3, H - 3, W / 3, 3, "F");

  return Buffer.from(doc.output("arraybuffer"));
}

// GET — browser navigates here directly to download
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const cached = await db.select().from(analysisCache)
      .where(eq(analysisCache.username, username.toLowerCase())).limit(1);

    if (!cached.length || !cached[0].profileData || !cached[0].analysisData) {
      return NextResponse.json({ error: "No data found. Analyze the profile first." }, { status: 404 });
    }

    const profile = cached[0].profileData;
    const analysis = cached[0].analysisData;
    const pdfBuf = buildPDF(profile, analysis);
    const filename = "insta1011_" + username.toLowerCase().replace(/[^a-z0-9]/g, "") + "_report.pdf";

    return new NextResponse(new Uint8Array(pdfBuf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}

// POST also supported
export async function POST(request: NextRequest) {
  try {
    const { profile, analysis } = await request.json();
    if (!profile || !analysis) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const pdfBuf = buildPDF(profile, analysis);
    const filename = "insta1011_" + (profile.username || "report").toLowerCase().replace(/[^a-z0-9]/g, "") + "_report.pdf";

    return new NextResponse(new Uint8Array(pdfBuf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
