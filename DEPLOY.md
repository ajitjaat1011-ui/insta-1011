# 🚀 Deploy Insta 1011 — Free (GitHub + Vercel + Neon)

## Total time: ~10 minutes. Total cost: $0.

---

## Step 1: Create Neon Database (2 min)

1. Go to **[neon.tech](https://neon.tech)** → Sign up free (use GitHub login)
2. Click **"New Project"**
   - Name: `insta1011`
   - Region: Pick closest to you
   - Click **Create Project**
3. You'll see a **connection string** like:
   ```
   postgresql://neondb_owner:abc123@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Copy this entire string** — you'll need it in Step 3

---

## Step 2: Push Code to GitHub (3 min)

1. Go to **[github.com](https://github.com)** → Sign in
2. Click **"+"** → **"New repository"**
   - Name: `insta-1011`
   - Make it **Public** or **Private** (your choice)
   - Do NOT add README (we already have code)
   - Click **Create repository**
3. Open terminal on your computer and run:

```bash
# Clone/download the project files first, then:
cd insta-1011
git init
git add .
git commit -m "Insta 1011 - Instagram Profile Analyzer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/insta-1011.git
git push -u origin main
```

---

## Step 3: Deploy on Vercel (3 min)

1. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub
2. Click **"Add New Project"**
3. Find **"insta-1011"** in your repos → Click **Import**
4. **Before clicking Deploy**, add the environment variable:
   - Click **"Environment Variables"**
   - Name: `DATABASE_URL`
   - Value: (paste the Neon connection string from Step 1)
   - Click **Add**
5. Click **Deploy** — wait 1-2 minutes
6. ✅ Your app is live at `https://insta-1011.vercel.app` (or similar)

---

## Step 4: Push Database Schema (1 min)

After Vercel deploys, push the database tables to Neon:

```bash
# Set your Neon URL temporarily
export DATABASE_URL="postgresql://neondb_owner:abc123@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Push schema
npx drizzle-kit push
```

Or do it from the Neon SQL console:
```sql
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  profile_data JSONB,
  searched_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS analysis_cache (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  profile_data JSONB,
  analysis_data JSONB,
  cached_at TIMESTAMP DEFAULT NOW() NOT NULL,
  hit_count INTEGER DEFAULT 1
);
```

---

## ✅ Done!

Your app is now live at your Vercel URL. 

### To install as an app on phone:
1. Open the URL in Chrome (Android) or Safari (iPhone)
2. Android: Tap the "Install" banner or ⋮ menu → "Install App"
3. iPhone: Tap Share → "Add to Home Screen"

### Custom domain (optional):
1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `insta1011.com`)
3. Update DNS as instructed

---

## Tech Stack
- **Frontend**: Next.js 16, React 19, Framer Motion, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: Neon PostgreSQL (free tier: 0.5GB)
- **AI**: Puter.js (free GPT-4o-mini, no API key)
- **PDF**: jsPDF (server-side generation)
- **Hosting**: Vercel (free tier: 100GB bandwidth)
- **Instagram Data**: Instagram Internal API via curl

Built by @ARVINDJAAT1011
