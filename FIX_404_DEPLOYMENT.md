# 🔧 Fix 404 Error on Vercel

## ✅ Fixed Issues

1. **Removed `output: 'standalone'`** from `next.config.js`
   - This setting is for Docker/self-hosting, not Vercel
   - Vercel handles build output automatically

2. **Simplified `vercel.json`**
   - Removed redundant build commands (Vercel auto-detects Next.js)
   - Kept function timeouts and headers

---

## 🚀 Redeploy Steps

### Step 1: Commit and Push Changes

```bash
git add .
git commit -m "Fix Vercel 404 error - remove standalone output"
git push
```

### Step 2: Trigger Redeployment

**Option A: Automatic (if GitHub connected)**
- Vercel will auto-deploy on push
- Check Vercel dashboard for new deployment

**Option B: Manual Redeploy**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Or click "Redeploy" button

### Step 3: Verify Environment Variables

Make sure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**To check/add:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both variables exist
3. Add if missing

---

## ✅ After Redeployment

1. **Wait for build to complete** (2-3 minutes)
2. **Visit your Vercel URL**: `https://ai-outbound-os.vercel.app`
3. **Should now show**: Home page instead of 404
4. **Test**: 
   - `/upload` - Upload page
   - `/results` - Results page
   - `/api/test-db` - Database test

---

## 🐛 If Still Getting 404

### Check Build Logs:
1. Vercel Dashboard → Deployments → Click latest deployment
2. Check "Build Logs" tab
3. Look for errors

### Common Issues:

**Issue: Build fails**
- Check for TypeScript errors
- Verify all dependencies installed
- Check environment variables

**Issue: Still 404 after successful build**
- Clear browser cache
- Try incognito mode
- Check if custom domain is configured correctly

**Issue: Environment variables not working**
- Verify variables are set for "Production" environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

---

## 📋 Quick Checklist

- [x] Fixed `next.config.js` (removed standalone)
- [x] Simplified `vercel.json`
- [ ] Committed and pushed changes
- [ ] Triggered redeployment
- [ ] Verified environment variables in Vercel
- [ ] Tested app after redeployment

---

**After pushing changes, Vercel will automatically redeploy. Wait 2-3 minutes and check again!** 🚀

