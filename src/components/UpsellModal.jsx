import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, Check, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UpsellModal = ({ isOpen, onClose, onConfirmWhatsApp }) => {
  const { selectedAddons, toggleAddon, selectedTier, recommendations, selectedSize, vehicleData } = useApp();

  if (!isOpen) return null;

  const currentTire = recommendations?.tiers?.[selectedTier];
  const tirePrice = (currentTire?.price || 0) * 4; // 4 Tires Total
  
  const addonsTotal = selectedAddons
    .filter(a => a.selected)
    .reduce((sum, a) => sum + a.price, 0);

  const grandTotal = tirePrice + addonsTotal;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-md bg-dark-800 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-6 shadow-glow-red z-50 overflow-hidden"
        >
          {/* Top Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-accent/20 border border-red-accent/40 flex items-center justify-center text-red-accent">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Recommended Add-ons</h3>
                <p className="text-xs text-slate-400">Maximize tire lifespan & safety</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Special Discount Banner */}
          <div className="bg-gradient-to-r from-red-accent/20 to-red-dark/10 border border-red-accent/30 rounded-2xl p-3 mb-5 flex items-center gap-3">
            <Zap className="w-5 h-5 text-red-accent shrink-0" />
            <p className="text-xs text-slate-200">
              <span className="font-bold text-white">Combo Offer:</span> Get Free Nitrogen Refills for 1 Year when you buy a set of 4 tires!
            </p>
          </div>

          {/* Addons List */}
          <div className="space-y-3 mb-6">
            {selectedAddons.map(addon => (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  addon.selected
                    ? 'bg-red-accent/15 border-red-accent text-white shadow-glow-red-sm'
                    : 'bg-dark-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    addon.selected ? 'border-red-accent bg-red-accent' : 'border-slate-600'
                  }`}>
                    {addon.selected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className="font-medium text-sm text-slate-200">{addon.title}</span>
                </div>
                <span className="font-display font-bold text-sm text-red-accent">
                  +₹{addon.price}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="bg-dark-900/90 rounded-2xl p-4 border border-slate-800 space-y-2 mb-6 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Set of 4 Tires ({currentTire?.brand} {selectedSize})</span>
              <span>₹{tirePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Selected Workshop Add-ons</span>
              <span>+₹{addonsTotal.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Grand Estimated Total</span>
              <span className="text-base text-red-accent font-display font-black">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Direct WhatsApp Action Button */}
          <button
            onClick={() => onConfirmWhatsApp(grandTotal)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 text-base active:scale-95 transition-all"
          >
            <MessageSquare className="w-5 h-5 fill-current" /> Order via WhatsApp Now
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Direct shop booking • No advance payment required
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpsellModal;
