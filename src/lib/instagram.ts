import { execSync } from "child_process";

export interface InstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  isBusinessAccount: boolean;
  category: string;
  externalUrl: string;
  userId: string;
  recentPosts: InstagramPost[];
}

export interface InstagramPost {
  id: string;
  shortcode: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isVideo: boolean;
}

export interface ProfileAnalysis {
  // Core engagement
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  totalLikes: number;
  totalComments: number;
  medianLikes: number;
  medianComments: number;
  maxLikes: number;
  maxComments: number;
  minLikes: number;
  likesToCommentsRatio: number;
  // Posting behavior
  postFrequency: string;
  postsPerDay: number;
  postsPerWeek: number;
  contentType: { photos: number; videos: number; videoPercent: number };
  captionAvgLength: number;
  hashtagUsage: number;
  avgHashtagsPerPost: number;
  emojiUsage: number;
  mentionUsage: number;
  // Follower metrics
  followerToFollowingRatio: number;
  followBackRate: number;
  followersPerPost: number;
  // Scores
  popularityScore: number;
  growthPotential: string;
  accountQuality: string;
  verifiedStatus: string;
  accountType: string;
  audienceReach: string;
  estimatedReach: number;
  estimatedImpressions: number;
  estimatedEarningsMin: number;
  estimatedEarningsMax: number;
  influencerTier: string;
  // Account age
  accountAgeDays: number;
  accountAgeLabel: string;
  accountCreatedApprox: string;
  // Authenticity
  botScore: number;
  botLabel: string;
  suspiciousSignals: string[];
  authenticityScore: number;
  estimatedRealFollowers: number;
  estimatedFakePercent: number;
  credibilityGrade: string;
  // Engagement consistency
  engagementStdDev: number;
  engagementConsistency: string;
  bestPost: { likes: number; comments: number; index: number } | null;
  worstPost: { likes: number; comments: number; index: number } | null;
  viralPostCount: number;
  // Trends
  engagementTrend: number[];
  likesTrend: number[];
  commentsTrend: number[];
  trendDirection: string;
  // Bio analysis
  bioLength: number;
  bioHasLink: boolean;
  bioHasHashtags: boolean;
  bioHasCTA: boolean;
  bioScore: number;
}

function estimateAccountAge(userId: string) {
  const id = parseInt(userId, 10);
  if (!id || isNaN(id)) return { days: 0, label: "Unknown", createdApprox: "Unknown" };
  const now = new Date();
  const anchors: [number, Date][] = [
    [1, new Date("2010-10-06")], [25e6, new Date("2011-10-01")], [250e6, new Date("2013-04-01")],
    [1.5e9, new Date("2015-08-01")], [5e9, new Date("2017-05-01")], [1e10, new Date("2018-06-01")],
    [3e10, new Date("2019-12-01")], [5e10, new Date("2021-06-01")], [6e10, new Date("2023-01-01")],
    [7e10, new Date("2025-01-01")], [8e10, new Date("2026-06-01")],
  ];
  let estimatedDate: Date;
  if (id <= anchors[0][0]) estimatedDate = anchors[0][1];
  else if (id >= anchors[anchors.length - 1][0]) estimatedDate = anchors[anchors.length - 1][1];
  else {
    let lo = anchors[0], hi = anchors[1];
    for (let i = 1; i < anchors.length; i++) { if (id <= anchors[i][0]) { lo = anchors[i - 1]; hi = anchors[i]; break; } }
    const f = (id - lo[0]) / (hi[0] - lo[0]);
    estimatedDate = new Date(lo[1].getTime() + f * (hi[1].getTime() - lo[1].getTime()));
  }
  const days = Math.max(1, Math.round((now.getTime() - estimatedDate.getTime()) / 86400000));
  let label: string;
  const yrs = Math.round(days / 365);
  if (days > 365 * 10) label = `~${yrs} years (OG)`;
  else if (days > 365 * 5) label = `~${yrs} years (Veteran)`;
  else if (days > 365 * 2) label = `~${yrs} years`;
  else if (days > 365) label = `~${Math.round(days / 30)} months`;
  else if (days > 30) label = `~${Math.round(days / 30)} months`;
  else label = `~${days} days (New)`;
  return { days, label, createdApprox: estimatedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) };
}

function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, v) => s + (v - avg) ** 2, 0) / arr.length);
}

function analyzeBio(bio: string): { bioLength: number; bioHasLink: boolean; bioHasHashtags: boolean; bioHasCTA: boolean; bioScore: number } {
  const bioLength = bio.length;
  const bioHasLink = /https?:\/\/|linktr\.ee|linkin\.bio|bit\.ly/i.test(bio);
  const bioHasHashtags = /#\w+/.test(bio);
  const ctas = /follow|click|check|visit|shop|dm|link|subscribe|book|order|download/i;
  const bioHasCTA = ctas.test(bio);
  let bioScore = 0;
  if (bioLength > 10) bioScore += 15;
  if (bioLength > 50) bioScore += 15;
  if (bioLength > 100) bioScore += 10;
  if (bioHasLink) bioScore += 20;
  if (bioHasHashtags) bioScore += 10;
  if (bioHasCTA) bioScore += 15;
  if (/[\u{1F000}-\u{1FFFF}]/u.test(bio)) bioScore += 15;
  return { bioLength, bioHasLink, bioHasHashtags, bioHasCTA, bioScore: Math.min(100, bioScore) };
}

function generateAnalysis(profile: InstagramProfile): ProfileAnalysis {
  const posts = profile.recentPosts;
  const n = posts.length || 1;
  const F = profile.followersCount;

  const totalLikes = posts.reduce((a, p) => a + p.likes, 0);
  const totalComments = posts.reduce((a, p) => a + p.comments, 0);
  const avgLikes = Math.round(totalLikes / n);
  const avgComments = Math.round(totalComments / n);
  const engagementRate = F > 0 ? (((totalLikes + totalComments) / n) / F) * 100 : 0;

  const likesArr = posts.map(p => p.likes);
  const commentsArr = posts.map(p => p.comments);
  const engArr = posts.map(p => p.likes + p.comments);

  const medianLikes = median(likesArr);
  const medianComments = median(commentsArr);
  const maxLikes = Math.max(...likesArr, 0);
  const minLikes = Math.min(...(likesArr.length ? likesArr : [0]));
  const maxComments = Math.max(...commentsArr, 0);
  const likesToCommentsRatio = totalComments > 0 ? Math.round((totalLikes / totalComments) * 10) / 10 : 0;

  const videos = posts.filter(p => p.isVideo).length;
  const photos = n - videos;
  const videoPercent = Math.round((videos / n) * 100);

  const ratio = profile.followingCount > 0 ? profile.followersCount / profile.followingCount : profile.followersCount;
  const followBackRate = F > 0 ? Math.min(100, Math.round((profile.followingCount / F) * 10000) / 100) : 0;
  const followersPerPost = profile.postsCount > 0 ? Math.round(F / profile.postsCount) : 0;

  // Caption analysis
  const captionAvgLength = Math.round(posts.reduce((a, p) => a + (p.caption?.length || 0), 0) / n);
  const hashtagPosts = posts.filter(p => p.caption?.includes("#"));
  const hashtagUsage = hashtagPosts.length;
  const avgHashtagsPerPost = Math.round(posts.reduce((a, p) => {
    const m = p.caption?.match(/#\w+/g);
    return a + (m ? m.length : 0);
  }, 0) / n * 10) / 10;
  const emojiUsage = posts.filter(p => /[\u{1F000}-\u{1FFFF}]/u.test(p.caption || "")).length;
  const mentionUsage = posts.filter(p => /@\w+/.test(p.caption || "")).length;

  // Account age
  const age = estimateAccountAge(profile.userId);
  const postsPerDay = age.days > 0 ? Math.round((profile.postsCount / age.days) * 100) / 100 : 0;
  const postsPerWeek = Math.round(postsPerDay * 7 * 10) / 10;

  // Popularity score (weighted multi-factor)
  let popularityScore = 0;
  // Followers weight (40pts)
  if (F > 50e6) popularityScore += 40;
  else if (F > 10e6) popularityScore += 36;
  else if (F > 1e6) popularityScore += 30;
  else if (F > 100e3) popularityScore += 24;
  else if (F > 10e3) popularityScore += 18;
  else if (F > 1e3) popularityScore += 10;
  else popularityScore += 4;
  // Engagement weight (25pts)
  if (engagementRate > 6) popularityScore += 25;
  else if (engagementRate > 3) popularityScore += 20;
  else if (engagementRate > 1.5) popularityScore += 15;
  else if (engagementRate > 0.5) popularityScore += 8;
  else popularityScore += 3;
  // Verified (10pts)
  if (profile.isVerified) popularityScore += 10;
  // Posting consistency (10pts)
  if (postsPerWeek >= 5) popularityScore += 10;
  else if (postsPerWeek >= 2) popularityScore += 7;
  else if (postsPerWeek >= 0.5) popularityScore += 4;
  // Account age (10pts)
  if (age.days > 365 * 5) popularityScore += 10;
  else if (age.days > 365 * 2) popularityScore += 7;
  else if (age.days > 365) popularityScore += 4;
  // Ratio (5pts)
  if (ratio > 100) popularityScore += 5;
  else if (ratio > 10) popularityScore += 3;
  popularityScore = Math.min(100, popularityScore);

  // Influencer tier
  let influencerTier: string;
  if (F > 10e6) influencerTier = "Mega Influencer";
  else if (F > 1e6) influencerTier = "Macro Influencer";
  else if (F > 100e3) influencerTier = "Mid-Tier Influencer";
  else if (F > 10e3) influencerTier = "Micro Influencer";
  else if (F > 1e3) influencerTier = "Nano Influencer";
  else influencerTier = "Rising Creator";

  // Estimated earnings (CPM-based)
  const cpmLow = F > 1e6 ? 15 : F > 100e3 ? 10 : F > 10e3 ? 5 : 2;
  const cpmHigh = F > 1e6 ? 50 : F > 100e3 ? 30 : F > 10e3 ? 15 : 8;
  const estimatedReach = Math.round(avgLikes * 3.5 + avgComments * 10);
  const estimatedImpressions = Math.round(estimatedReach * 1.8);
  const estimatedEarningsMin = Math.round((estimatedReach / 1000) * cpmLow);
  const estimatedEarningsMax = Math.round((estimatedReach / 1000) * cpmHigh);

  // Quality labels
  let growthPotential = "Low";
  if (engagementRate > 3 && ratio > 5) growthPotential = "Explosive";
  else if (engagementRate > 2 && ratio > 2) growthPotential = "Very High";
  else if (engagementRate > 1) growthPotential = "High";
  else if (engagementRate > 0.5) growthPotential = "Medium";

  let accountQuality = "Starter";
  if (popularityScore >= 90) accountQuality = "Elite";
  else if (popularityScore >= 75) accountQuality = "Professional";
  else if (popularityScore >= 55) accountQuality = "Growing";
  else if (popularityScore >= 35) accountQuality = "Active";

  let audienceReach = "Local";
  if (F > 10e6) audienceReach = "Global Icon";
  else if (F > 1e6) audienceReach = "Global";
  else if (F > 100e3) audienceReach = "National";
  else if (F > 10e3) audienceReach = "Regional";

  // Bot analysis
  const botInfo = (() => {
    const signals: string[] = [];
    let bp = 0;
    if (F > 10000 && engagementRate < 0.5) { bp += 25; signals.push("Very low engagement for follower count"); }
    else if (F > 10000 && engagementRate < 1) { bp += 10; signals.push("Below-average engagement rate"); }
    if (likesToCommentsRatio > 200 && F > 5000) { bp += 15; signals.push("Unusual like-to-comment ratio (possible bot likes)"); }
    else if (likesToCommentsRatio > 100 && F > 5000) { bp += 8; signals.push("High like-to-comment ratio"); }
    if (ratio < 1.2 && F > 1000) { bp += 20; signals.push("Follow-for-follow pattern detected"); }
    else if (ratio < 2 && F > 5000) { bp += 10; signals.push("Following count relatively high"); }
    if (profile.postsCount < 10 && F > 10000) { bp += 20; signals.push("Very few posts for follower count"); }
    else if (profile.postsCount < 50 && F > 100000) { bp += 15; signals.push("Low post count relative to followers"); }
    if (age.days > 0 && F / age.days > 50000 && !profile.isVerified && F < 10e6) { bp += 15; signals.push("Unusually rapid follower growth"); }
    // Engagement variance check
    if (posts.length >= 3) {
      const sd = stdDev(engArr);
      const mean = engArr.reduce((a, b) => a + b, 0) / engArr.length;
      if (mean > 0 && sd / mean > 1.5) { bp += 8; signals.push("Highly irregular engagement (possible manipulation)"); }
    }
    if (profile.isVerified) bp = Math.max(0, bp - 20);
    if (F > 50e6) bp = Math.max(0, bp - 15);
    bp = Math.min(100, Math.max(0, bp));
    const authenticityScore = 100 - bp;
    let fakePct: number;
    if (bp >= 60) fakePct = 30 + Math.round((bp - 60) * 0.75);
    else if (bp >= 30) fakePct = 10 + Math.round((bp - 30) * 0.67);
    else fakePct = Math.round(bp * 0.33);
    fakePct = Math.min(60, fakePct);
    let botLabel: string;
    if (bp <= 10) botLabel = "Very Clean";
    else if (bp <= 25) botLabel = "Mostly Authentic";
    else if (bp <= 45) botLabel = "Some Suspicion";
    else if (bp <= 65) botLabel = "Moderate Risk";
    else botLabel = "High Risk";
    if (!signals.length) signals.push("No suspicious patterns detected");
    return { botScore: bp, botLabel, suspiciousSignals: signals, authenticityScore, estimatedRealFollowers: Math.round(F * (1 - fakePct / 100)), estimatedFakePercent: fakePct };
  })();

  // Credibility grade
  let credibilityGrade: string;
  if (botInfo.authenticityScore >= 90 && profile.isVerified) credibilityGrade = "A+";
  else if (botInfo.authenticityScore >= 85) credibilityGrade = "A";
  else if (botInfo.authenticityScore >= 70) credibilityGrade = "B";
  else if (botInfo.authenticityScore >= 50) credibilityGrade = "C";
  else if (botInfo.authenticityScore >= 30) credibilityGrade = "D";
  else credibilityGrade = "F";

  // Engagement consistency
  const engSD = stdDev(engArr);
  const engMean = engArr.length ? engArr.reduce((a, b) => a + b, 0) / engArr.length : 0;
  const cv = engMean > 0 ? engSD / engMean : 0;
  let engagementConsistency: string;
  if (cv < 0.2) engagementConsistency = "Very Consistent";
  else if (cv < 0.4) engagementConsistency = "Consistent";
  else if (cv < 0.7) engagementConsistency = "Moderate";
  else engagementConsistency = "Inconsistent";

  // Best/worst posts
  let bestPost = null, worstPost = null;
  if (posts.length) {
    let bIdx = 0, wIdx = 0;
    posts.forEach((p, i) => {
      if (p.likes + p.comments > posts[bIdx].likes + posts[bIdx].comments) bIdx = i;
      if (p.likes + p.comments < posts[wIdx].likes + posts[wIdx].comments) wIdx = i;
    });
    bestPost = { likes: posts[bIdx].likes, comments: posts[bIdx].comments, index: bIdx };
    worstPost = { likes: posts[wIdx].likes, comments: posts[wIdx].comments, index: wIdx };
  }

  // Viral posts (>2x average)
  const viralThreshold = (avgLikes + avgComments) * 2;
  const viralPostCount = posts.filter(p => p.likes + p.comments > viralThreshold).length;

  // Trend direction
  let trendDirection = "Stable";
  if (posts.length >= 4) {
    const firstHalf = engArr.slice(0, Math.floor(engArr.length / 2));
    const secondHalf = engArr.slice(Math.floor(engArr.length / 2));
    const fAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const sAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const change = fAvg > 0 ? ((sAvg - fAvg) / fAvg) * 100 : 0;
    if (change > 20) trendDirection = "Declining";
    else if (change > 5) trendDirection = "Slightly Declining";
    else if (change < -20) trendDirection = "Growing Fast";
    else if (change < -5) trendDirection = "Growing";
  }

  // Bio analysis
  const bio = analyzeBio(profile.biography || "");

  return {
    engagementRate: Math.round(engagementRate * 1000) / 1000,
    avgLikes, avgComments, totalLikes, totalComments,
    medianLikes, medianComments, maxLikes, maxComments, minLikes, likesToCommentsRatio,
    postFrequency: profile.postsCount > 5000 ? "Hyper Active" : profile.postsCount > 2000 ? "Very Active" : profile.postsCount > 500 ? "Active" : profile.postsCount > 100 ? "Moderate" : "Low",
    postsPerDay, postsPerWeek,
    contentType: { photos, videos, videoPercent },
    captionAvgLength, hashtagUsage, avgHashtagsPerPost, emojiUsage, mentionUsage,
    followerToFollowingRatio: Math.round(ratio * 100) / 100,
    followBackRate, followersPerPost,
    popularityScore, growthPotential, accountQuality,
    verifiedStatus: profile.isVerified ? "Verified" : "Not Verified",
    accountType: profile.isBusinessAccount ? "Business / Creator" : "Personal",
    audienceReach, estimatedReach, estimatedImpressions,
    estimatedEarningsMin, estimatedEarningsMax, influencerTier,
    accountAgeDays: age.days, accountAgeLabel: age.label, accountCreatedApprox: age.createdApprox,
    ...botInfo, credibilityGrade,
    engagementStdDev: Math.round(engSD), engagementConsistency,
    bestPost, worstPost, viralPostCount,
    engagementTrend: posts.map(p => F > 0 ? ((p.likes + p.comments) / F) * 100 : 0),
    likesTrend: likesArr, commentsTrend: commentsArr, trendDirection,
    ...bio,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseUser(user: any): { profile: InstagramProfile; analysis: ProfileAnalysis } {
  const recentPosts: InstagramPost[] = (user.edge_owner_to_timeline_media?.edges || [])
    .slice(0, 12).map((edge: { node: Record<string, unknown> }) => {
      const node = edge.node;
      const capEdges = (node.edge_media_to_caption as { edges?: Array<{ node?: { text?: string } }> })?.edges;
      return {
        id: String(node.id || ""), shortcode: String(node.shortcode || ""),
        imageUrl: String(node.thumbnail_src || node.display_url || ""),
        caption: capEdges?.[0]?.node?.text || "",
        likes: (node.edge_media_preview_like as { count?: number })?.count ?? (node.edge_liked_by as { count?: number })?.count ?? 0,
        comments: (node.edge_media_to_comment as { count?: number })?.count ?? 0,
        timestamp: new Date(((node.taken_at_timestamp as number) || 0) * 1000).toISOString(),
        isVideo: Boolean(node.is_video),
      };
    });

  const profile: InstagramProfile = {
    username: user.username || "", fullName: user.full_name || "", biography: user.biography || "",
    profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || "",
    followersCount: user.edge_followed_by?.count || 0, followingCount: user.edge_follow?.count || 0,
    postsCount: user.edge_owner_to_timeline_media?.count || 0,
    isVerified: user.is_verified || false, isPrivate: user.is_private || false,
    isBusinessAccount: user.is_business_account || user.is_professional_account || false,
    category: user.category_name || user.business_category_name || user.overall_category_name || "",
    externalUrl: user.external_url || "", userId: String(user.id || ""), recentPosts,
  };
  return { profile, analysis: generateAnalysis(profile) };
}

function curlFetch(url: string, headers: Record<string, string>): string | null {
  try {
    const h = Object.entries(headers).map(([k, v]) => `-H "${k}: ${v}"`).join(" ");
    return execSync(`curl -s -m 15 ${h} "${url}"`, { encoding: "utf-8", timeout: 20000, stdio: ["pipe", "pipe", "pipe"] });
  } catch (e) { console.error("curl failed:", e); return null; }
}

export async function fetchInstagramProfile(username: string): Promise<{ profile: InstagramProfile; analysis: ProfileAnalysis } | null> {
  const u = username.replace(/^@/, "").trim().toLowerCase();
  const raw = curlFetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(u)}`, {
    "x-ig-app-id": "936619743392459",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Accept": "*/*", "Accept-Language": "en-US,en;q=0.9",
  });
  if (raw) { try { const d = JSON.parse(raw); if (d?.data?.user) return parseUser(d.data.user); } catch { /* */ } }
  return null;
}
