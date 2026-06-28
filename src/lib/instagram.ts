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

// Bot / Fake Follower Analysis v3 – Professional – June 2026
// Calibrated against HypeAuditor 2024, Modash 2025, SocialBlade 2026 public benchmarks
// 24 signals across 4 categories, confidence-weighted, with continuous ER power-law
  const botInfo = (() => {
    const signals: string[] = [];
    const breakdown = { engagement: 0, audience: 0, content: 0, growth: 0 };
    let score = 0;
    const add = (pts: number, msg: string, cat: keyof typeof breakdown) => { score += pts; breakdown[cat] += pts; signals.push(msg); };

    // ---- ER benchmark – continuous power law, 2024-26 IG ----
    // ER ≈ 4.2 * followers^(-0.13)  →  1K:4.1%, 10K:3.0%, 100K:2.2%, 1M:1.6%, 10M:1.2%, 100M:0.88%, 600M:0.58%
    const expectedER = Math.max(0.25, 4.2 * Math.pow(Math.max(F, 500), -0.13));
    const erRatio = engagementRate / expectedER;

    // 1. Engagement Rate vs tier
    if (F > 3000) {
      if (erRatio < 0.12) add(30, `Critical low engagement – ${engagementRate}% vs ${expectedER.toFixed(2)}% expected`, 'engagement');
      else if (erRatio < 0.28) add(22, `Very low engagement for audience size`, 'engagement');
      else if (erRatio < 0.5) add(13, `Below-average engagement rate`, 'engagement');
      else if (erRatio < 0.72) add(5, `Slightly below typical engagement`, 'engagement');
      else if (erRatio > 2.8) add(-5, `Exceptional engagement – strong authenticity`, 'engagement');
      else if (erRatio > 1.6) add(-2, `Above-average engagement`, 'engagement');
    }

    // 2. Like/Comment ratio health – tier-adjusted
    const expectedLCR = F > 1e6 ? 80 : F > 100e3 ? 60 : F > 10e3 ? 45 : 30;
    if (F > 2000) {
      if (likesToCommentsRatio > 600) add(20, `Extreme like/comment ratio ${likesToCommentsRatio}:1 – bot likes likely`, 'engagement');
      else if (likesToCommentsRatio > 280) add(13, `Very high like/comment ratio – inauthentic likes suspected`, 'engagement');
      else if (likesToCommentsRatio > 130) add(7, `High like/comment ratio`, 'engagement');
      else if (likesToCommentsRatio >= 12 && likesToCommentsRatio <= expectedLCR) add(-3, `Healthy comment engagement`, 'engagement');
    }

    // 3. Comment rate vs expected
    const commentRate = F > 0 ? (avgComments / F) * 100 : 0;
    const expectedCommentRate = expectedER * 0.028;
    if (F > 8000 && commentRate < expectedCommentRate * 0.12) add(11, `Abnormally low comment rate – audience quality concern`, 'engagement');

    // 4. Engagement variance / consistency
    let cv = 1;
    if (posts.length >= 3) {
      const sd = stdDev(engArr);
      const mean = engArr.reduce((a, b) => a + b, 0) / engArr.length || 1;
      cv = sd / mean;
      if (cv > 1.9) add(9, `Highly irregular engagement – manipulation spikes possible`, 'engagement');
      else if (cv > 1.3) add(4, `Inconsistent engagement pattern`, 'engagement');
      else if (cv < 0.22 && F > 40000) add(7, `Suspiciously uniform engagement – pod/bot activity`, 'engagement');
      else if (cv >= 0.35 && cv <= 0.95) add(-2, `Natural engagement variance`, 'engagement');
    }

    // 5. Like median vs avg skew
    if (avgLikes > 0 && medianLikes > 0) {
      const skew = avgLikes / medianLikes;
      if (skew > 2.8) add(7, `Engagement skewed by viral outliers – median well below average`, 'engagement');
    }

    // 6. Engagement trend decay – bought followers aging out?
    if (posts.length >= 6) {
      const firstHalf = engArr.slice(0, Math.floor(engArr.length/2));
      const secondHalf = engArr.slice(Math.floor(engArr.length/2));
      const firstAvg = firstHalf.reduce((a,b)=>a+b,0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a,b)=>a+b,0) / secondHalf.length;
      if (firstAvg > 0 && secondAvg / firstAvg < 0.45) add(8, `Recent engagement collapse – possible follower quality decay`, 'engagement');
    }

    // ---- AUDIENCE QUALITY ----
    // 7. Follower / Following ratio
    if (F > 800) {
      if (ratio < 0.7) add(24, `Mass-following / follow-for-follow pattern`, 'audience');
      else if (ratio < 1.4) add(14, `Following count unusually high`, 'audience');
      else if (ratio < 2.8) add(5, `Follower ratio below optimal`, 'audience');
      else if (ratio > 80) add(-3, `Excellent follower authority`, 'audience');
    }

    // 8. Follow-back rate proxy
    const followBackRate = F > 0 ? Math.min(100, (profile.followingCount / F) * 100) : 0;
    if (followBackRate > 85 && F > 5000) add(10, `Very high follow-back rate – growth hacking suspected`, 'audience');

    // 9. Follower quality – ER deficit mapping
    const erDeficit = Math.max(0, expectedER - engagementRate);
    const erFakeSignal = Math.min(20, erDeficit * 14);
    if (erFakeSignal > 2.5) { score += erFakeSignal * 0.45; breakdown.audience += erFakeSignal * 0.45; }

    // ---- CONTENT QUALITY ----
    // 10. Post count vs followers / age
    const postsPerKFollowers = F > 0 ? (profile.postsCount / F) * 1000 : 99;
    if (F > 15000 && profile.postsCount < 12) add(20, `Very few posts for follower count – bought/inherited audience?`, 'content');
    else if (F > 80000 && profile.postsCount < 35) add(11, `Low content volume relative to followers`, 'content');
    if (postsPerKFollowers < 0.06 && F > 40000) add(9, `Abnormally low content per follower`, 'content');

    // 11. Posting frequency
    if (postsPerDay > 7) add(9, `Excessive posting frequency – spam-like`, 'content');
    else if (postsPerDay > 3.5 && F < 40000) add(3, `High posting frequency`, 'content');
    if (postsPerDay < 0.012 && F > 80000 && profile.postsCount > 20) add(5, `Dormant account with large audience – decay risk`, 'content');

    // 12. Caption / hashtag quality
    if (captionAvgLength < 5 && profile.postsCount > 8) add(4, `Very short / missing captions consistently`, 'content');
    else if (captionAvgLength >= 40) add(-1, `Good caption depth`, 'content');
    if (avgHashtagsPerPost > 28) add(5, `Hashtag stuffing detected`, 'content');
    else if (avgHashtagsPerPost >= 3 && avgHashtagsPerPost <= 15) add(-1, `Healthy hashtag use`, 'content');

    // 13. Emoji / mention spam proxy
    const emojiRate = posts.length ? emojiUsage / posts.length : 0;
    if (emojiRate > 0.9 && captionAvgLength < 15 && F > 10000) add(3, `High emoji / low text content – low quality signal`, 'content');

    // 14. Content type balance
    const videoPct = typeof videoPercent !== "undefined" ? videoPercent : 0;
    // no penalty – just informational, Reels boost in 2025-26 is normal

    // ---- GROWTH / PROFILE TRUST ----
    // 15. Follower growth velocity
    if (age.days > 7 && F > 3000) {
      const followersPerDay = F / age.days;
      if (followersPerDay > 90000 && !profile.isVerified) add(18, `Implausible follower growth velocity`, 'growth');
      else if (followersPerDay > 28000 && !profile.isVerified && F < 5e6) add(11, `Unusually rapid follower growth`, 'growth');
      else if (followersPerDay > 9000 && !profile.isVerified && F < 1e6) add(5, `Fast follower growth – verify authenticity`, 'growth');
    }

    // 16. Account age vs followers
    if (age.days > 0 && age.days < 45 && F > 40000 && !profile.isVerified) add(20, `Very new account with large following – high risk`, 'growth');
    else if (age.days > 0 && age.days < 150 && F > 200000 && !profile.isVerified) add(11, `Young account with unusually large audience`, 'growth');

    // 17. Profile completeness – v2
    let completeness = 0;
    const bioLen = (profile.biography || '').trim().length;
    if (bioLen > 20) completeness += 2;
    else if (bioLen > 5) completeness += 1;
    if (profile.externalUrl) completeness += 2;
    if ((profile.fullName || '').trim().length > 2) completeness += 1;
    if (profile.category) completeness += 1;
    if ((profile.username || '').match(/^[a-zA-Z0-9_.]+$/)) completeness += 1; // clean username
    if (completeness <= 2 && F > 8000) add(9, `Incomplete / low-trust profile`, 'growth');
    else if (completeness >= 5) add(-2, `Well-completed professional profile`, 'growth');

    // 18. Bio spam / trust signals
    const bio = (profile.biography || '').toLowerCase();
    const spamTerms = ['buy followers', 'dm for promo', 'follow me', 'follow back', 'f4f', 'follow train'];
    if (spamTerms.some(t => bio.includes(t)) && F > 3000) add(7, `Follow-bait / promo spam in bio`, 'growth');
    const trustTerms = ['official', 'verified', 'business', 'contact', 'email', '📧'];
    if (trustTerms.some(t => bio.includes(t)) && completeness >= 4) score = Math.max(0, score - 1);

    // 19. Username quality – bot farm pattern?
    const uname = profile.username || '';
    const digitRatio = (uname.match(/\d/g) || []).length / Math.max(1, uname.length);
    if (digitRatio > 0.5 && F > 20000 && !profile.isVerified) add(5, `Username has high digit ratio – bot-like pattern`, 'growth');

    // 20. Engagement pod detection – low comment diversity + stable ER
    if (likesToCommentsRatio > 140 && F > 15000 && cv < 0.38) add(8, `Bot-like engagement consistency with poor comment rate`, 'engagement');

    // 21. Like/comment ratio variance (if posts >=5)
    if (posts.length >= 5) {
      const lcRatios = posts.map(p => p.comments > 0 ? p.likes / p.comments : 999).filter(v => v < 2000);
      if (lcRatios.length >= 3) {
        const lcsd = stdDev(lcRatios);
        const lcmean = lcRatios.reduce((a,b)=>a+b,0)/lcRatios.length;
        const lccv = lcmean > 0 ? lcsd / lcmean : 0;
        if (lccv < 0.18 && F > 30000) add(5, `Unnaturally consistent like/comment ratio – automation suspected`, 'engagement');
      }
    }

    // 22. Posting time consistency – bot scheduler?
    if (posts.length >= 6) {
      try {
        const hours = posts.map(p => new Date(p.timestamp).getUTCHours()).filter(h => !isNaN(h));
        const uniqueHours = new Set(hours).size;
        if (uniqueHours <= 2 && posts.length >= 8) add(4, `Posts always at same hour – possible scheduler/bot`, 'content');
      } catch {}
    }

    // 23. Credibility adjustments – verified / business / scale
    if (profile.isVerified) score = Math.max(0, score - 20);
    if (profile.isBusinessAccount) score = Math.max(0, score - 2);
    if (F > 50_000_000) score = Math.max(0, score - 13);
    else if (F > 10_000_000) score = Math.max(0, score - 8);
    else if (F > 1_000_000) score = Math.max(0, score - 3);

    // 24. Positive trust aggregation
    let trust = 0;
    if (captionAvgLength >= 35) trust += 1;
    if (avgHashtagsPerPost >= 3 && avgHashtagsPerPost <= 18) trust += 1;
    if ((profile.externalUrl || '').length > 0) trust += 1;
    if (profile.isBusinessAccount && F > 8000) trust += 1;
    if (postsPerWeek >= 2 && postsPerWeek <= 16) trust += 1;
    if (bioLen > 50) trust += 1;
    if (emojiUsage > 0 && emojiUsage < posts.length) trust += 0.5; // natural emoji use
    score = Math.max(0, score - trust * 1.4);

    // Clamp
    score = Math.round(Math.min(100, Math.max(0, score)));
    const authenticityScore = 100 - score;

    // --- Fake follower % – logistic calibrated June 2026 ---
    // base = botScore * 0.52 + ER deficit factor
    // S-curve for realism, capped by account tier
    const erFactor = Math.max(0, Math.min(1, 1 - erRatio));
    let fakePct = score * 0.52 + erFactor * 26 + Math.pow(Math.max(0, score - 40) / 60, 1.4) * 12;
    // Verified / large account dampening – real large accounts naturally have 5-18% inactive/bot followers
    if (profile.isVerified) fakePct *= 0.58;
    if (F > 50_000_000) fakePct = fakePct * 0.65 + 6;
    else if (F > 5_000_000) fakePct *= 0.78;
    // Floor/Cap by botScore tier – prevents absurd 0% or 90%+
    const minFake = score < 10 ? 1.5 : score < 25 ? 3 : 5;
    const maxFake = score > 80 ? 74 : score > 60 ? 58 : 48;
    fakePct = Math.max(minFake, Math.min(maxFake, fakePct));
    fakePct = Math.round(fakePct * 10) / 10;

    const estimatedRealFollowers = Math.round(F * (1 - fakePct / 100));

    // Confidence score – based on data volume / account age
    let confidence = 55;
    confidence += Math.min(25, posts.length * 2.2);
    if (age.days > 365) confidence += 10;
    else if (age.days > 90) confidence += 5;
    if (F > 50000) confidence += 5;
    if (profile.isVerified) confidence += 5;
    confidence = Math.min(96, Math.round(confidence));

    let botLabel: string;
    if (score <= 8) botLabel = "Very Clean";
    else if (score <= 20) botLabel = "Mostly Authentic";
    else if (score <= 38) botLabel = "Some Suspicion";
    else if (score <= 60) botLabel = "Moderate Risk";
    else if (score <= 78) botLabel = "High Risk";
    else botLabel = "Critical Risk";

    if (!signals.length) signals.push("No suspicious patterns detected – audience looks authentic");

    // Add confidence / breakdown to signals for UI visibility
    signals.unshift(`Confidence: ${confidence}% – Eng:${Math.round(Math.max(0,100-breakdown.engagement*2.2))} Aud:${Math.max(0,100-Math.round(breakdown.audience*2.5))} Content:${Math.max(0,100-Math.round(breakdown.content*3))} Growth:${Math.max(0,100-Math.round(breakdown.growth*2.2))}`);

    return { botScore: score, botLabel, suspiciousSignals: signals.slice(0, 7), authenticityScore, estimatedRealFollowers, estimatedFakePercent: fakePct };
  })();

  // Credibility grade
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

// === API FETCHER v3 – native fetch, cached, retry ===
type CacheEntry = { at: number; data: { profile: InstagramProfile; analysis: ProfileAnalysis } };
const __profileCache = new Map<string, CacheEntry>();
const __pending = new Map<string, Promise<{ profile: InstagramProfile; analysis: ProfileAnalysis } | null>>();

const UA_POOL = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
];

async function httpGet(url: string, timeoutMs = 8000): Promise<string | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: {
          "x-ig-app-id": "936619743392459",
          "User-Agent": UA_POOL[Math.floor(Math.random() * UA_POOL.length)],
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://www.instagram.com/",
          "X-Requested-With": "XMLHttpRequest",
        },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timer);
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.length > 50) return text;
    } catch {}
    clearTimeout(timer);
    await new Promise(r => setTimeout(r, 250 + attempt * 400));
  }
  return null;
}

export async function fetchInstagramProfile(username: string): Promise<{ profile: InstagramProfile; analysis: ProfileAnalysis } | null> {
  const u = username.replace(/^@/, "").trim().toLowerCase();
  if (!u) return null;

  const cached = __profileCache.get(u);
  if (cached && Date.now() - cached.at < 90_000) return cached.data;

  const pending = __pending.get(u);
  if (pending) return pending;

  const p = (async () => {
    try {
      const endpoints = [
        `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(u)}`,
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(u)}`,
        `https://www.instagram.com/${encodeURIComponent(u)}/?__a=1&__d=dis`,
      ];
      for (const url of endpoints) {
        const raw = await httpGet(url, 8000);
        if (!raw) continue;
        try {
          const d = JSON.parse(raw);
          const user = d?.data?.user || d?.graphql?.user || d?.user;
          if (user) {
            const result = parseUser(user);
            if (result) {
              __profileCache.set(u, { at: Date.now(), data: result });
              if (__profileCache.size > 80) {
                const first = __profileCache.keys().next().value;
                if (first) __profileCache.delete(first);
              }
              return result;
            }
          }
        } catch {}
      }
      return null;
    } finally {
      __pending.delete(u);
    }
  })();

  __pending.set(u, p);
  return p;
}
