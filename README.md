# AI Outbound Operating System (AOOS)

An intelligent lead scoring and prioritization platform powered by AI. Upload your leads, get instant insights, and focus on prospects that matter most.

## 🚀 Features

- **Smart Lead Scoring**: AI-powered lead qualification and scoring
- **CSV Upload**: Import leads from CSV files
- **URL Import**: Import leads from public URLs or APIs
- **Instant Insights**: Get detailed analysis and prioritization
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd AI-Outbound-OS
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Setup

Create a `.env.local` file in the root directory for environment variables:

```env
# Supabase Database (Required for production)
# Get these from https://app.supabase.com → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI API (optional - for AI-powered scoring)
# Get your API key from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Note: Without Supabase credentials, the app falls back to file-based storage (local only)
# See SUPABASE_SETUP.md for database setup instructions
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Implementation Status

### ✅ Phase 1: Core Backend Functionality (COMPLETED)
1. ✅ **CSV File Upload & Parsing**: Fully implemented with robust CSV parser
   - Handles quoted fields with commas
   - Supports multiple CSV formats and header variations
   - File size validation (10MB limit)
   - Error handling and validation

2. ✅ **Basic Lead Processing**: Complete scoring algorithm implemented
   - Scores based on data completeness and quality
   - Email validation and presence (30 points)
   - Company information (25 points)
   - Name presence (15 points)
   - Industry information (10 points)
   - Additional contact info (10 points)
   - Title/role detection with decision-maker bonus (10 points)
   - Status classification (hot/warm/cold)

3. ✅ **Frontend-Backend Integration**: Fully connected
   - Upload page handles real file uploads
   - Drag & drop file support
   - Loading states and error handling
   - Results page displays real processed data
   - Data persistence via localStorage

### ✅ Phase 2: Enhanced Features (COMPLETED)
1. ✅ **URL Import Functionality**: Fully implemented
   - Fetch data from public URLs/APIs
   - Supports JSON and CSV formats
   - Automatic format detection
   - URL validation and security checks
   - 30-second timeout protection

2. ✅ **AI-Powered Scoring**: OpenAI integration ready
   - OpenAI API integration implemented
   - GPT-4o-mini model for cost-effective scoring
   - AI-generated insights and recommendations
   - Fallback to basic scoring if AI unavailable
   - Configurable via environment variable

3. ✅ **Database Persistence**: File-based storage implemented
   - JSON-based database storage
   - CRUD operations for leads
   - Statistics and filtering support
   - Automatic data persistence
   - Ready for upgrade to SQLite/PostgreSQL

### ✅ Phase 3: Polish & Deployment (COMPLETED)
1. ✅ **Export Functionality**: CSV/Excel export
   - Export all leads or filtered by status
   - CSV format with proper escaping
   - Excel-compatible format
   - One-click download

2. ✅ **Enhanced Error Handling**: Comprehensive validation
   - Detailed error messages
   - Graceful error recovery
   - Input validation throughout
   - User-friendly error displays

3. ✅ **Loading States & Progress Indicators**: Complete UX improvements
   - Progress bars for upload/processing
   - Loading spinners
   - Stage-by-stage progress updates
   - Smooth transitions

### 🔄 Future Enhancements (Optional)
- Email integration for outreach
- Campaign management
- Analytics dashboard
- Multi-user support
- API rate limiting
- Lead enrichment from external sources

### Deployment Options:
- **Vercel** (Recommended for Next.js): `vercel deploy`
- **Netlify**: Connect your Git repository
- **Railway**: Deploy with database support
- **AWS/GCP**: For enterprise deployments

## 🎯 Quick Start Guide

1. **Install dependencies**: `npm install`
2. **Run development server**: `npm run dev`
3. **Upload leads**: Go to `/upload` and upload a CSV file or import from URL
4. **View results**: Processed leads appear on `/results` page
5. **Export data**: Click "Export CSV" to download your leads

## 📋 Next Steps

See **[NEXT_STEPS.md](./NEXT_STEPS.md)** for:
- Local testing guide
- Deployment instructions
- Database upgrade options
- Optional enhancements
- Production checklist

## 📊 API Endpoints

- `POST /api/upload` - Upload and parse CSV file
- `POST /api/import-url` - Import leads from URL
- `POST /api/process-leads` - Process and score leads
- `GET /api/leads` - Get all leads (with optional filters)
- `GET /api/export` - Export leads as CSV
- `PUT /api/leads` - Update a lead
- `DELETE /api/leads` - Delete a lead

## 📄 Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Home page
│   │   ├── upload/       # Upload page
│   │   └── results/      # Results page
│   ├── components/       # React components
│   │   ├── Navbar.tsx    # Navigation bar
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utility libraries
│   │   ├── db.ts         # Database helpers
│   │   └── openai.ts     # OpenAI helpers
│   └── styles/           # Global styles
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙋 Support

For questions or issues, please open an issue on GitHub.

