import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Wrench, 
  ArrowLeft,
  Flame,
  Award,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import TireCardSkeleton from '../components/TireCardSkeleton';
import UpsellModal from '../components/UpsellModal';

const TIER_META = {
  budget: {
    title: 'Budget Choice',
    tagline: 'Maximum Value & Longevity',
    icon: DollarSign,
    badgeBg: 'bg-slate-700/80 text-slate-200 border-slate-600',
    cardBorder: 'border-slate-700/80'
  },
  recommended: {
    title: 'Best Recommended',
    tagline: 'Optimal Grip, Comfort & Braking',
    icon: Flame,
    badgeBg: 'bg-red-accent text-white shadow-glow-red-sm',
    cardBorder: 'border-red-accent/60'
  },
  premium: {
    title: 'Ultra Premium',
    tagline: 'Supreme Highway Comfort & Performance',
    icon: Award,
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    cardBorder: 'border-amber-500/50'
  }
};

const RecommendationsView = () => {
  const { 
    recommendations, 
    selectedTier, 
    setSelectedTier, 
    selectedSize, 
    vehicleData,
    selectedTerrain,
    selectedAddons,
    isLoading, 
    setCurrentStep 
  } = useApp();

  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);

  const tiers = recommendations?.tiers || {};
  const currentTire = tiers[selectedTier] || tiers.recommended || tiers.budget;

  // Generate WhatsApp wa.me URL
  const generateWhatsAppUrl = (grandTotal) => {
    const shopPhoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "918089579575";
    
    const vehicleInfo = vehicleData
      ? `${vehicleData.make} ${vehicleData.model} (${vehicleData.variant || ''})`
      : 'Vehicle';
      
    const regNo = vehicleData?.vehicle_number ? `Reg: ${vehicleData.vehicle_number}` : '';

    const selectedAddonTitles = selectedAddons
      .filter(a => a.selected)
      .map(a => `• ${a.title} (+₹${a.price})`)
      .join('\n');

    const message = `🚗 *SMART TIRE HUB ORDER INQUIRY*\n` +
      `-----------------------------------\n` +
      `🚘 *Vehicle:* ${vehicleInfo} ${regNo}\n` +
      `🛞 *Tire Dimension:* ${selectedSize}\n` +
      `🏷️ *Category:* ${selectedTier.toUpperCase()} TIER\n` +
      `📦 *Brand & Model:* ${currentTire?.brand} ${currentTire?.model_name}\n` +
      `💰 *Tire Price:* ₹${currentTire?.price} x 4 = ₹${(currentTire?.price || 0) * 4}\n` +
      `🛡️ *Warranty:* ${currentTire?.warranty_years || 3} Years Warranty\n\n` +
      `🛠️ *Selected Add-ons:*\n${selectedAddonTitles || '• None'}\n\n` +
      `💵 *ESTIMATED GRAND TOTAL:* ₹${grandTotal?.toLocaleString()}\n` +
      `-----------------------------------\n` +
      `Please confirm stock availability and booking appointment!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${shopPhoneNumber}?text=${encodedMessage}`;
  };

  const handleConfirmWhatsApp = (grandTotal) => {
    const url = generateWhatsAppUrl(grandTotal);
    window.open(url, '_blank');
    setIsUpsellModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep(3)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Terrain Selection
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-accent bg-red-accent/15 px-2.5 py-0.5 rounded-full">
          Step 4 of 4
        </span>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-display font-black text-white">Recommended Tire Options</h2>
        <p className="text-xs text-slate-400">Curated specifically for <span className="text-white font-bold">{selectedSize}</span> on {selectedTerrain} roads.</p>
      </div>

      {/* Tier Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-dark-800 rounded-2xl border border-slate-800">
        {['budget', 'recommended', 'premium'].map((tierKey) => (
          <button
            key={tierKey}
            onClick={() => setSelectedTier(tierKey)}
            className={`py-2.5 px-2 rounded-xl text-xs font-display font-bold capitalize transition-all ${
              selectedTier === tierKey
                ? 'bg-red-accent text-white shadow-glow-red-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tierKey}
          </button>
        ))}
      </div>

      {/* Main Tire Card / Carousel Content */}
      {isLoading ? (
        <TireCardSkeleton />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTier}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`glass-panel rounded-3xl p-6 border ${TIER_META[selectedTier]?.cardBorder} shadow-card-dark relative space-y-5 overflow-hidden`}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-accent/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Tier Badge Header */}
            <div className="flex justify-between items-center">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${TIER_META[selectedTier]?.badgeBg}`}>
                {TIER_META[selectedTier]?.title}
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> {currentTire?.warranty_years || 3} Yrs Warranty
              </span>
            </div>

            {/* Brand & Model Name */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-accent block">{currentTire?.brand}</span>
              <h3 className="text-2xl font-display font-black text-white">{currentTire?.model_name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{TIER_META[selectedTier]?.tagline}</p>
            </div>

            {/* Dimension & Speed Specs Box */}
            <div className="bg-dark-900/90 rounded-2xl p-4 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Tire Size</span>
                <span className="font-display font-extrabold text-lg text-white">{currentTire?.size}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Speed & Load</span>
                <span className="font-display font-bold text-sm text-slate-300">
                  {currentTire?.load_index || 88}{currentTire?.speed_rating || 'H'}
                </span>
              </div>
            </div>

            {/* Terrain Suitable Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Optimized For:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentTire?.terrain_tags?.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700/80 text-xs text-slate-200 capitalize font-medium">
                    • {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stock Count Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Availability:</span>
              <span className="font-bold text-emerald-400">In Stock ({currentTire?.stock_count || 12} units left)</span>
            </div>

            {/* Pricing Section */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Price Per Tire</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-display font-black text-white">₹{currentTire?.price?.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">+ Tax</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Set of 4 Tires</span>
                <span className="text-sm font-bold text-red-accent font-display">₹{((currentTire?.price || 0) * 4).toLocaleString()}</span>
              </div>
            </div>

            {/* CTA Button opening Upsell Modal */}
            <button
              onClick={() => setIsUpsellModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-red-accent to-red-dark text-white font-display font-bold text-base rounded-2xl shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <MessageSquare className="w-5 h-5 fill-current" /> Order & Book Fitting
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Upsell Toggle Modal */}
      <UpsellModal
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
        onConfirmWhatsApp={handleConfirmWhatsApp}
      />
    </div>
  );
};

export default RecommendationsView;
