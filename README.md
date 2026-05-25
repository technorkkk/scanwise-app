# ScanWise — Know What You Eat 🥗

A premium health-tech Progressive Web App for scanning packaged food barcodes and receiving clear, trustworthy insights on nutrition, ingredients, allergens, processing level, health impact, and safer alternatives.

## ✨ Features

### Core
- 🔍 **Barcode Scanner** — Animated full-screen camera scanner with real-time detection
- 📊 **Nutri-Score Badge** — Color-coded A-E nutrition rating with spring animations
- 🤖 **AI Health Summary** — Gemini AI-powered health explanations in English & Hindi (Typewriter effect)
- ⚠️ **Allergen Alerts** — Smart color-coded warnings (Contains/May Contain/Free)
- 🏷️ **NOVA Processing** — Ultra-processed food detection with visual indicators
- 🌿 **Eco-Score** — Environmental impact rating
- 💚 **Health Score Ring** — Animated circular progress (0-100)

### User Features
- ❤️ **Favorites** — Save and manage favorite products
- 📜 **History** — Full scan history with timestamps
- ⚖️ **Compare** — Side-by-side product comparison (up to 4 products)
- 🛒 **Where to Buy** — Affiliate commerce links with price comparison
- 🔍 **Search** — Search by name, brand, or category
- 🌐 **i18n** — Full English and Hindi language support
- 🌙 **Dark Mode** — Beautiful dark mode with smooth transitions

### Admin Dashboard
- 📈 **KPI Cards** — Animated counters for users, products, scans, revenue
- 📊 **Charts** — SVG bar and line charts
- 👥 **User Management** — Role-based access control
- 📦 **Product Management** — Approve, edit, manage products
- 🏪 **Affiliate Module** — Provider management, offers, click tracking
- 🧠 **AI Prompts** — Manage AI generation prompts
- 🚩 **Feature Flags** — Toggle features on/off
- 📋 **Reports** — Handle user reports

### Technical
- 📱 **PWA** — Installable, offline-capable with service worker
- 🎨 **Premium Design** — Glassmorphism, Framer Motion animations, premium typography
- ♿ **Accessible** — WCAG AA compliant with reduced motion support
- 🔒 **Security** — Row Level Security, input validation with Zod

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui + Radix UI
- **Animations**: Framer Motion (advanced)
- **i18n**: next-intl (English + Hindi)
- **Database**: Supabase (Auth, DB, Storage, RLS) / Prisma (local)
- **AI**: Gemini AI via z-ai-web-dev-sdk
- **Scanner**: html5-qrcode
- **Validation**: Zod
- **State**: Zustand + TanStack Query
- **Icons**: Lucide React + Custom SVGs
- **Fonts**: Inter, Space Grotesk

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/technorkkk/scanwise-app.git
cd scanwise-app
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Set up Supabase database**
   - Go to your Supabase project's SQL Editor
   - Run the migration file from `supabase/migrations/001_initial_schema.sql`

5. **Run the development server**
```bash
bun run dev
```

6. **Open in browser**
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API route handlers
│   │   ├── scan/         # Barcode scanning
│   │   ├── products/     # Product search/detail
│   │   ├── ai-summary/   # AI health summary
│   │   ├── affiliate/    # Affiliate offers & tracking
│   │   └── auth/         # Demo authentication
│   ├── globals.css       # Design system & theme variables
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Main SPA with all pages
├── components/
│   ├── scanwise/
│   │   ├── scanner/      # Scanner frame component
│   │   ├── scores/       # Nutri-Score, NOVA, Eco-Score, Health Ring
│   │   ├── product/      # Typewriter, IngredientChip, AllergenBadge
│   │   └── layout/       # Header, BottomNav, EmptyState, Skeleton
│   ├── providers/        # Theme, i18n providers
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom hooks (use-i18n)
├── lib/
│   ├── animations.ts     # Framer Motion variants
│   ├── constants.ts      # Demo data, configs
│   ├── i18n.ts           # Translations (EN/HI)
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utilities
├── stores/
│   └── app-store.ts      # Zustand store
└── prisma/
    └── schema.prisma     # Database schema

supabase/
└── migrations/           # SQL migration files
public/
├── icons/                # PWA icons
├── logo.svg              # App logo
├── manifest.json         # PWA manifest
└── sw.js                 # Service worker
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald-600 / Teal-500
- **Accent**: Amber (warnings), Rose (critical allergens)
- **Neutral**: Slate-950 (dark), Zinc-50 (light)
- **Backgrounds**: Warm off-white + subtle gradients

### Typography
- **Body**: Inter (readability)
- **Display/Numbers**: Space Grotesk (scores & metrics)
- **Headings**: System font with tight tracking

### Animations (Framer Motion)
- Page transitions with AnimatePresence
- Score badges: Scale + spring reveal
- AI Summary: Typewriter effect
- Scanner: Glowing animated frame + scan line
- Cards: Hover lift + shadow
- Buttons: Tap scale (0.95), hover glow
- Skeleton: Shimmer wave effect
- Stagger: Children animations
- Reduced motion support

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan` | Look up product by barcode |
| GET | `/api/products` | Search/filter products |
| GET | `/api/products/[id]` | Get single product |
| POST | `/api/ai-summary` | Generate AI health summary |
| GET | `/api/affiliate` | Get affiliate offers |
| POST | `/api/affiliate/click` | Track affiliate click |
| POST | `/api/auth` | Login/Register (demo) |

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy

### Manual

```bash
bun run build
bun run start
```

## 📄 License

MIT

---

Built with ❤️ by the ScanWise Team
