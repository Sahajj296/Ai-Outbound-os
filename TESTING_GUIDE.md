# 🧪 Testing Guide - AI Outbound OS

Complete testing checklist for all features implemented.

## ✅ Pre-Testing Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console is open (F12)
- [ ] Sample CSV file downloaded (or ready to create)

---

## 📋 Feature Testing Checklist

### 1. Homepage Testing (`/`)

#### Test 1.1: Page Loads
- [ ] Navigate to `http://localhost:3000`
- [ ] Page loads without errors
- [ ] Main heading displays: "AI Outbound Operating System"
- [ ] Sub-headline shows: "Score and prioritize your leads instantly with AI — no CRM needed."

#### Test 1.2: CTA Button
- [ ] "Upload Leads →" button is visible and prominent
- [ ] Click button → navigates to `/upload`
- [ ] Button has proper styling (large, centered)

#### Test 1.3: Steps Section
- [ ] 3-step visualization appears below CTA
- [ ] Steps show: "Upload Leads", "AI scores & explains", "Export & start outreach"
- [ ] Steps are visually balanced and readable

#### Test 1.4: Helper Text
- [ ] Helper text appears below CTA button
- [ ] Text shows: "Supports CSV up to 10MB • Public URL import • AI explanations included"

---

### 2. Upload Page Testing (`/upload`)

#### Test 2.1: Page Loads
- [ ] Navigate to `http://localhost:3000/upload`
- [ ] Page loads without errors
- [ ] Title shows: "Upload Your Leads"
- [ ] Toggle buttons visible (CSV Upload / URL Import)

#### Test 2.2: CSV Upload - Valid File
- [ ] Click "Download sample-leads.csv" button
- [ ] File downloads successfully
- [ ] Upload the downloaded sample file
- [ ] File name appears in drop zone
- [ ] File size displays correctly
- [ ] Click "Process Leads →"
- [ ] Processing states appear:
  - [ ] "Uploading file..."
  - [ ] "Parsing leads..."
  - [ ] "Scoring leads with AI..."
  - [ ] "Finalizing results..."
- [ ] Redirects to `/results` page

#### Test 2.3: CSV Upload - Error Handling
- [ ] **Invalid File Type**: Upload a .txt or .pdf file
  - [ ] Error message: "Invalid file type. Please upload a valid CSV file."
  - [ ] "Retry Upload" button appears
  - [ ] Click retry → error clears

- [ ] **File Too Large**: Create/upload file > 10MB
  - [ ] Error message: "Your file is too large. Please upload a file under 10MB."
  - [ ] "Retry Upload" button appears

- [ ] **Empty File**: Upload empty CSV
  - [ ] Error message: "The selected file is empty. Please choose a valid CSV file."

- [ ] **No File Selected**: Click "Process Leads" without selecting file
  - [ ] Warning appears: "No file selected. Please upload a CSV or import from URL."

#### Test 2.4: Drag & Drop
- [ ] Drag CSV file over drop zone
- [ ] Drop zone highlights (border changes)
- [ ] Drop file → file is selected
- [ ] Drag non-CSV file → error appears

#### Test 2.5: URL Import
- [ ] Click "URL Import" tab
- [ ] URL input field appears
- [ ] **Invalid URL**: Enter "not-a-url"
  - [ ] Click outside input (blur)
  - [ ] Error appears: "Please enter a valid URL..."
  - [ ] Input border turns red

- [ ] **Invalid Protocol**: Enter "ftp://example.com/file.csv"
  - [ ] Error: "URL must start with http:// or https://"

- [ ] **Valid URL**: Enter "https://example.com/leads.csv"
  - [ ] No error appears
  - [ ] Can proceed to process

#### Test 2.6: Processing States
- [ ] Upload valid CSV
- [ ] Click "Process Leads"
- [ ] Verify progress stages:
  - [ ] Stage text updates
  - [ ] Progress bar fills (0% → 100%)
  - [ ] Spinner animates
- [ ] No errors in console

---

### 3. Results Page Testing (`/results`)

#### Test 3.1: Page Loads After Processing
- [ ] After uploading leads, redirected to `/results`
- [ ] Page loads without errors
- [ ] Title shows: "Lead Analysis Results"
- [ ] Subtitle shows: "AI-scored and prioritized leads ready for outreach"

#### Test 3.2: Score Explanation Section
- [ ] "How Lead Scoring Works 🧠" section appears
- [ ] Shows scoring breakdown:
  - [ ] Email Present & Valid → 30 pts
  - [ ] Company Info Available → 25 pts
  - [ ] Name Available → 15 pts
  - [ ] Contact Info Available → 10 pts
  - [ ] Industry Info Available → 10 pts
  - [ ] Decision Maker Title Bonus → 10 pts
- [ ] Summary text: "Higher Score = Better Lead Quality + Intent Signals 🚀"

#### Test 3.3: Stats Cards
- [ ] Three stat cards display:
  - [ ] Hot Leads (score 80+)
  - [ ] Warm Leads (score 60-79)
  - [ ] Average Score
- [ ] Numbers are correct
- [ ] Cards are visually distinct

#### Test 3.4: Leads Table
- [ ] Table displays with columns:
  - [ ] Name
  - [ ] Company
  - [ ] Score
  - [ ] Status
  - [ ] Reason
- [ ] All leads are visible
- [ ] Scores display correctly
- [ ] Status badges show correct colors (Hot=red, Warm=orange, Cold=gray)
- [ ] Reason column shows readable text (not JSON)

#### Test 3.5: Sorting
- [ ] Click "Sort by Highest Score"
- [ ] Leads reorder (highest to lowest)
- [ ] Button text changes to "Sort by Lowest Score"
- [ ] Click again → sorts lowest to highest

#### Test 3.6: Filtering
- [ ] Filter dropdown shows: All Status, Hot, Warm, Cold
- [ ] Select "Hot" → only hot leads show
- [ ] Select "Warm" → only warm leads show
- [ ] Select "Cold" → only cold leads show
- [ ] Select "All Status" → all leads show
- [ ] Filtered count updates correctly

#### Test 3.7: Export CSV
- [ ] Click "Export CSV" button
- [ ] File downloads
- [ ] File name: `leads-export-YYYY-MM-DD.csv`
- [ ] File contains correct data
- [ ] Export works with filters applied

#### Test 3.8: Lead Details Dialog
- [ ] Click any lead row
- [ ] Dialog/modal opens
- [ ] Shows lead details:
  - [ ] Name, Company, Email
  - [ ] Score and Status
  - [ ] Industry, Phone, Website (if available)
  - [ ] AI Insights/Notes
- [ ] Close dialog → returns to table

#### Test 3.9: Empty State
- [ ] Navigate to `/results` without uploading leads
- [ ] Empty state appears: "No leads available yet"
- [ ] "Upload Leads" button visible
- [ ] Click button → navigates to `/upload`

#### Test 3.10: Error Handling
- [ ] If error occurs, error banner appears
- [ ] Error message is user-friendly
- [ ] "Try Again" button works
- [ ] App doesn't crash

---

### 4. Error Handling Testing

#### Test 4.1: Network Errors
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to upload file
- [ ] Error: "Network error. Please check your internet connection..."
- [ ] Set back to "Online" → retry works

#### Test 4.2: Server Errors
- [ ] (If possible) Simulate 500 error
- [ ] Error message: "Server error. Please try again later."
- [ ] App doesn't crash

#### Test 4.3: Invalid Data
- [ ] Upload CSV with invalid format
- [ ] Appropriate error message appears
- [ ] "Retry Upload" button works

---

### 5. Responsive Design Testing

#### Test 5.1: Mobile View
- [ ] Open DevTools → Toggle device toolbar
- [ ] Set to mobile (375px width)
- [ ] All pages are readable
- [ ] Buttons are tappable
- [ ] Table scrolls horizontally if needed

#### Test 5.2: Tablet View
- [ ] Set to tablet (768px width)
- [ ] Layout adapts correctly
- [ ] All features accessible

---

### 6. Browser Console Testing

#### Test 6.1: No Errors
- [ ] Open browser console (F12)
- [ ] Navigate through all pages
- [ ] No red errors appear
- [ ] Only expected warnings (if any)

#### Test 6.2: Error Logging
- [ ] Trigger an error (e.g., invalid file)
- [ ] Check console → error is logged
- [ ] Error message is descriptive

---

## 🎯 Quick Test Scenarios

### Happy Path (Full Flow)
1. ✅ Go to homepage
2. ✅ Click "Upload Leads"
3. ✅ Download sample CSV
4. ✅ Upload sample CSV
5. ✅ Process leads
6. ✅ View results
7. ✅ Sort by score
8. ✅ Filter by status
9. ✅ Export CSV
10. ✅ Click lead to see details

### Error Path (Error Handling)
1. ✅ Upload invalid file → see error
2. ✅ Enter invalid URL → see validation error
3. ✅ Process without file → see warning
4. ✅ All errors have retry/recovery options

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Feature                    | Status | Notes
---------------------------|--------|------------------
Homepage Load              |   ✅   |
Homepage CTA              |   ✅   |
Upload Page Load          |   ✅   |
CSV Upload Valid          |   ✅   |
CSV Upload Errors         |   ✅   |
URL Import Valid          |   ✅   |
URL Import Errors         |   ✅   |
Processing States         |   ✅   |
Results Page Load         |   ✅   |
Score Explanation         |   ✅   |
Stats Cards               |   ✅   |
Leads Table               |   ✅   |
Sorting                   |   ✅   |
Filtering                 |   ✅   |
Export CSV                |   ✅   |
Lead Details              |   ✅   |
Error Handling            |   ✅   |
Responsive Design         |   ✅   |
Console Errors            |   ✅   |

Overall Status: ✅ PASS / ❌ FAIL
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Run `npm install`

### Issue: Port 3000 already in use
**Solution**: Kill process or use different port

### Issue: File upload doesn't work
**Solution**: Check file size and type

### Issue: Results page empty
**Solution**: Upload leads first, check localStorage

---

## ✅ Success Criteria

All features pass if:
- ✅ No console errors
- ✅ All buttons work
- ✅ Error messages are clear
- ✅ Data persists correctly
- ✅ UI is responsive
- ✅ App doesn't crash on errors

---

**Ready to test? Start with the Happy Path scenario above!**

