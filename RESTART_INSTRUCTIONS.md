# 🔄 Restart Instructions

## ✅ Environment File Created!

Your `.env.local` file has been created with your Supabase credentials.

---

## ⚠️ IMPORTANT: Restart Required

**Next.js only loads environment variables when the server starts.** You MUST restart your dev server for the changes to take effect.

### Steps:

1. **Stop your current dev server**:
   - Go to the terminal where `npm run dev` is running
   - Press `Ctrl + C` to stop it

2. **Restart the dev server**:
   ```bash
   npm run dev
   ```

3. **Wait for it to start** (you'll see "Ready" message)

4. **Test the connection**:
   - Visit: http://localhost:3000/api/test-db
   - You should now see `"supabaseConfigured": true`

---

## 📋 Before Testing - Create Database Table

Make sure you've created the database table in Supabase:

1. **Go to Supabase Dashboard** → SQL Editor
2. **Click "New Query"**
3. **Copy contents of `supabase-setup.sql`**
4. **Paste and Run** (Ctrl+Enter)
5. **Verify**: Table Editor → `leads` table exists

---

## ✅ Expected Result After Restart

When you visit `/api/test-db`, you should see:

```json
{
  "supabaseConfigured": true,
  "connectionTest": "success",
  "canRead": true,
  "canWrite": true,
  "tableExists": true,
  "overallStatus": "success"
}
```

---

## 🐛 If Still Not Working

1. **Verify `.env.local` file**:
   ```bash
   cat .env.local
   ```
   Should show your credentials

2. **Check file location**:
   - Must be in project root (same folder as `package.json`)
   - Not in `src/` folder

3. **Verify server restart**:
   - Make sure you completely stopped and restarted
   - Check terminal shows "Ready" message

4. **Check Supabase table**:
   - Table `leads` must exist
   - Run `supabase-setup.sql` if not done

---

**Restart your server now and test again!** 🚀

