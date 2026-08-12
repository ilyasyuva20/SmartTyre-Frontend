import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Disc, ArrowUpRight } from 'lucide-react';

const BottomSheetDrawer = ({ isOpen, onClose, defaultSize, upsizeOptions, selectedSize, onSelectSize }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Bottom Sheet Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-dark-800 border-t border-red-accent/40 rounded-t-3xl p-6 z-50 shadow-glow-red"
          >
            {/* Top Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
                  <Disc className="w-5 h-5 text-red-accent animate-spin-slow" />
                  Select Tire Dimension
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Recommended sizes & alloy wheel upgrades</p>
              </div>
              <button 
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* Default Standard Size Option */}
              <div 
                onClick={() => { onSelectSize(defaultSize); onClose(); }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedSize === defaultSize 
                    ? 'bg-red-accent/15 border-red-accent text-white shadow-glow-red-sm' 
                    : 'bg-dark-700/60 border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSize === defaultSize ? 'border-red-accent bg-red-accent' : 'border-slate-500'}`}>
                    {selectedSize === defaultSize && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <div>
                    <div className="font-display font-bold text-base tracking-wide flex items-center gap-2">
                      {defaultSize}
                      <span className="text-[10px] bg-slate-700 text-slate-300 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Factory Fit
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">OEM standard specification for optimal fuel efficiency</p>
                  </div>
                </div>
              </div>

              {/* Upsize Options */}
              {upsizeOptions && upsizeOptions.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-accent mb-2 px-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Performance & Stance Upsizes
                  </p>
                  <div className="space-y-2.5">
                    {upsizeOptions.map((size, idx) => (
                      <div 
                        key={idx}
                        onClick={() => { onSelectSize(size); onClose(); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedSize === size 
                            ? 'bg-red-accent/15 border-red-accent text-white shadow-glow-red-sm' 
                            : 'bg-dark-700/60 border-slate-700/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSize === size ? 'border-red-accent bg-red-accent' : 'border-slate-500'}`}>
                            {selectedSize === size && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                          <div>
                            <div className="font-display font-bold text-base tracking-wide flex items-center gap-2">
                              {size}
                              <span className="text-[10px] bg-red-accent/20 text-red-accent font-semibold px-2 py-0.5 rounded-full uppercase">
                                Upgrade Option #{idx + 1}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">Enhanced road grip, wider contact patch & sporty stance</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action */}
            <div className="mt-6">
              <button 
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-red-accent to-red-dark text-white font-bold rounded-2xl shadow-glow-red text-center transition-transform active:scale-[0.98]"
              >
                Confirm Size Selection
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheetDrawer;
