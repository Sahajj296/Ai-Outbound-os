# ✅ Database Verification Guide

Step-by-step guide to verify your Supabase database is set up correctly.

---

## 🔍 Quick Verification Checklist

### Step 1: Check Environment Variables

**Local Development:**
- [ ] `.env.local` file exists in project root
- [ ] Contains `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Contains `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Values are correct (not placeholder text)

**To Check:**
```bash
# Windows PowerShell
cat .env.local

# Or open the file in your editor
```

**Expected Format:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Step 2: Verify Supabase Project

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Check Project Status**: Should show "Active" (green)
3. **Verify Table Exists**:
   - Go to "Table Editor" in sidebar
   - Look for `leads` table
   - Should have these columns:
     - id, name, company, email, score, status, industry, notes
     - phone, website, title, location (nullable)
     - created_at, updated_at

---

### Step 3: Test Database Connection

**Option A: Test via Application**

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Upload test leads**:
   - Go to http://localhost:3000/upload
   - Upload `sample-leads.csv`
   - Click "Process Leads"

3. **Check Supabase Dashboard**:
   - Go to Table Editor → `leads` table
   - You should see your processed leads!

**Option B: Test via API Endpoint**

Visit: http://localhost:3000/api/test-db

This will show connection status and test results.

---

### Step 4: Verify Data Operations

**Test Create (Add Leads):**
- [ ] Upload CSV file
- [ ] Leads appear in Supabase table
- [ ] All fields are saved correctly

**Test Read (Get Leads):**
- [ ] Go to results page
- [ ] Leads load from database
- [ ] Statistics are correct

**Test Update (if implemented):**
- [ ] Update a lead via API
- [ ] Changes reflect in Supabase

**Test Delete (if implemented):**
- [ ] Delete a lead via API
- [ ] Lead removed from Supabase

---

### Step 5: Check Console Logs

**In Browser Console (F12):**
- No Supabase connection errors
- No "credentials not found" warnings

**In Terminal (dev server):**
- No database errors
- Successful API calls

---

## 🧪 Manual Testing Steps

### Test 1: Connection Test

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Visit**: http://localhost:3000/api/test-db
3. **Expected Result**: JSON response showing:
   ```json
   {
     "supabaseConfigured": true,
     "connectionTest": "success",
     "canRead": true,
     "canWrite": true
   }
   ```

### Test 2: Full Workflow Test

1. **Upload Leads**:
   - Go to `/upload`
   - Upload `sample-leads.csv`
   - Process leads

2. **Check Database**:
   - Open Supabase Dashboard
   - Table Editor → `leads`
   - Should see 8 leads

3. **Verify Results Page**:
   - Go to `/results`
   - Should show all 8 leads
   - Statistics should be correct

4. **Check Export**:
   - Click "Export CSV"
   - Download should work
   - File should contain all leads

---

## 🐛 Troubleshooting

### Issue: "Supabase credentials not found"

**Solution:**
- Check `.env.local` exists
- Verify variable names are correct (case-sensitive)
- Restart dev server after adding env vars
- Check file is in project root (not in `src/`)

### Issue: "Table 'leads' does not exist"

**Solution:**
- Go to Supabase SQL Editor
- Run `supabase-setup.sql` script
- Verify table appears in Table Editor

### Issue: "Permission denied" or RLS errors

**Solution:**
- Check RLS policies in Supabase
- Verify `anon` key has correct permissions
- Check policy allows INSERT/SELECT operations

### Issue: Leads not appearing in database

**Solution:**
- Check browser console for errors
- Check Supabase logs (Dashboard → Logs)
- Verify API route `/api/process-leads` is working
- Check network tab for failed requests

### Issue: Build fails

**Solution:**
- Run `npm install` to ensure Supabase package is installed
- Check `package.json` includes `@supabase/supabase-js`
- Verify TypeScript compiles: `npm run build`

---

## ✅ Success Indicators

You'll know database is working when:

1. ✅ No errors in console
2. ✅ Leads appear in Supabase table after upload
3. ✅ Results page loads leads from database
4. ✅ Data persists after page refresh
5. ✅ Export includes all database leads
6. ✅ `/api/test-db` endpoint returns success

---

## 📊 Expected Database State

After uploading `sample-leads.csv`:

- **Total Leads**: 8
- **Hot Leads**: ~3-4 (score 80+)
- **Warm Leads**: ~2-3 (score 60-79)
- **Cold Leads**: ~1-2 (score <60)
- **Average Score**: ~70-80

Check these match in:
- Results page statistics
- Supabase table (count rows)
- Export file

---

## 🎯 Quick Test Command

Run this to test everything at once:

```bash
# 1. Check env vars exist
cat .env.local | grep SUPABASE

# 2. Install dependencies
npm install

# 3. Build (should succeed)
npm run build

# 4. Start server
npm run dev

# 5. Visit test endpoint
# http://localhost:3000/api/test-db
```

---

## 📝 Verification Checklist

Print this and check off as you verify:

- [ ] `.env.local` file exists with correct values
- [ ] Supabase project is active
- [ ] `leads` table exists in Supabase
- [ ] Table has all required columns
- [ ] Dev server starts without errors
- [ ] `/api/test-db` returns success
- [ ] Can upload CSV file
- [ ] Leads appear in Supabase table
- [ ] Results page loads leads
- [ ] Export functionality works
- [ ] Data persists after refresh

---

**All checked?** ✅ Your database is fully configured and working!

