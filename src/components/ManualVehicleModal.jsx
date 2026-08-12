import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, ChevronRight, CheckCircle2 } from 'lucide-react';
import { vehicleApi } from '../services/api';

const ManualVehicleModal = ({ isOpen, onClose, onSelectVehicle }) => {
  const [catalog, setCatalog] = useState({});
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      vehicleApi.getMakesModels()
        .then(res => {
          if (res.success && res.data) {
            setCatalog(res.data);
          }
        })
        .catch(err => console.error('Failed to load vehicle catalog:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const makes = Object.keys(catalog);
  const models = selectedMake ? Object.keys(catalog[selectedMake] || {}) : [];
  const variants = (selectedMake && selectedModel) ? catalog[selectedMake][selectedModel] || [] : [];

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel('');
    setSelectedVariant('');
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setSelectedVariant('');
  };

  const handleSubmit = () => {
    if (selectedMake && selectedModel) {
      onSelectVehicle({
        make: selectedMake,
        model: selectedModel,
        variant: selectedVariant || variants[0] || 'Standard'
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-dark-800 border border-slate-800 rounded-3xl p-6 shadow-card-dark relative"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-red-accent" />
                    Select Vehicle Manually
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Bypass RTO lookup and choose specs directly</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Loading car database...
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step 1: Select Brand / Make */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      1. Vehicle Manufacturer / Make
                    </label>
                    <select
                      value={selectedMake}
                      onChange={handleMakeChange}
                      className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3.5 text-slate-100 focus:outline-none focus:border-red-accent"
                    >
                      <option value="">-- Choose Brand --</option>
                      {makes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Select Model */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      2. Car Model
                    </label>
                    <select
                      disabled={!selectedMake}
                      value={selectedModel}
                      onChange={handleModelChange}
                      className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3.5 text-slate-100 focus:outline-none focus:border-red-accent disabled:opacity-40"
                    >
                      <option value="">-- Select Model --</option>
                      {models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Step 3: Select Variant */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      3. Trim / Variant (Optional)
                    </label>
                    <select
                      disabled={!selectedModel}
                      value={selectedVariant}
                      onChange={e => setSelectedVariant(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3.5 text-slate-100 focus:outline-none focus:border-red-accent disabled:opacity-40"
                    >
                      <option value="">-- Default / All Variants --</option>
                      {variants.map((v, i) => (
                        <option key={i} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Confirm CTA */}
                  <button
                    disabled={!selectedMake || !selectedModel}
                    onClick={handleSubmit}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-red-accent to-red-dark text-white font-bold rounded-2xl shadow-glow-red disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    Fetch Compatible Tires <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ManualVehicleModal;
