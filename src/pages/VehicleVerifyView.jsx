import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Disc, ChevronRight, RefreshCw, Layers, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BottomSheetDrawer from '../components/BottomSheetDrawer';

const VehicleVerifyView = () => {
  const { vehicleData, selectedSize, setSelectedSize, setCurrentStep } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!vehicleData) return null;

  const defaultSize = vehicleData.default_tire_size;
  const upsizeOptions = vehicleData.upsize_options || [];

  const handleContinue = () => {
    setCurrentStep(3); // Proceed to Terrain Selection View
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep(1)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-accent bg-red-accent/15 px-2.5 py-0.5 rounded-full">
          Step 2 of 4
        </span>
      </div>

      {/* Vehicle Specs Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 shadow-card-dark relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-accent/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-red-accent tracking-wider">Verified Spec</span>
            <h2 className="text-2xl font-display font-black text-white">{vehicleData.make} {vehicleData.model}</h2>
            <p className="text-xs text-slate-400 font-medium">{vehicleData.variant || 'Standard Trim'} ({vehicleData.year})</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-slate-700/80 flex items-center justify-center text-slate-300 shadow-inner">
            <Car className="w-6 h-6 text-red-accent" />
          </div>
        </div>

        {vehicleData.vehicle_number && (
          <div className="inline-block px-3 py-1 bg-dark-900 border border-slate-700 rounded-xl font-mono text-xs font-bold text-amber-400 tracking-wider">
            {vehicleData.vehicle_number}
          </div>
        )}
      </motion.div>

      {/* Prominent Detected Tire Size Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="glass-panel rounded-3xl p-6 border-2 border-red-accent/40 bg-gradient-to-b from-dark-800 to-dark-900 shadow-glow-red space-y-4 text-center relative"
      >
        <span className="text-xs uppercase font-bold text-slate-400 tracking-widest block">Selected Tire Dimension</span>

        <div className="flex items-center justify-center gap-3 py-2">
          <Disc className="w-9 h-9 text-red-accent animate-spin-slow shrink-0" />
          <h3 className="text-3xl font-display font-black tracking-wider text-white">
            {selectedSize}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-2">
          {selectedSize === defaultSize ? (
            <span className="text-xs bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              ✓ Factory Default Fitting
            </span>
          ) : (
            <span className="text-xs bg-amber-950/80 border border-amber-500/40 text-amber-400 font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              ★ Sport/Performance Upsize
            </span>
          )}
        </div>

        {/* Change Size / Upsize Drawer Trigger Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full py-3.5 mt-2 bg-dark-700/80 hover:bg-dark-600 border border-slate-600/60 rounded-2xl text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:border-red-accent transition-all active:scale-[0.98]"
        >
          <Layers className="w-4 h-4 text-red-accent" />
          Change Dimension or Choose Upsize ({upsizeOptions.length} available)
        </button>
      </motion.div>

      {/* Next Step CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        onClick={handleContinue}
        className="w-full py-4 bg-gradient-to-r from-red-accent to-red-dark text-white font-display font-bold text-base rounded-2xl shadow-glow-red flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        Select Driving Terrain <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Bottom Sheet Drawer for Upsize selection */}
      <BottomSheetDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        defaultSize={defaultSize}
        upsizeOptions={upsizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />
    </div>
  );
};

export default VehicleVerifyView;
