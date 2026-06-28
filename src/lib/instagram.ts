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

  // Bot / Fake Follower Analysis v2 – June 2026
  // Calibrated against 2024-2026 IG benchmarks (HypeAuditor/Modash public reports)
  // 18 signals, 0-100 botScore (higher = more fake/risk)
  const botInfo = (() => {
    const signals: string[] = [];
    let score = 0;
    const add = (pts: number, msg: string) => { score += pts; signals.push(msg); };

    // ---- 1. Engagement Rate vs Follower-tier benchmark ----
    // IG avg ER 2024-26: nano 1-10k ~3.5%, micro 10-100k ~2.2%, mid 100-500k ~1.6%, macro 500k-1M ~1.3%, 1M+ ~1.0%, 10M+ ~0.6%, 100M+ ~0.4%
    const tierER: [number, number][] = [
      [10000, 3.5], [100000, 2.2], [500000, 1.6], [1000000, 1.3],
      [10000000, 1.0], [100000000, 0.6], [Infinity, 0.4]
    ];
    const expectedER = tierER.find(([cap]) => F < cap)?.[1] ?? 0.4;
    const erRatio = engagementRate / expectedER;
    if (F > 5000) {
      if (erRatio < 0.15) add(28, `Critical low engagement – ${engagementRate}% vs ${expectedER}% expected for this tier`);
      else if (erRatio < 0.30) add(20, `Very low engagement rate for follower count`);
      else if (erRatio < 0.55) add(12, `Below-average engagement rate`);
      else if (erRatio < 0.75) add(5, `Slightly below typical engagement`);
      else if (erRatio > 2.5) add(-4, `Exceptionally high engagement – strong authenticity signal`);
    }

    // ---- 2. Like/Comment ratio health ----
    // Healthy: 15-80:1, suspicious >120, high risk >250, bot-farm >500
    if (F > 3000) {
      if (likesToCommentsRatio > 500) add(18, `Extreme like-to-comment ratio (${likesToCommentsRatio}:1) – bot likes likely`);
      else if (likesToCommentsRatio > 250) add(12, `Very high like-to-comment ratio – possible inauthentic likes`);
      else if (likesToCommentsRatio > 120) add(7, `High like-to-comment ratio`);
      else if (likesToCommentsRatio >= 15 && likesToCommentsRatio <= 80) add(-3, `Healthy comment engagement`);
    }

    // ---- 3. Follower / Following ratio ----
    if (F > 1000) {
      if (ratio < 0.8) add(22, `Follow-for-follow / mass-following pattern`);
      else if (ratio < 1.5) add(14, `Following count unusually high for audience size`);
      else if (ratio < 3) add(6, `Follower ratio below optimal`);
      else if (ratio > 50) add(-3, `Excellent follower authority`);
    }

    // ---- 4. Post count vs followers / age ----
    const postsPerKFollowers = F > 0 ? (profile.postsCount / F) * 1000 : 99;
    if (F > 20000 && profile.postsCount < 12) add(20, `Very few posts for follower count – bought/inherited audience?`);
    else if (F > 100000 && profile.postsCount < 40) add(12, `Low post count relative to followers`);
    if (postsPerKFollowers < 0.05 && F > 50000) add(10, `Abnormally low content volume per follower`);

    // ---- 5. Follower growth velocity ----
    if (age.days > 7 && F > 5000) {
      const followersPerDay = F / age.days;
      if (followersPerDay > 80000 && !profile.isVerified) add(16, `Implausible follower growth velocity`);
      else if (followersPerDay > 25000 && !profile.isVerified && F < 5e6) add(10, `Unusually rapid follower growth`);
      else if (followersPerDay > 8000 && !profile.isVerified && F < 1e6) add(5, `Fast follower growth – verify authenticity`);
    }

    // ---- 6. Engagement consistency / variance ----
    if (posts.length >= 3) {
      const sd = stdDev(engArr);
      const mean = engArr.reduce((a, b) => a + b, 0) / engArr.length || 1;
      const cv = sd / mean;
      if (cv > 1.8) add(9, `Highly irregular engagement – possible manipulation spikes`);
      else if (cv > 1.2) add(4, `Inconsistent engagement pattern`);
      else if (cv < 0.25 && F > 50000) add(6, `Suspiciously uniform engagement – possible pod/bot activity`);
      else if (cv >= 0.35 && cv <= 0.9) add(-2, `Natural engagement variance`);
    }

    // ---- 7. Comment rate vs tier ----
    const commentRate = F > 0 ? (a.avgComments / F) * 100 : 0;
    const expectedCommentRate = expectedER * 0.025; // ~2.5% of ER is typically comments
    if (F > 10000 && commentRate < expectedCommentRate * 0.15) add(10, `Abnormally low comment rate – low audience quality`);
    
    // ---- 8. Likes median vs avg gap (bot spike detection) ----
    if (a.avgLikes > 0 && a.medianLikes > 0) {
      const likeSkew = a.avgLikes / a.medianLikes;
      if (likeSkew > 2.5) add(7, `Engagement heavily skewed by viral outliers – median much lower than average`);
    }

    // ---- 9. Posting frequency anomalies ----
    if (a.postsPerDay > 6) add(8, `Excessive posting frequency – spam/bot-like behavior`);
    else if (a.postsPerDay > 3 && F < 50000) add(3, `High posting frequency`);
    if (a.postsPerDay < 0.015 && F > 100000 && profile.postsCount > 20) add(5, `Dormant posting with large audience – audience decay risk`);

    // ---- 10. Profile completeness ----
    let completeness = 0;
    if ((profile.biography || '').trim().length > 10) completeness++;
    if (profile.externalUrl) completeness++;
    if ((profile.fullName || '').trim().length > 2) completeness++;
    if (profile.category) completeness++;
    // profilePic check not available – assume present
    if (completeness <= 1 && F > 10000) add(8, `Incomplete profile – low trust signal`);
    else if (completeness >= 3) add(-2, `Well-completed profile`);

    // ---- 11. Bio / content spam signals ----
    const bio = (profile.biography || '').toLowerCase();
    const spamTerms = ['buy followers', 'dm for promo', 'follow me', 'follow back', 'f4f'];
    if (spamTerms.some(t => bio.includes(t)) && F > 5000) add(6, `Promotional / follow-bait bio detected`);
    if (a.avgHashtagsPerPost > 25) add(4, `Hashtag stuffing detected`);
    if (a.captionAvgLength < 5 && profile.postsCount > 10) add(3, `Very short / missing captions consistently`);

    // ---- 12. Account age vs followers ----
    if (age.days > 0 && age.days < 60 && F > 50000 && !profile.isVerified) add(18, `Very new account with large following – high risk`);
    else if (age.days > 0 && age.days < 180 && F > 250000 && !profile.isVerified) add(10, `Young account with unusually large audience`);

    // ---- 13. Engagement pod / bought engagement ----
    // Low comment diversity proxy: high like/comment ratio + low comment variance + high consistency
    if (likesToCommentsRatio > 150 && F > 20000) {
      const engCV = posts.length >= 3 ? stdDev(engArr) / (engArr.reduce((s,v)=>s+v,0)/engArr.length || 1) : 1;
      if (engCV < 0.35) add(7, `Bot-like engagement consistency with poor comment rate`);
    }

    // ---- 14. Follower quality decay – ER vs tier deficit ----
    const erDeficit = Math.max(0, expectedER - engagementRate);
    const erFakeSignal = Math.min(18, erDeficit * 12); // roughly map ER gap to fake %
    if (erFakeSignal > 3) score += erFakeSignal * 0.5; // soft add, no signal text to avoid duplication

    // ---- 15. Audience authenticity tier adjustment ----
    // Large verified accounts naturally have lower ER – already in tier benchmark, but give credibility discount
    if (profile.isVerified) score = Math.max(0, score - 18);
    if (profile.isBusinessAccount) score = Math.max(0, score - 2);
    if (F > 50_000_000) score = Math.max(0, score - 12); // mega-celebrities naturally low ER
    else if (F > 10_000_000) score = Math.max(0, score - 7);

    // ---- 16. Positive trust signals ----
    let trust = 0;
    if (a.captionAvgLength >= 30) trust += 1;
    if (a.avgHashtagsPerPost >= 3 && a.avgHashtagsPerPost <= 15) trust += 1;
    if ((profile.externalUrl || '').length > 0) trust += 1;
    if (profile.isBusinessAccount && F > 10000) trust += 1;
    if (a.postsPerWeek >= 2 && a.postsPerWeek <= 14) trust += 1;
    score = Math.max(0, score - trust * 1.5);

    // Clamp 0-100
    score = Math.round(Math.min(100, Math.max(0, score)));

    const authenticityScore = 100 - score;

    // ---- Fake follower % estimation – calibrated 2024-26 ----
    // Base on botScore + ER deficit vs tier
    const erFactor = Math.max(0, Math.min(1, 1 - erRatio));
    let fakePct = score * 0.55 + erFactor * 28;
    // Verified / large accounts cap
    if (profile.isVerified) fakePct *= 0.55;
    if (F > 20_000_000) fakePct *= 0.7;
    fakePct = Math.round(Math.min(72, Math.max(1, fakePct)));
    // Very clean accounts floor
    if (score <= 8) fakePct = Math.min(fakePct, Math.max(2, Math.round(score * 0.6)));

    const estimatedRealFollowers = Math.round(F * (1 - fakePct / 100));

    let botLabel: string;
    if (score <= 9) botLabel = "Very Clean";
    else if (score <= 22) botLabel = "Mostly Authentic";
    else if (score <= 42) botLabel = "Some Suspicion";
    else if (score <= 64) botLabel = "Moderate Risk";
    else if (score <= 80) botLabel = "High Risk";
    else botLabel = "Critical Risk";

    if (!signals.length) signals.push("No suspicious patterns detected – audience looks authentic");

    return { botScore: score, botLabel, suspiciousSignals: signals.slice(0, 6), authenticityScore, estimatedRealFollowers, estimatedFakePercent: fakePct };
  })();


  // Credibility grade

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
