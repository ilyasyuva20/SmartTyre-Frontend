import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Disc, ShieldCheck, RefreshCw, Smartphone, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, resetFlow, adminToken } = useApp();

  const isAdminPage = location.pathname === '/admin';

  return (
    <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { resetFlow(); navigate('/'); }} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-accent to-red-dark flex items-center justify-center shadow-glow-red-sm group-hover:scale-105 transition-transform">
            <Disc className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight text-white flex items-center gap-1">
              SMART<span className="text-red-accent">TIRE</span>
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">HUB PWA</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentStep > 1 && !isAdminPage && (
            <button
              onClick={resetFlow}
              title="Reset Search"
              className="p-2 rounded-xl bg-dark-800 border border-slate-700/60 text-slate-300 hover:text-white hover:border-red-accent transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {isAdminPage ? (
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white"
            >
              Client View
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin')}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                adminToken 
                  ? 'bg-red-accent/20 border-red-accent text-red-accent' 
                  : 'bg-dark-800 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title="Admin Dashboard"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
