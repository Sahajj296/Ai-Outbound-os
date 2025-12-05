# 🚀 Quick Deployment Guide - Vercel

Deploy your app in 5 minutes so testers can access it!

---

## Step 1: Push to GitHub (if not already)

```bash
# If you haven't initialized git yet:
git init
git add .
git commit -m "Ready for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 2: Deploy to Vercel

1. **Go to** https://vercel.com
2. **Sign up/Login** (use GitHub account - easiest)
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Vercel auto-detects Next.js** - Click "Deploy"
6. **Wait 2-3 minutes** - Deployment happens automatically
7. **Done!** You'll get a URL like: `https://your-app-name.vercel.app`

---

## Step 3: Share the Link

Send testers:
- **App URL**: `https://your-app-name.vercel.app`
- **Tester Instructions**: `TESTER_INSTRUCTIONS.html` (or PDF)

---

## Environment Variables (Optional - for production features)

If you add Supabase later, add these in Vercel:
- Go to Project Settings → Environment Variables
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## That's it! Your app is live! 🎉
