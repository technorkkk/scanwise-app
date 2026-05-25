'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useAppStore, type Product } from '@/stores/app-store';
import { useI18n } from '@/hooks/use-i18n';
import {
  DEMO_PRODUCTS,
  APP_CONFIG,
  NUTRI_SCORE_CONFIG,
  NOVA_GROUP_CONFIG,
  ECO_SCORE_CONFIG,
  ALLERGEN_LABELS,
  PROCESSING_LEVELS,
  HEALTH_SCORE,
} from '@/lib/constants';
import {
  pageVariants,
  fadeUpVariants,
  fadeInVariants,
  scaleRevealVariants,
  staggerContainerVariants,
  staggerItemVariants,
  buttonTapVariants,
  heartVariants,
  slideUpVariants,
  overlayVariants,
  dialogVariants,
  springSnappy,
  springBouncy,
  springGentle,
} from '@/lib/animations';
import { ScannerFrame } from '@/components/scanwise/scanner/scanner-frame';
import { NutriScoreBadge } from '@/components/scanwise/scores/nutri-score-badge';
import { NovaBadge } from '@/components/scanwise/scores/nova-badge';
import { EcoScoreBadge } from '@/components/scanwise/scores/eco-score-badge';
import { HealthScoreRing } from '@/components/scanwise/scores/health-score-ring';
import { TypewriterText } from '@/components/scanwise/product/typewriter-text';
import { IngredientChip } from '@/components/scanwise/product/ingredient-chip';
import { AllergenBadge } from '@/components/scanwise/product/allergen-badge';
import { BottomNav } from '@/components/scanwise/layout/bottom-nav';
import { Header } from '@/components/scanwise/layout/header';
import { EmptyState } from '@/components/scanwise/layout/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  ScanLine,
  Search,
  Heart,
  Clock,
  ArrowLeft,
  ArrowRight,
  Star,
  Zap,
  Shield,
  ShoppingCart,
  BarChart3,
  Eye,
  Leaf,
  Brain,
  AlertTriangle,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ChevronRight,
  X,
  Keyboard,
  History,
  Plus,
  Minus,
  Check,
  Share2,
  GitCompareArrows,
  Mail,
  Lock,
  User,
  Globe,
  Moon,
  Sun,
  Camera,
  Flame,
  Award,
  Sparkles,
  Store,
  ExternalLink,
  Trash2,
  LogOut,
  Settings,
  ChefHat,
  Wheat,
  Milk,
  Fish,
  Egg,
  TreePine,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

// ─── Types ────────────────────────────────────────────────────────
type PageId =
  | 'landing'
  | 'scan'
  | 'product'
  | 'search'
  | 'favorites'
  | 'history'
  | 'compare'
  | 'auth'
  | 'profile'
  | 'admin';

// ─── Demo Product → Store Product mapper ──────────────────────────
function demoToProduct(demo: (typeof DEMO_PRODUCTS)[number]): Product {
  return {
    id: demo.barcode,
    barcode: demo.barcode,
    name: demo.name,
    brand: demo.brand,
    image_url: demo.image_url,
    category: demo.category,
    nutri_score: demo.nutri_score,
    nova_group: demo.nova_group,
    eco_score: demo.eco_score,
    health_score: demo.health_score,
    calories_per_100g: demo.calories_per_100g,
    fat_per_100g: demo.fat_per_100g,
    saturated_fat_per_100g: demo.saturated_fat_per_100g,
    carbs_per_100g: demo.carbs_per_100g,
    sugar_per_100g: demo.sugar_per_100g,
    fiber_per_100g: demo.fiber_per_100g,
    protein_per_100g: demo.protein_per_100g,
    salt_per_100g: demo.salt_per_100g,
    sodium_per_100g: demo.sodium_per_100g,
    ingredients_text: demo.ingredients_text,
    allergens: demo.allergens,
    additives: demo.additives,
    processing_level: demo.processing_level,
    ai_summary_en: demo.ai_summary_en,
    ai_summary_hi: demo.ai_summary_hi,
    source: 'demo',
  };
}

const allProducts: Product[] = DEMO_PRODUCTS.map(demoToProduct);

// ─── Fake retailers for "Where to Buy" ────────────────────────────
const fakeRetailers = [
  { name: 'FreshMart', logo: '🛒', price: '₹45', discount: '10% off', url: '#' },
  { name: 'QuickGrocer', logo: '🏪', price: '₹42', discount: 'Free delivery', url: '#' },
  { name: 'MegaStore', logo: '🏬', price: '₹48', discount: 'Buy 2 Get 1', url: '#' },
];

// ─── Category filter list ─────────────────────────────────────────
const categories = ['All', 'Dairy', 'Snacks', 'Beverages', 'Instant', 'Cooking Oil'];

// ═══════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const { scrollY } = useScroll();

  // ─── Store ─────────────────────────────────────────────────────
  const store = useAppStore();

  // Map navigation for BottomNav
  const navMap: Record<string, PageId> = {
    '/': 'landing',
    '/search': 'search',
    '/scan': 'scan',
    '/favorites': 'favorites',
    '/profile': 'profile',
  };

  const activeNavId = (() => {
    if (currentPage === 'landing') return 'home';
    if (currentPage === 'search') return 'search';
    if (currentPage === 'scan') return 'scan';
    if (currentPage === 'favorites') return 'favorites';
    if (currentPage === 'profile' || currentPage === 'auth' || currentPage === 'admin') return 'profile';
    if (currentPage === 'history') return 'home';
    if (currentPage === 'compare') return 'home';
    return 'home';
  })();

  const handleNav = (href: string) => {
    const page = navMap[href];
    if (page) setCurrentPage(page);
  };

  const navigate = useCallback((page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setCurrentPage('landing');
  }, []);

  // ─── Auth state ────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return !!localStorage.getItem('scanwise-auth'); } catch { return false; }
  });
  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const saved = localStorage.getItem('scanwise-auth');
      return saved ? JSON.parse(saved).email || '' : '';
    } catch { return ''; }
  });
  const [userName, setUserName] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const saved = localStorage.getItem('scanwise-auth');
      return saved ? JSON.parse(saved).name || '' : '';
    } catch { return ''; }
  });

  const handleLogin = useCallback(
    (email: string, name?: string) => {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserName(name || email.split('@')[0]);
      localStorage.setItem('scanwise-auth', JSON.stringify({ email, name: name || email.split('@')[0] }));
      toast.success('Welcome to ScanWise!');
      navigate('profile');
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserName('');
    localStorage.removeItem('scanwise-auth');
    toast.success('Logged out successfully');
    navigate('landing');
  }, [navigate]);

  // ─── Product navigation helpers ────────────────────────────────
  const openProduct = useCallback(
    (product: Product) => {
      store.setCurrentProduct(product);
      store.addToHistory(product);
      navigate('product');
    },
    [store, navigate]
  );

  const toggleFav = useCallback(
    (id: string) => {
      store.toggleFavorite(id);
      const isFav = store.favoriteIds.includes(id);
      toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');
    },
    [store]
  );

  // ─── Page content ──────────────────────────────────────────────
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage navigate={navigate} openProduct={openProduct} />;
      case 'scan':
        return (
          <ScanPage
            navigate={navigate}
            openProduct={openProduct}
            scanHistory={store.scanHistory}
          />
        );
      case 'product':
        return (
          <ProductDetailPage
            product={store.currentProduct}
            navigate={navigate}
            isFavorite={store.currentProduct ? store.favoriteIds.includes(store.currentProduct.id) : false}
            toggleFav={toggleFav}
            addToCompare={store.addToCompare}
            compareCount={store.compareProducts.length}
          />
        );
      case 'search':
        return (
          <SearchPage
            navigate={navigate}
            openProduct={openProduct}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favoriteIds={store.favoriteIds}
            openProduct={openProduct}
            navigate={navigate}
          />
        );
      case 'history':
        return (
          <HistoryPage
            scanHistory={store.scanHistory}
            openProduct={openProduct}
            clearHistory={store.clearHistory}
            navigate={navigate}
          />
        );
      case 'compare':
        return (
          <ComparePage
            compareProducts={store.compareProducts}
            addToCompare={store.addToCompare}
            removeFromCompare={store.removeFromCompare}
            clearCompare={store.clearCompare}
            openProduct={openProduct}
            navigate={navigate}
          />
        );
      case 'auth':
        return (
          <AuthPage
            onLogin={handleLogin}
            navigate={navigate}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            isLoggedIn={isLoggedIn}
            userName={userName}
            userEmail={userEmail}
            favoriteCount={store.favoriteIds.length}
            historyCount={store.scanHistory.length}
            onLogout={handleLogout}
            navigate={navigate}
          />
        );
      case 'admin':
        return <AdminDashboard navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} openProduct={openProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - not on landing */}
      {currentPage !== 'landing' && currentPage !== 'scan' && (
        <Header
          showBack={currentPage !== 'search'}
          onBack={goBack}
          onLanguageToggle={() => store.setLocale(store.locale === 'en' ? 'hi' : 'en')}
          locale={store.locale}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav - not on landing */}
      {currentPage !== 'landing' && (
        <BottomNav
          activeId={activeNavId}
          onNavigate={handleNav}
        />
      )}

      {/* Bottom padding for nav */}
      {currentPage !== 'landing' && <div className="h-20" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 1. LANDING PAGE
// ═══════════════════════════════════════════════════════════════════
function LandingPage({
  navigate,
  openProduct,
}: {
  navigate: (p: PageId) => void;
  openProduct: (p: Product) => void;
}) {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const steps = [
    {
      icon: ScanLine,
      title: t('landing.step1Title'),
      desc: t('landing.step1Desc'),
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Brain,
      title: t('landing.step2Title'),
      desc: t('landing.step2Desc'),
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      icon: Shield,
      title: t('landing.step3Title'),
      desc: t('landing.step3Desc'),
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  const features = [
    { icon: Award, title: t('landing.feature1Title'), desc: t('landing.feature1Desc'), color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Brain, title: t('landing.feature2Title'), desc: t('landing.feature2Desc'), color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: AlertTriangle, title: t('landing.feature3Title'), desc: t('landing.feature3Desc'), color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { icon: Package, title: t('landing.feature4Title'), desc: t('landing.feature4Desc'), color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: ShoppingCart, title: t('landing.feature5Title'), desc: t('landing.feature5Desc'), color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { icon: GitCompareArrows, title: t('landing.feature6Title'), desc: t('landing.feature6Desc'), color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const trustBadges = [
    { value: '50K+', label: t('landing.productsScanned') },
    { value: '100K+', label: t('landing.users') },
    { value: '98%', label: t('landing.accuracy') },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 bg-gradient-premium">
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

        <motion.div
          className="relative z-10 text-center max-w-2xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4" />
            {t('app.tagline')}
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t('landing.heroTitle')}{' '}
            <span className="gradient-text">{t('landing.heroHighlight')}</span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {t('landing.heroSubtitle')}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, ...springBouncy }}
          >
            <motion.button
              onClick={() => navigate('scan')}
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ScanLine className="h-6 w-6" />
              {t('landing.scanNow')}
              {/* Pulse glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-emerald-400/40"
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.button>
          </motion.div>

          <motion.p
            className="mt-3 text-sm text-muted-foreground/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {t('landing.scanNowDesc')}
          </motion.p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="relative z-10 mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          {trustBadges.map((badge) => (
            <motion.div
              key={badge.label}
              className="text-center"
              variants={staggerItemVariants}
            >
              <div className="text-2xl sm:text-3xl font-bold font-display gradient-text">
                {badge.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {badge.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold font-display text-center mb-4"
            variants={fadeUpVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {t('landing.howItWorks')}
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-12"
            variants={fadeUpVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {t('landing.trustedBy')}
          </motion.p>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={i} variants={staggerItemVariants}>
                  <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${step.bg} mb-4`}>
                        <Icon className={`h-7 w-7 ${step.color}`} />
                      </div>
                      <div className="absolute top-4 right-4 text-5xl font-bold font-display text-muted-foreground/10">
                        {i + 1}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 font-display">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gradient-premium">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold font-display text-center mb-12"
            variants={fadeUpVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {t('landing.features')}
          </motion.h2>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={staggerItemVariants}>
                  <motion.div
                    className="rounded-2xl border border-border/50 bg-card p-6 h-full cursor-pointer hover:shadow-lg transition-shadow"
                    whileHover={{ y: -4 }}
                    transition={springSnappy}
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-base font-semibold mb-2 font-display">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Showcase Products */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold font-display text-center mb-12"
            variants={fadeUpVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            Try a Demo
          </motion.h2>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {allProducts.slice(0, 6).map((product) => (
              <motion.div key={product.id} variants={staggerItemVariants}>
                <ProductCard product={product} onTap={openProduct} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center rounded-3xl p-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden"
          variants={fadeUpVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              {t('landing.ctaSubtitle')}
            </p>
            <motion.button
              onClick={() => navigate('scan')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 hover:bg-white/90 transition-colors shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {t('landing.ctaButton')}
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHARED: Product Card
// ═══════════════════════════════════════════════════════════════════
function ProductCard({
  product,
  onTap,
  compact = false,
}: {
  product: Product;
  onTap: (p: Product) => void;
  compact?: boolean;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={springSnappy}
      onClick={() => onTap(product)}
    >
      {/* Product image placeholder */}
      <div className="relative h-36 sm:h-40 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
        <Package className="h-12 w-12 text-muted-foreground/30" />
        {/* Score badge overlay */}
        {product.nutri_score && (
          <div className="absolute top-3 left-3">
            <NutriScoreBadge grade={product.nutri_score} size="sm" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3 className="font-semibold text-sm font-display line-clamp-2 mb-2">{product.name}</h3>
        {!compact && (
          <div className="flex items-center gap-3">
            {product.health_score != null && (
              <HealthScoreRing score={product.health_score} size="sm" />
            )}
            <div className="flex gap-1.5">
              {product.nova_group && <NovaBadge group={product.nova_group} size="sm" />}
              {product.eco_score && <EcoScoreBadge grade={product.eco_score} size="sm" />}
            </div>
          </div>
        )}
        {compact && product.health_score != null && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`font-semibold ${product.health_score >= 60 ? 'text-emerald-500' : product.health_score >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
              {product.health_score}/100
            </span>
            <span>Health Score</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 2. SCAN PAGE
// ═══════════════════════════════════════════════════════════════════
function ScanPage({
  navigate,
  openProduct,
  scanHistory,
}: {
  navigate: (p: PageId) => void;
  openProduct: (p: Product) => void;
  scanHistory: { id: string; product: Product; scannedAt: string }[];
}) {
  const { t } = useI18n();
  const [isDetected, setIsDetected] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanning, setScanning] = useState(true);

  // Simulated scan timer
  useEffect(() => {
    if (!scanning) return;
    const timer = setTimeout(() => {
      setIsDetected(true);
      setScanning(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [scanning]);

  // Navigate to product after detection
  useEffect(() => {
    if (!isDetected) return;
    const timer = setTimeout(() => {
      const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
      openProduct(randomProduct);
      setIsDetected(false);
      setScanning(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isDetected, openProduct]);

  const handleManualSubmit = () => {
    if (!barcodeInput.trim()) return;
    const product = allProducts.find((p) => p.barcode === barcodeInput.trim());
    if (product) {
      openProduct(product);
    } else {
      // Demo: pick random product
      openProduct(allProducts[Math.floor(Math.random() * allProducts.length)]);
    }
    setShowManualEntry(false);
    setBarcodeInput('');
  };

  return (
    <div className="relative h-[85vh] sm:h-[80vh]">
      <ScannerFrame isDetected={isDetected} />

      {/* Top bar overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between">
        <motion.button
          onClick={() => navigate('landing')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>
        <motion.button
          onClick={() => setShowManualEntry(true)}
          className="flex h-10 items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 text-sm font-medium"
          whileTap={{ scale: 0.95 }}
        >
          <Keyboard className="h-4 w-4" />
          {t('scan.manualEntry')}
        </motion.button>
      </div>

      {/* Scanning status indicator */}
      <AnimatePresence>
        {scanning && !isDetected && (
          <motion.div
            className="absolute top-20 left-0 right-0 z-20 flex justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-sm px-4 py-2 text-sm text-emerald-300 border border-emerald-500/30">
              <motion.div
                className="h-2 w-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {t('scan.scanning')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Scans at bottom */}
      {scanHistory.length > 0 && (
        <div className="absolute bottom-28 left-0 right-0 z-20 px-4">
          <p className="text-xs text-white/60 font-medium mb-2">{t('scan.history')}</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {scanHistory.slice(0, 5).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => openProduct(item.product)}
                className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 text-white text-sm"
                whileTap={{ scale: 0.95 }}
              >
                <Package className="h-4 w-4 opacity-60" />
                <span className="max-w-[100px] truncate">{item.product.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Entry Dialog */}
      <AnimatePresence>
        {showManualEntry && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowManualEntry(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl p-6 shadow-2xl"
              variants={slideUpVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="w-12 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-lg font-semibold font-display mb-4">
                {t('scan.manualEntry')}
              </h3>
              <div className="flex gap-3">
                <Input
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder={t('scan.barcodePlaceholder')}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                  autoFocus
                />
                <Button onClick={handleManualSubmit} className="bg-emerald-500 hover:bg-emerald-600">
                  <ScanLine className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <p className="text-xs text-muted-foreground w-full mb-1">Demo barcodes:</p>
                {allProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setBarcodeInput(p.barcode);
                    }}
                    className="text-xs rounded-lg bg-muted px-2 py-1 hover:bg-muted/80 transition-colors"
                  >
                    {p.name.split(' ')[0]}: {p.barcode.slice(-4)}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 3. PRODUCT DETAIL PAGE (MASTERPIECE)
// ═══════════════════════════════════════════════════════════════════
function ProductDetailPage({
  product,
  navigate,
  isFavorite,
  toggleFav,
  addToCompare,
  compareCount,
}: {
  product: Product | null;
  navigate: (p: PageId) => void;
  isFavorite: boolean;
  toggleFav: (id: string) => void;
  addToCompare: (p: Product) => void;
  compareCount: number;
}) {
  const { t } = useI18n();
  const store = useAppStore();

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <p className="text-muted-foreground mb-4">No product selected</p>
        <Button onClick={() => navigate('scan')} className="bg-emerald-500 hover:bg-emerald-600">
          <ScanLine className="h-4 w-4 mr-2" />
          Scan a Product
        </Button>
      </div>
    );
  }

  const ingredients = (product.ingredients_text || '').split(',').map((s) => s.trim()).filter(Boolean);
  const allergens = product.allergens || [];
  const additives = product.additives || [];
  const processingLevel = product.processing_level;
  const processingConfig = processingLevel ? PROCESSING_LEVELS[processingLevel] : null;

  // Get AI summary based on locale
  const aiSummary = store.locale === 'hi' ? product.ai_summary_hi : product.ai_summary_en;

  // Healthier alternatives
  const alternatives = allProducts.filter(
    (p) => p.id !== product.id && p.health_score != null && product.health_score != null && p.health_score > product.health_score!
  ).slice(0, 3);

  // Nutrition rows
  const nutritionRows = [
    { label: t('product.calories'), value: product.calories_per_100g, unit: 'kcal', highlight: true },
    { label: t('product.fat'), value: product.fat_per_100g, unit: 'g' },
    { label: t('product.saturatedFat'), value: product.saturated_fat_per_100g, unit: 'g' },
    { label: t('product.carbs'), value: product.carbs_per_100g, unit: 'g' },
    { label: t('product.sugar'), value: product.sugar_per_100g, unit: 'g' },
    { label: t('product.fiber'), value: product.fiber_per_100g, unit: 'g' },
    { label: t('product.protein'), value: product.protein_per_100g, unit: 'g' },
    { label: t('product.salt'), value: product.salt_per_100g, unit: 'g' },
    { label: t('product.sodium'), value: product.sodium_per_100g, unit: 'mg' },
  ];

  const handleCompare = () => {
    if (compareCount < 4) {
      addToCompare(product);
      toast.success('Added to comparison');
    } else {
      toast.error('Compare list is full (max 4)');
    }
  };

  const handleShare = () => {
    toast.success('Share link copied!');
  };

  // Ingredient safety heuristic
  const getIngredientSafety = (name: string): 'safe' | 'caution' | 'avoid' => {
    const lower = name.toLowerCase();
    if (additives.some((a) => lower.includes(a.toLowerCase()))) return 'avoid';
    if (['palm oil', 'sugar', 'salt'].some((a) => lower.includes(a))) return 'caution';
    return 'safe';
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-muted/80 to-muted h-56 sm:h-64 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...springBouncy, delay: 0.2 }}
          >
            <Package className="h-20 w-20 text-muted-foreground/20" />
          </motion.div>
        </div>

        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-20 pb-4 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
              {product.brand}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">{product.name}</h1>
            {product.category && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {product.category}
              </Badge>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Score Row */}
      <motion.section
        className="px-6 py-6"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center justify-around gap-4">
          {product.nutri_score && (
            <motion.div variants={staggerItemVariants} className="flex flex-col items-center gap-1">
              <NutriScoreBadge grade={product.nutri_score} size="lg" showLabel />
              <span className="text-[10px] text-muted-foreground font-medium">Nutri-Score</span>
            </motion.div>
          )}
          {product.nova_group && (
            <motion.div variants={staggerItemVariants} className="flex flex-col items-center gap-1">
              <NovaBadge group={product.nova_group} size="lg" showLabel />
              <span className="text-[10px] text-muted-foreground font-medium">NOVA</span>
            </motion.div>
          )}
          {product.eco_score && (
            <motion.div variants={staggerItemVariants} className="flex flex-col items-center gap-1">
              <EcoScoreBadge grade={product.eco_score} size="lg" showLabel />
              <span className="text-[10px] text-muted-foreground font-medium">Eco-Score</span>
            </motion.div>
          )}
          {product.health_score != null && (
            <motion.div variants={staggerItemVariants} className="flex flex-col items-center gap-1">
              <HealthScoreRing score={product.health_score} size="md" showLabel />
              <span className="text-[10px] text-muted-foreground font-medium">{t('product.healthScore')}</span>
            </motion.div>
          )}
        </div>
      </motion.section>

      <Separator className="mx-6" />

      {/* AI Summary (SIGNATURE FEATURE) */}
      <motion.section
        className="px-6 py-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Brain className="h-4 w-4 text-violet-500" />
          </div>
          <h2 className="text-base font-semibold font-display">{t('product.aiSummary')}</h2>
        </div>
        <div className="rounded-2xl border border-border/50 bg-violet-500/5 dark:bg-violet-500/10 p-5">
          <TypewriterText
            text={aiSummary || 'No summary available.'}
            speed={20}
            delay={800}
            cursor
            className="text-sm leading-relaxed text-foreground/90"
          />
        </div>
      </motion.section>

      <Separator className="mx-6" />

      {/* Processing Level */}
      {processingConfig && (
        <>
          <motion.section
            className="px-6 py-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Package className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="text-base font-semibold font-display">{t('product.processing')}</h2>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: processingConfig.color }}>
                  {processingConfig.label}
                </span>
                <span className="text-xs text-muted-foreground">{processingConfig.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: processingConfig.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${processingConfig.percentage}%` }}
                  transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.section>
          <Separator className="mx-6" />
        </>
      )}

      {/* Nutrition Facts */}
      <motion.section
        className="px-6 py-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Flame className="h-4 w-4 text-emerald-500" />
            </div>
            <h2 className="text-base font-semibold font-display">{t('product.nutrition')}</h2>
          </div>
          <Badge variant="outline" className="text-xs">{t('product.per100g')}</Badge>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
          >
            {nutritionRows.map(
              (row) =>
                row.value != null && (
                  <motion.div
                    key={row.label}
                    className="flex items-center justify-between px-4 py-3 border-b border-border/30 last:border-b-0"
                    variants={staggerItemVariants}
                  >
                    <span className={`text-sm ${row.highlight ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {row.label}
                    </span>
                    <span className={`text-sm font-medium tabular-nums ${row.highlight ? 'font-bold' : ''}`}>
                      {row.value} {row.unit}
                    </span>
                  </motion.div>
                )
            )}
          </motion.div>
        </div>
      </motion.section>

      <Separator className="mx-6" />

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <>
          <motion.section
            className="px-6 py-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500/10">
                <Wheat className="h-4 w-4 text-lime-500" />
              </div>
              <h2 className="text-base font-semibold font-display">{t('product.ingredients')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, i) => (
                <IngredientChip
                  key={i}
                  name={ingredient}
                  safety={getIngredientSafety(ingredient)}
                />
              ))}
            </div>
          </motion.section>
          <Separator className="mx-6" />
        </>
      )}

      {/* Allergens */}
      {allergens.length > 0 && (
        <>
          <motion.section
            className="px-6 py-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              <h2 className="text-base font-semibold font-display">{t('product.allergens')}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {allergens.map((allergen) => {
                const label = ALLERGEN_LABELS[allergen];
                return (
                  <AllergenBadge
                    key={allergen}
                    name={label ? `${label.icon} ${label[store.locale === 'hi' ? 'hi' : 'en']}` : allergen}
                    level="contains"
                  />
                );
              })}
            </div>
          </motion.section>
          <Separator className="mx-6" />
        </>
      )}

      {/* Where to Buy */}
      <motion.section
        className="px-6 py-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
            <Store className="h-4 w-4 text-sky-500" />
          </div>
          <h2 className="text-base font-semibold font-display">{t('product.whereToBuy')}</h2>
        </div>
        <div className="space-y-3">
          {fakeRetailers.map((retailer, i) => (
            <motion.div
              key={retailer.name}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{retailer.logo}</span>
                <div>
                  <p className="text-sm font-semibold">{retailer.name}</p>
                  <p className="text-xs text-muted-foreground">{retailer.discount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{retailer.price}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Healthier Alternatives */}
      {alternatives.length > 0 && (
        <>
          <Separator className="mx-6" />
          <motion.section
            className="px-6 py-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <h2 className="text-base font-semibold font-display">{t('product.alternatives')}</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {alternatives.map((alt) => (
                <motion.div
                  key={alt.id}
                  className="flex-shrink-0 w-40 rounded-xl border border-border/50 bg-card p-3 cursor-pointer hover:shadow-sm transition-shadow"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    store.setCurrentProduct(alt);
                    store.addToHistory(alt);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="h-20 rounded-lg bg-muted flex items-center justify-center mb-2">
                    <Package className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{alt.name}</p>
                  {alt.health_score != null && (
                    <p className="text-xs text-emerald-500 font-bold mt-1">{alt.health_score}/100</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        </>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border/30 safe-bottom">
        <div className="flex items-center justify-around px-4 py-3">
          <motion.button
            onClick={() => toggleFav(product.id)}
            className="flex flex-col items-center gap-1"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              variants={heartVariants}
              animate={isFavorite ? 'liked' : 'unmoved'}
            >
              <Heart
                className={`h-6 w-6 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`}
              />
            </motion.div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {isFavorite ? t('product.removeFromFavorite') : t('product.addToFavorite')}
            </span>
          </motion.button>

          <motion.button
            onClick={handleCompare}
            className="flex flex-col items-center gap-1"
            whileTap={{ scale: 0.9 }}
          >
            <GitCompareArrows className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{t('product.compare')}</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="flex flex-col items-center gap-1"
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{t('product.share')}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 4. SEARCH PAGE
// ═══════════════════════════════════════════════════════════════════
function SearchPage({
  navigate,
  openProduct,
}: {
  navigate: (p: PageId) => void;
  openProduct: (p: Product) => void;
}) {
  const { t } = useI18n();
  const store = useAppStore();
  const [query, setQuery] = useState(store.searchQuery || '');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    let products = allProducts;
    if (activeCategory !== 'All') {
      products = products.filter((p) => p.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          p.barcode.includes(q)
      );
    }
    return products;
  }, [query, activeCategory]);

  return (
    <div className="px-4 py-4">
      {/* Search Input */}
      <motion.div
        className="relative mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            store.setSearchQuery(e.target.value);
          }}
          placeholder={t('common.search') + '...'}
          className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50"
        />
        {query && (
          <motion.button
            onClick={() => {
              setQuery('');
              store.setSearchQuery('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}
      </motion.div>

      {/* Category Chips */}
      <motion.div
        className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-emerald-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            variants={staggerItemVariants}
            whileTap={{ scale: 0.95 }}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState variant="search" actionLabel="Scan Instead" onAction={() => navigate('scan')} />
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={staggerItemVariants}>
              <ProductCard product={product} onTap={openProduct} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 5. FAVORITES PAGE
// ═══════════════════════════════════════════════════════════════════
function FavoritesPage({
  favoriteIds,
  openProduct,
  navigate,
}: {
  favoriteIds: string[];
  openProduct: (p: Product) => void;
  navigate: (p: PageId) => void;
}) {
  const { t } = useI18n();

  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favoriteIds.includes(p.id)),
    [favoriteIds]
  );

  if (favoriteProducts.length === 0) {
    return (
      <EmptyState
        variant="favorites"
        title={t('favorites.empty')}
        description={t('favorites.emptyDesc')}
        actionLabel="Start Scanning"
        onAction={() => navigate('scan')}
      />
    );
  }

  return (
    <div className="px-4 py-4">
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {favoriteProducts.map((product) => (
          <motion.div key={product.id} variants={staggerItemVariants}>
            <ProductCard product={product} onTap={openProduct} compact />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 6. HISTORY PAGE
// ═══════════════════════════════════════════════════════════════════
function HistoryPage({
  scanHistory,
  openProduct,
  clearHistory,
  navigate,
}: {
  scanHistory: { id: string; product: Product; scannedAt: string }[];
  openProduct: (p: Product) => void;
  clearHistory: () => void;
  navigate: (p: PageId) => void;
}) {
  const { t } = useI18n();

  if (scanHistory.length === 0) {
    return (
      <EmptyState
        variant="history"
        title={t('history.empty')}
        description={t('history.emptyDesc')}
        actionLabel="Scan Now"
        onAction={() => navigate('scan')}
      />
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{scanHistory.length} scans</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t('history.clearAll')}
        </Button>
      </div>
      <motion.div
        className="space-y-3"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {scanHistory.map((item) => (
          <motion.div
            key={item.id}
            variants={staggerItemVariants}
            className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 cursor-pointer hover:shadow-sm transition-shadow"
            whileTap={{ scale: 0.98 }}
            onClick={() => openProduct(item.product)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted flex-shrink-0">
              <Package className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">{item.product.brand}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.product.nutri_score && (
                <NutriScoreBadge grade={item.product.nutri_score} size="sm" />
              )}
              {item.product.health_score != null && (
                <span
                  className={`text-xs font-bold ${
                    item.product.health_score >= 60
                      ? 'text-emerald-500'
                      : item.product.health_score >= 40
                        ? 'text-amber-500'
                        : 'text-rose-500'
                  }`}
                >
                  {item.product.health_score}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 7. COMPARE PAGE
// ═══════════════════════════════════════════════════════════════════
function ComparePage({
  compareProducts,
  addToCompare,
  removeFromCompare,
  clearCompare,
  openProduct,
  navigate,
}: {
  compareProducts: Product[];
  addToCompare: (p: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  openProduct: (p: Product) => void;
  navigate: (p: PageId) => void;
}) {
  const { t } = useI18n();

  const comparisonRows = [
    { label: t('product.calories'), getValue: (p: Product) => `${p.calories_per_100g ?? '-'} kcal` },
    { label: t('product.fat'), getValue: (p: Product) => `${p.fat_per_100g ?? '-'} g` },
    { label: t('product.sugar'), getValue: (p: Product) => `${p.sugar_per_100g ?? '-'} g` },
    { label: t('product.protein'), getValue: (p: Product) => `${p.protein_per_100g ?? '-'} g` },
    { label: t('product.salt'), getValue: (p: Product) => `${p.salt_per_100g ?? '-'} g` },
  ];

  // Determine winner for health score
  const bestScore = compareProducts.length >= 2
    ? Math.max(...compareProducts.map((p) => p.health_score ?? 0))
    : null;

  if (compareProducts.length < 2) {
    return (
      <div className="px-4 py-8">
        <div className="text-center mb-8">
          <GitCompareArrows className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold font-display mb-2">{t('compare.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('compare.selectHint')}</p>
        </div>

        {/* Currently selected products */}
        {compareProducts.length > 0 && (
          <div className="space-y-3 mb-6">
            {compareProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFromCompare(p.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mb-4">
          Add {2 - compareProducts.length} more product{2 - compareProducts.length !== 1 ? 's' : ''} to compare
        </p>

        {/* Quick add from demo products */}
        <div className="space-y-2">
          {allProducts
            .filter((p) => !compareProducts.find((cp) => cp.id === p.id))
            .map((p) => (
              <motion.button
                key={p.id}
                onClick={() => addToCompare(p)}
                className="w-full flex items-center justify-between rounded-xl border border-dashed border-border/50 p-3 text-left hover:bg-muted/50 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </div>
                </div>
                {p.health_score != null && (
                  <span className="text-xs font-bold text-muted-foreground">{p.health_score}/100</span>
                )}
              </motion.button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold font-display">{t('compare.title')}</h2>
        <Button variant="ghost" size="sm" onClick={clearCompare} className="text-rose-500">
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Product headers */}
      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `120px repeat(${compareProducts.length}, 1fr)` }}>
        <div /> {/* Empty corner */}
        {compareProducts.map((p) => {
          const isWinner = p.health_score === bestScore;
          return (
            <motion.div
              key={p.id}
              className={`relative rounded-xl border p-3 text-center cursor-pointer ${
                isWinner ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border/50 bg-card'
              }`}
              whileTap={{ scale: 0.97 }}
              onClick={() => openProduct(p)}
            >
              {isWinner && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-[10px] px-2 py-0">Winner</Badge>
                </div>
              )}
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2">
                <Package className="h-4 w-4 text-muted-foreground/40" />
              </div>
              <p className="text-xs font-medium line-clamp-2">{p.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(p.id);
                }}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-rose-500/20"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Scores row */}
      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `120px repeat(${compareProducts.length}, 1fr)` }}>
        <div className="flex items-center text-xs text-muted-foreground font-medium">{t('product.healthScore')}</div>
        {compareProducts.map((p) => (
          <div key={p.id} className="flex justify-center">
            <HealthScoreRing score={p.health_score ?? 0} size="sm" />
          </div>
        ))}
      </div>

      {/* Score badges row */}
      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `120px repeat(${compareProducts.length}, 1fr)` }}>
        <div className="flex items-center text-xs text-muted-foreground font-medium">Nutri-Score</div>
        {compareProducts.map((p) => (
          <div key={p.id} className="flex justify-center">
            {p.nutri_score && <NutriScoreBadge grade={p.nutri_score} size="sm" />}
          </div>
        ))}
      </div>

      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `120px repeat(${compareProducts.length}, 1fr)` }}>
        <div className="flex items-center text-xs text-muted-foreground font-medium">NOVA</div>
        {compareProducts.map((p) => (
          <div key={p.id} className="flex justify-center">
            {p.nova_group && <NovaBadge group={p.nova_group} size="sm" />}
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        {comparisonRows.map((row, i) => (
          <div
            key={row.label}
            className={`grid gap-2 px-4 py-3 ${
              i < comparisonRows.length - 1 ? 'border-b border-border/30' : ''
            }`}
            style={{ gridTemplateColumns: `120px repeat(${compareProducts.length}, 1fr)` }}
          >
            <div className="text-xs text-muted-foreground font-medium">{row.label}</div>
            {compareProducts.map((p) => (
              <div key={p.id} className="text-xs font-medium text-center">
                {row.getValue(p)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Add more products */}
      {compareProducts.length < 4 && (
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('search')}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('compare.addProduct')}
          </Button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 8. AUTH PAGE
// ═══════════════════════════════════════════════════════════════════
function AuthPage({
  onLogin,
  navigate,
}: {
  onLogin: (email: string, name?: string) => void;
  navigate: (p: PageId) => void;
}) {
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && !name) return;
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      onLogin(email, name || undefined);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...springGentle }}
      >
        {/* Glass card */}
        <div className="rounded-3xl glass border border-border/30 p-8 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 mb-4"
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={springBouncy}
            >
              <ScanLine className="h-7 w-7 text-white" />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold font-display">
                  {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLogin ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative mb-4">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('auth.fullName')}
                      className="pl-10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.email')}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.password')}
                className="pl-10"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs text-emerald-500 hover:underline">
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 h-11"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : isLogin ? (
                t('auth.loginButton')
              ) : (
                t('auth.signupButton')
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">{t('auth.orContinue')}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 h-11" onClick={() => onLogin('demo@scanwise.app', 'Demo User')}>
              🌐 Google
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
              <span className="text-emerald-500 font-medium">
                {isLogin ? t('auth.signupButton') : t('auth.loginButton')}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 9. PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════
function ProfilePage({
  isLoggedIn,
  userName,
  userEmail,
  favoriteCount,
  historyCount,
  onLogout,
  navigate,
}: {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  favoriteCount: number;
  historyCount: number;
  onLogout: () => void;
  navigate: (p: PageId) => void;
}) {
  const { t } = useI18n();
  const store = useAppStore();
  const { theme, setTheme } = useTheme();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h2 className="text-xl font-semibold font-display mb-2">Sign in to ScanWise</h2>
          <p className="text-sm text-muted-foreground mb-6">Save your favorites, track history, and more.</p>
          <Button onClick={() => navigate('auth')} className="bg-emerald-500 hover:bg-emerald-600">
            {t('nav.login')}
          </Button>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { icon: ScanLine, label: 'Total Scans', value: historyCount, color: 'text-emerald-500' },
    { icon: Heart, label: 'Favorites', value: favoriteCount, color: 'text-rose-500' },
    { icon: Clock, label: 'History Items', value: historyCount, color: 'text-amber-500' },
    { icon: Award, label: 'Health Score Avg', value: 52, color: 'text-violet-500' },
  ];

  return (
    <div className="px-4 py-6">
      {/* Profile Card */}
      <motion.div
        className="rounded-2xl glass border border-border/30 p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold font-display">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display">{userName}</h2>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-6"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="rounded-xl border border-border/50 bg-card p-4 text-center"
              variants={staggerItemVariants}
            >
              <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-border/30">
          <h3 className="text-sm font-semibold">Preferences</h3>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Language</span>
          </div>
          <button
            onClick={() => store.setLocale(store.locale === 'en' ? 'hi' : 'en')}
            className="text-sm font-medium text-emerald-500"
          >
            {store.locale === 'en' ? 'English → हिन्दी' : 'हिन्दी → English'}
          </button>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm">Dark Mode</span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>

        {/* Admin Dashboard */}
        <button
          onClick={() => navigate('admin')}
          className="flex items-center justify-between px-4 py-3 w-full hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Admin Dashboard</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-border/30">
          <h3 className="text-sm font-semibold">Quick Actions</h3>
        </div>
        {[
          { icon: Heart, label: 'View Favorites', action: () => navigate('favorites') },
          { icon: Clock, label: 'Scan History', action: () => navigate('history') },
          { icon: GitCompareArrows, label: 'Compare Products', action: () => navigate('compare') },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`flex items-center justify-between px-4 py-3 w-full hover:bg-muted/50 transition-colors ${
                i < 2 ? 'border-b border-border/30' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full text-rose-500 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {t('nav.logout')}
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 10. ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function AdminDashboard({ navigate }: { navigate: (p: PageId) => void }) {
  const { t } = useI18n();

  // Animated counter
  function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      const start = Date.now();
      function tick() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, [target, duration]);
    return <span className="tabular-nums">{count.toLocaleString()}</span>;
  }

  const kpis = [
    { icon: Users, label: t('admin.users'), value: 12453, change: '+12.5%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Package, label: t('admin.products'), value: 52847, change: '+8.3%', color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { icon: ScanLine, label: t('admin.scans'), value: 284910, change: '+23.1%', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: DollarSign, label: t('admin.revenue'), value: 48290, change: '+18.7%', color: 'text-amber-500', bg: 'bg-amber-500/10', prefix: '₹' },
  ];

  // Fake bar chart data
  const barData = [35, 48, 62, 55, 78, 90, 72, 85, 95, 68, 82, 91];
  const maxBar = Math.max(...barData);

  // Fake line chart data
  const lineData = [120, 180, 150, 220, 280, 260, 310, 350, 320, 390, 420, 480];

  const recentActivity = [
    { user: 'Rahul S.', action: 'Scanned Maggi Noodles', time: '2 min ago', type: 'scan' },
    { user: 'Priya M.', action: 'Added Amul Milk to favorites', time: '5 min ago', type: 'favorite' },
    { user: 'Amit K.', action: 'Compared 2 products', time: '12 min ago', type: 'compare' },
    { user: 'Sneha R.', action: 'Signed up', time: '18 min ago', type: 'signup' },
    { user: 'Vikram P.', action: 'Scanned Lay\'s Chips', time: '25 min ago', type: 'scan' },
  ];

  return (
    <div className="px-4 py-6">
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold font-display">{t('admin.title')}</h1>
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">Live</Badge>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-6"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="rounded-xl border border-border/50 bg-card p-4"
              variants={staggerItemVariants}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <span className="text-xs font-medium text-emerald-500">{kpi.change}</span>
              </div>
              <p className="text-xl font-bold font-display">
                {kpi.prefix || ''}
                <AnimatedCounter target={kpi.value} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mini Charts */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {/* Bar Chart - Scans */}
        <motion.div
          className="rounded-xl border border-border/50 bg-card p-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold mb-4">Monthly Scans</h3>
          <div className="flex items-end gap-1.5 h-32">
            {barData.map((val, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-emerald-500/70"
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxBar) * 100}%` }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">Jan</span>
            <span className="text-[10px] text-muted-foreground">Dec</span>
          </div>
        </motion.div>

        {/* Line Chart - Users */}
        <motion.div
          className="rounded-xl border border-border/50 bg-card p-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold mb-4">User Growth</h3>
          <div className="relative h-32">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={`M 0 ${100 - (lineData[0] / 500) * 100} ${lineData
                  .map((v, i) => `L ${(i / (lineData.length - 1)) * 300} ${100 - (v / 500) * 100}`)
                  .join(' ')}`}
                fill="none"
                stroke="rgb(139, 92, 246)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
              />
              <motion.path
                d={`M 0 ${100 - (lineData[0] / 500) * 100} ${lineData
                  .map((v, i) => `L ${(i / (lineData.length - 1)) * 300} ${100 - (v / 500) * 100}`)
                  .join(' ')} L 300 100 L 0 100 Z`}
                fill="url(#lineGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              />
            </svg>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">Jan</span>
            <span className="text-[10px] text-muted-foreground">Dec</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="rounded-xl border border-border/50 bg-card overflow-hidden mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="px-4 py-3 border-b border-border/30">
          <h3 className="text-sm font-semibold">Recent Activity</h3>
        </div>
        {recentActivity.map((activity, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 ${
              i < recentActivity.length - 1 ? 'border-b border-border/30' : ''
            }`}
          >
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
              {activity.user.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                <span className="font-medium">{activity.user}</span>{' '}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">{activity.time}</span>
          </div>
        ))}
      </motion.div>

      {/* Admin Module Grid */}
      <motion.h3
        className="text-sm font-semibold mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Admin Modules
      </motion.h3>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: Users, label: 'Users', color: 'text-blue-500', bg: 'bg-blue-500/10', count: '12.4K' },
          { icon: Shield, label: 'Roles', color: 'text-violet-500', bg: 'bg-violet-500/10', count: '5' },
          { icon: Package, label: 'Products', color: 'text-sky-500', bg: 'bg-sky-500/10', count: '50K+' },
          { icon: Check, label: 'Approvals', color: 'text-emerald-500', bg: 'bg-emerald-500/10', count: '23' },
          { icon: BarChart3, label: 'Reports', color: 'text-amber-500', bg: 'bg-amber-500/10', count: '12' },
          { icon: Wheat, label: 'Ingredients', color: 'text-lime-500', bg: 'bg-lime-500/10', count: '8.2K' },
          { icon: AlertTriangle, label: 'Allergens', color: 'text-rose-500', bg: 'bg-rose-500/10', count: '15' },
          { icon: Brain, label: 'AI Prompts', color: 'text-purple-500', bg: 'bg-purple-500/10', count: '8' },
          { icon: Settings, label: 'Feature Flags', color: 'text-gray-500', bg: 'bg-gray-500/10', count: '14' },
          { icon: Store, label: 'Affiliates', color: 'text-teal-500', bg: 'bg-teal-500/10', count: '6' },
          { icon: ShoppingCart, label: 'Offers', color: 'text-orange-500', bg: 'bg-orange-500/10', count: '34' },
          { icon: Activity, label: 'Analytics', color: 'text-indigo-500', bg: 'bg-indigo-500/10', count: 'Live' },
        ].map((mod) => {
          const Icon = mod.icon;
          return (
            <motion.button
              key={mod.label}
              className="rounded-xl border border-border/50 bg-card p-3 flex flex-col items-center gap-2 hover:shadow-sm transition-shadow"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${mod.bg}`}>
                <Icon className={`h-4 w-4 ${mod.color}`} />
              </div>
              <span className="text-[10px] font-medium text-center">{mod.label}</span>
              <span className="text-[9px] text-muted-foreground">{mod.count}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Affiliate Providers */}
      <motion.div
        className="rounded-xl border border-border/50 bg-card overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Affiliate Providers</h3>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">Active</Badge>
        </div>
        {[
          { name: 'BigBasket', status: 'Active', clicks: 1240, revenue: '₹12,400', color: 'bg-green-500' },
          { name: 'Blinkit', status: 'Active', clicks: 890, revenue: '₹8,900', color: 'bg-yellow-500' },
          { name: 'JioMart', status: 'Active', clicks: 650, revenue: '₹6,500', color: 'bg-blue-500' },
          { name: 'Amazon', status: 'Pending', clicks: 0, revenue: '₹0', color: 'bg-orange-500' },
          { name: 'Flipkart', status: 'Pending', clicks: 0, revenue: '₹0', color: 'bg-blue-600' },
        ].map((provider, i) => (
          <div
            key={provider.name}
            className={`flex items-center gap-3 px-4 py-3 ${i < 4 ? 'border-b border-border/30' : ''}`}
          >
            <div className={`h-8 w-8 rounded-lg ${provider.color}/10 flex items-center justify-center text-xs font-bold ${provider.color.replace('bg-', 'text-')}`}>
              {provider.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{provider.name}</p>
              <p className="text-[10px] text-muted-foreground">{provider.clicks} clicks</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold">{provider.revenue}</p>
              <Badge className={`text-[9px] border-0 ${provider.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                {provider.status}
              </Badge>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
