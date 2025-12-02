# 🚀 Deployment Guide

Quick deployment guide for AI Outbound Operating System.

---

## 🎯 Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   - In Vercel dashboard → Project → Settings → Environment Variables
   - Add: `OPENAI_API_KEY` (if using AI scoring)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## ⚠️ Important: Database Storage

**Current Setup**: File-based JSON storage (`data/leads.json`)

**Problem**: On serverless platforms (Vercel/Netlify), file storage doesn't persist between deployments.

**Solutions**:

### Solution 1: Use Vercel KV (Quick Fix)

1. **Add Vercel KV** in Vercel dashboard
2. **Install dependency**:
   ```bash
   npm install @vercel/kv
   ```
3. **Update `src/lib/db.ts`** to use KV instead of file storage

### Solution 2: Use Supabase (Recommended)

1. **Create account**: https://supabase.com
2. **Create new project**
3. **Install**:
   ```bash
   npm install @supabase/supabase-js
   ```
4. **Create table**:
   ```sql
   CREATE TABLE leads (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     company TEXT NOT NULL,
     email TEXT,
     score INTEGER,
     status TEXT,
     industry TEXT,
     notes TEXT,
     phone TEXT,
     website TEXT,
     title TEXT,
     location TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
5. **Update `src/lib/db.ts`** to use Supabase client

### Solution 3: Use Vercel Postgres

1. **Add Vercel Postgres** in Vercel dashboard
2. **Install**:
   ```bash
   npm install @vercel/postgres
   ```
3. **Update database layer** accordingly

---

## 🔧 Environment Variables

Set these in your deployment platform:

```env
OPENAI_API_KEY=sk-...  # Optional, for AI scoring
```

**Vercel**: Settings → Environment Variables
**Netlify**: Site settings → Environment variables
**Railway**: Variables tab

---

## 📦 Build Configuration

### Vercel (Auto-detected)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Netlify
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Railway
- Build Command: `npm run build`
- Start Command: `npm start`

---

## ✅ Post-Deployment Checklist

- [ ] App is accessible via URL
- [ ] Environment variables are set
- [ ] Database is configured (if upgraded)
- [ ] File uploads work
- [ ] URL imports work
- [ ] Export functionality works
- [ ] Error handling works
- [ ] SSL certificate is active

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in deployment platform
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles: `npm run build`

### Database Not Working
- Verify database connection string
- Check environment variables
- Ensure database is accessible from deployment platform

### File Uploads Fail
- Check file size limits (10MB)
- Verify API route is accessible
- Check serverless function timeout limits

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Setup](https://supabase.com/docs/guides/getting-started)

---

**Need help?** Check the main [NEXT_STEPS.md](./NEXT_STEPS.md) guide for detailed instructions.

