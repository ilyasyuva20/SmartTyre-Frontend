import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Car, SlidersHorizontal, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { vehicleApi } from '../services/api';
import AlloyWheelSpinner from '../components/AlloyWheelSpinner';
import ManualVehicleModal from '../components/ManualVehicleModal';

const HomeView = () => {
  const { 
    setVehicleData, 
    setSelectedSize, 
    setCurrentStep, 
    isLoading, 
    setIsLoading,
    error,
    setError
  } = useApp();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const handleLookup = async (e) => {
    e?.preventDefault();
    if (!vehicleNumber.trim()) {
      setError('Please enter a valid vehicle registration number');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await vehicleApi.lookup({ vehicleNumber });
      if (response.success && response.data) {
        setVehicleData(response.data);
        setSelectedSize(response.data.default_tire_size);
        setCurrentStep(2); // Advance to Vehicle Specs & Upsize view
      } else {
        setError(response.message || 'Vehicle details not found');
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setError(err.response?.data?.message || 'Error connecting to lookup service. Try manual selection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVehicleSelect = async (manualSpecs) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await vehicleApi.lookup(manualSpecs);
      if (response.success && response.data) {
        setVehicleData(response.data);
        setSelectedSize(response.data.default_tire_size);
        setCurrentStep(2);
      }
    } catch (err) {
      setError('Failed to fetch tire mapping for selected model');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Hero Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 pt-2"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-accent/15 border border-red-accent/30 text-red-accent text-xs font-semibold uppercase tracking-wider shadow-glow-red-sm">
          <Sparkles className="w-3.5 h-3.5" /> AI Powered Tire Finder
        </span>
        <h2 className="text-3xl font-display font-black text-white tracking-tight leading-tight">
          Find Perfect Tires For <span className="text-red-accent">Your Ride</span>
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Enter registration number for instant OEM specs, terrain matching, & 3-tier price quotes.
        </p>
      </motion.div>

      {/* Main Search Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-3xl p-6 shadow-card-dark relative overflow-hidden border border-slate-800"
      >
        {/* Glow overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-accent/10 rounded-full blur-3xl pointer-events-none" />

        {isLoading ? (
          <AlloyWheelSpinner text="Fetching Vehicle Specs..." />
        ) : (
          <form onSubmit={handleLookup} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Vehicle Registration No.</span>
                <span className="text-[10px] text-slate-400 font-normal">e.g. KA05MB1234</span>
              </label>

              {/* Glow Effect Input */}
              <div className="relative glow-input rounded-2xl p-1 flex items-center">
                <div className="pl-3.5 pr-2 text-slate-400">
                  <Car className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="KA 05 MB 1234"
                  maxLength={13}
                  className="w-full bg-transparent py-3 px-2 text-xl font-display font-bold uppercase tracking-wider text-white placeholder-slate-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-accent to-red-dark text-white p-3 rounded-xl shadow-glow-red hover:scale-105 active:scale-95 transition-all"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-red-dark/20 border border-red-accent/30 text-red-accent text-xs text-center font-medium">
                {error}
              </motion.div>
            )}

            {/* Quick Demo Registration Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] text-slate-400 text-center font-medium">Test with Demo Numbers:</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['KA05MB1234', 'MH12AB1234', 'DL01CA9999', 'KA01EQ8888'].map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => { setVehicleNumber(reg); }}
                    className="px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700/60 text-slate-300 hover:border-red-accent text-xs font-mono font-medium transition-colors"
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Select Vehicle Manually Button (Bypassing RTO) */}
            <button
              type="button"
              onClick={() => setIsManualModalOpen(true)}
              className="w-full py-3.5 bg-dark-700/80 hover:bg-dark-600 border border-slate-700/80 rounded-2xl text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 hover:border-slate-500 transition-all active:scale-[0.98]"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-accent" />
              Select Vehicle Manually (Make / Model)
            </button>

          </form>
        )}
      </motion.div>

      {/* Value Proposition Grid */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        <div className="p-3 rounded-2xl bg-dark-800/60 border border-slate-800 text-center space-y-1">
          <Shield className="w-4 h-4 text-red-accent mx-auto" />
          <h4 className="text-[11px] font-bold text-slate-200">100% Fitment</h4>
          <p className="text-[9px] text-slate-400">OEM verified specs</p>
        </div>
        <div className="p-3 rounded-2xl bg-dark-800/60 border border-slate-800 text-center space-y-1">
          <Sparkles className="w-4 h-4 text-amber-400 mx-auto" />
          <h4 className="text-[11px] font-bold text-slate-200">3 Price Tiers</h4>
          <p className="text-[9px] text-slate-400">Budget to Premium</p>
        </div>
        <div className="p-3 rounded-2xl bg-dark-800/60 border border-slate-800 text-center space-y-1">
          <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
          <h4 className="text-[11px] font-bold text-slate-200">Instant Order</h4>
          <p className="text-[9px] text-slate-400">WhatsApp shop direct</p>
        </div>
      </div>

      {/* Cascading Manual Selection Modal */}
      <ManualVehicleModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSelectVehicle={handleManualVehicleSelect}
      />
    </div>
  );
};

export default HomeView;
