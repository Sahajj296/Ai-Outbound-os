# ⚡ Quick Testing Setup - ngrok

For immediate testing without deployment.

---

## Step 1: Install ngrok

Download from: https://ngrok.com/download

Or install via package manager:
```bash
# Windows (via Chocolatey)
choco install ngrok

# Or download the .exe from ngrok.com
```

---

## Step 2: Start Your Dev Server

```bash
npm run dev
```

Keep this running!

---

## Step 3: Start ngrok Tunnel

Open a NEW terminal window:

```bash
ngrok http 3000
```

You'll see something like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

---

## Step 4: Share the ngrok URL

Send testers:
- **App URL**: `https://abc123.ngrok.io` (your ngrok URL)
- **Tester Instructions**: `TESTER_INSTRUCTIONS.html`

---

## ⚠️ Important Notes

- **Keep both terminals open** (dev server + ngrok)
- **URL changes** each time you restart ngrok (free tier)
- **For production testing**, use Vercel deployment instead

---

## Alternative: Use Vercel (Recommended)

For a permanent URL, see `DEPLOYMENT_GUIDE.md`

