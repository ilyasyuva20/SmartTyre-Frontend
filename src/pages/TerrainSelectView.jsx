import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Navigation, Mountain, CloudRain, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tiresApi } from '../services/api';

const TERRAIN_CARDS = [
  {
    id: 'city',
    title: 'City Commute',
    subtitle: 'Daily stop-and-go, potholes, fuel economy',
    icon: Building2,
    color: 'from-blue-500/20 to-indigo-500/10',
    borderColor: 'border-blue-500/50',
    accentColor: 'text-blue-400'
  },
  {
    id: 'highway',
    title: 'High Speed Cruising',
    subtitle: 'Expressways, low noise, high stability & grip',
    icon: Navigation,
    color: 'from-amber-500/20 to-red-500/10',
    borderColor: 'border-amber-500/50',
    accentColor: 'text-amber-400'
  },
  {
    id: 'off-road',
    title: 'Off-Road & Rough',
    subtitle: 'Mud, gravel, rocky trails & tough sidewalls',
    icon: Mountain,
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/50',
    accentColor: 'text-emerald-400'
  },
  {
    id: 'wet',
    title: 'Monsoon & Wet Roads',
    subtitle: 'Aquaplaning resistance, deep siping grooving',
    icon: CloudRain,
    color: 'from-cyan-500/20 to-blue-600/10',
    borderColor: 'border-cyan-500/50',
    accentColor: 'text-cyan-400'
  }
];

const TerrainSelectView = () => {
  const { 
    selectedTerrain, 
    setSelectedTerrain, 
    selectedSize, 
    setRecommendations, 
    setCurrentStep, 
    setIsLoading 
  } = useApp();

  const handleFetchRecommendations = async () => {
    setIsLoading(true);
    setCurrentStep(4); // Advance to Recommendations View

    try {
      const response = await tiresApi.getRecommendations(selectedSize, selectedTerrain);
      if (response.success) {
        setRecommendations(response);
      }
    } catch (err) {
      console.error('Recommendations error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep(2)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Specs
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-accent bg-red-accent/15 px-2.5 py-0.5 rounded-full">
          Step 3 of 4
        </span>
      </div>

      {/* Hero Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-display font-black text-white">Select Primary Driving Terrain</h2>
        <p className="text-xs text-slate-400">We optimize compound durability & tread pattern based on your usage.</p>
      </div>

      {/* 4 Touch-Friendly Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {TERRAIN_CARDS.map((card, idx) => {
          const IconComponent = card.icon;
          const isSelected = selectedTerrain === card.id;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTerrain(card.id)}
              className={`relative rounded-3xl p-5 border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-dark-700 to-dark-800 border-red-accent shadow-glow-red'
                  : 'bg-dark-800/80 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Checkmark Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-accent flex items-center justify-center text-white shadow-glow-red-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl bg-dark-900 border border-slate-700/60 flex items-center justify-center ${card.accentColor}`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-white">{card.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{card.subtitle}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Continue CTA */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleFetchRecommendations}
        className="w-full py-4 mt-2 bg-gradient-to-r from-red-accent to-red-dark text-white font-display font-bold text-base rounded-2xl shadow-glow-red flex items-center justify-center gap-2 transition-all"
      >
        View 3-Tier Recommendations <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default TerrainSelectView;
