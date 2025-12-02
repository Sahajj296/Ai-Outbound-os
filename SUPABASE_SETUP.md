# 🗄️ Supabase Database Setup Guide

Complete guide to set up Supabase database for AI Outbound OS.

---

## Step 1: Create Supabase Account & Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up** (free account available)
3. **Create a new project**:
   - Click "New Project"
   - Choose organization (or create one)
   - Enter project name (e.g., "ai-outbound-os")
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

---

## Step 2: Get Your Credentials

Once your project is ready:

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API"** in the left menu
3. **Copy these values**:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

---

## Step 3: Create Database Table

1. **Go to SQL Editor** in Supabase dashboard
2. **Click "New Query"**
3. **Copy and paste** the contents of `supabase-setup.sql`
4. **Click "Run"** (or press Ctrl+Enter)
5. **Verify** the table was created:
   - Go to "Table Editor" in sidebar
   - You should see `leads` table

---

## Step 4: Configure Environment Variables

### For Local Development

Create/update `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: OpenAI API Key
OPENAI_API_KEY=your-openai-key-here
```

### For Production (Vercel)

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add these variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key-here`
   - `OPENAI_API_KEY` = `your-openai-key-here` (optional)

---

## Step 5: Test the Connection

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Upload some leads** via the upload page
3. **Check Supabase Dashboard**:
   - Go to "Table Editor"
   - Click on `leads` table
   - You should see your leads!

---

## Step 6: Verify Everything Works

✅ **Test these features**:
- [ ] Upload CSV file
- [ ] Process leads
- [ ] View results page
- [ ] Check leads appear in Supabase table
- [ ] Export leads
- [ ] Update/delete leads (if you add UI for this)

---

## 🔒 Security Notes

### Row Level Security (RLS)

The setup script enables RLS but allows all operations. For production:

1. **Implement Authentication** (NextAuth.js, Supabase Auth, etc.)
2. **Update RLS Policies** to restrict access based on user
3. **Use Service Role Key** only on server-side (never expose to client)

### API Keys

- ✅ **anon/public key**: Safe to use in client-side code (protected by RLS)
- ❌ **service_role key**: NEVER expose to client - use only server-side

---

## 🐛 Troubleshooting

### "Supabase credentials not found" Warning

- Check `.env.local` file exists
- Verify variable names are correct
- Restart dev server after adding env vars
- For Vercel: Check environment variables are set

### Database Connection Errors

- Verify Supabase project is active
- Check URL and key are correct
- Ensure table `leads` exists
- Check RLS policies allow operations

### Leads Not Appearing

- Check browser console for errors
- Verify API routes are working
- Check Supabase logs (Dashboard → Logs)
- Verify table structure matches schema

---

## 📊 Database Schema

The `leads` table has these columns:

- `id` (TEXT, PRIMARY KEY) - Unique identifier
- `name` (TEXT, NOT NULL) - Lead name
- `company` (TEXT, NOT NULL) - Company name
- `email` (TEXT, NOT NULL) - Email address
- `score` (INTEGER, 0-100) - Lead score
- `status` (TEXT) - 'hot', 'warm', or 'cold'
- `industry` (TEXT, NOT NULL) - Industry
- `notes` (TEXT, NOT NULL) - AI insights/notes
- `phone` (TEXT, NULLABLE) - Phone number
- `website` (TEXT, NULLABLE) - Website URL
- `title` (TEXT, NULLABLE) - Job title
- `location` (TEXT, NULLABLE) - Location
- `created_at` (TIMESTAMP) - Auto-set on creation
- `updated_at` (TIMESTAMP) - Auto-updated on changes

---

## 🎯 Next Steps

After Supabase is set up:

1. ✅ Test locally with real data
2. ✅ Deploy to Vercel
3. ✅ Add environment variables in Vercel
4. ✅ Test production deployment

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **Next.js + Supabase**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

---

## ✅ Setup Complete!

Your database is now ready for production! 🎉

The application will automatically use Supabase when credentials are configured, and fall back to file storage if not (for local development without Supabase).

