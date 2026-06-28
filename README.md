Hey everyone 👋

I'm Arvind Choudhary, 17 years old from India. I passed my 12th class a few months ago. No coding background, no CS degree, no bootcamp. I learned everything using free AI tools and just kept building.

The result is **Insta 1011** — a free Instagram profile intelligence tool.

🔗 **Try it:** [https://insta-1011.vercel.app](https://insta-1011.vercel.app)
📂 **Source code:** [https://github.com/ajitjaat1011-ui/insta-1011](https://github.com/ajitjaat1011-ui/insta-1011)

---

### What it does

Enter any public Instagram username and get a full analysis:

**📊 58 Real Metrics**
- Engagement rate, avg/median likes & comments
- Follower-to-following ratio
- Posts per day/week
- Hashtag usage, emoji usage, mention count
- Best & worst performing posts
- Viral post count (posts that got >2x average engagement)
- Engagement consistency score & standard deviation

**🤖 Fake Follower Detection**
- Bot score (0-100)
- Authenticity percentage
- Estimated real vs fake follower count
- Credibility grade (A+ to F)
- Suspicious signals list (follow-for-follow patterns, low engagement for size, unusual like/comment ratios, rapid growth flags)

**💰 Money Estimates**
- Estimated earnings per sponsored post (CPM-based)
- Influencer tier classification (Nano → Micro → Mid → Macro → Mega)
- Estimated reach & impressions per post

**📅 Account Intelligence**
- Account age estimation from user ID (piecewise interpolation against 11 known Instagram anchor points from 2010-2026)
- Posts per day since account creation
- Bio optimization score (checks for link, CTA, hashtags, length, emojis)
*📄 PDF Report**
- Server-side generated professional PDF with all metrics
- Dark themed, formatted with sections for profile, score, engagement, authenticity, content breakdown
- Download triggers via GET endpoint (works in every browser, no blob tricks)

**📱 PWA**
- Installable as a phone app on Android & iOS
- Service worker with offline caching
- Custom app icons
- Standalone fullscreen mode

---

### Tech stack (everything free)

| Tool | What it does | Cost |
|------|-------------|------|
| Next.js 16 | Full-stack React framework | Free |
| React 19 | UI | Free |
| Tailwind CSS 4 | Styling | Free |
| Framer Motion | Animations | Free |
| Puter.js | AI (GPT-4o-mini, no API key needed) | Free |
| Neon | PostgreSQL database | Free tier |
| Vercel | Hosting & deployment | Free tier |
| Instagram Internal API | Real profile data via curl | Free |
| jsPDF | Server-side PDF generation | Free |
| Drizzle ORM | Database queries | Free |
| Lucide React | Icons | Free |

**Total development cost: ₹0 ($0)**
### Some technical details people might find interesting

**Instagram data**: Node.js `fetch()` gets TLS-fingerprinted and blocked by Instagram (returns 429). I use `child_process.execSync('curl ...')` which has a proper TLS fingerprint that Instagram accepts. All images are proxied through a server endpoint to avoid CORS/referrer issues.

**Account age**: Instagram user IDs are roughly sequential. I built a piecewise linear interpolation function using 11 known anchor points (Kevin Systrom's ID 1 in Oct 2010 through to IDs in 2026) to estimate when any account was created.

**Bot detection**: Multi-signal scoring system — checks engagement rate vs follower count, like-to-comment ratios, follow-for-follow patterns, post count vs followers, growth rate, and engagement variance (if std dev > 1.5x mean, it flags manipulation).

**PDF download**: `doc.save()` and `blob` downloads fail in sandboxed iframes. The solution is a GET endpoint that generates the PDF server-side and returns it with `Content-Disposition: attachment` — the browser handles the download natively.

**AI**: Uses Puter.js which loads via CDN, requires zero API keys, and streams responses word-by-word. The user's Puter account covers usage (User-Pays model). Supports 5 different AI features all through the same streaming infrastructure.

---
### Design

Apple's 2026 "liquid glass" aesthetic:
- `backdrop-filter: blur(50px) saturate(180%)` on outer panels
- CSS `::after` pseudo-element creates a diagonal shine sweep on hover
- No `backdrop-filter` on inner cards (performance optimization — was causing lag)
- Animated score rings, SVG line charts with stroke-dashoffset animations
- Tab transitions with blur+translate animations

---

### My story

I'm 17. From India. Passed 12th class a few months ago. I don't have a CS degree. I didn't attend any bootcamp. I didn't pay for any course.

I used free AI tools to learn web development and built this entire app — frontend, backend, database, AI integration, PDF generation, PWA, deployment — all by myself.

I'm sharing this because I genuinely believe age and background don't matter. If you have an idea and free tools exist, just build it.

---

### Try it

Go tGo to [https://insta-1011.vercel.app](https://insta-1011.vercel.app), enter any Instagram username (try `cristiano` or `nike`), and see the full analysis.

It's free, no signup, no API key needed.

If you like it, I'd appreciate a ⭐ on [GitHub](https://github.com/ajitjaat1011-ui/insta-1011).

Follow me on Instagram: **@ARVINDJAAT1011** — I'm building more tools like this.

Happy to answer any questions about the tech, the process, or how I learned to code at 17 with free AI tools.

Thanks for reading 🙏

— Arvind Choudhary


---
