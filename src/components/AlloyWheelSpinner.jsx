import React from 'react';
import { motion } from 'framer-motion';

const AlloyWheelSpinner = ({ text = "Fetching Specs..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Glowing outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-red-accent/40 animate-ping opacity-30" />
        <div className="absolute -inset-2 rounded-full bg-red-accent/10 blur-md" />
        
        {/* Animated Alloy Wheel SVG */}
        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          className="w-20 h-20 text-slate-200 z-10"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Rim */}
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" className="text-slate-500" />
          <circle cx="50" cy="50" r="40" stroke="#ff2a4b" strokeWidth="2" strokeDasharray="6 4" />
          
          {/* Center Hub */}
          <circle cx="50" cy="50" r="12" fill="#ff2a4b" />
          <circle cx="50" cy="50" r="6" fill="#0d0d12" />
          
          {/* 5-Spoke Alloy Design */}
          {[0, 72, 144, 216, 288].map((angle, index) => (
            <g key={index} transform={`rotate(${angle} 50 50)`}>
              <rect x="47" y="10" width="6" height="30" rx="3" fill="currentColor" className="text-slate-300" />
              <circle cx="50" cy="22" r="2.5" fill="#0d0d12" />
            </g>
          ))}
        </motion.svg>
      </div>

      <motion.div 
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="space-y-1"
      >
        <p className="text-lg font-display font-bold tracking-wider text-slate-100 uppercase">{text}</p>
        <p className="text-xs text-red-accent/90 font-medium">Scanning RTO & Tire Database...</p>
      </motion.div>
    </div>
  );
};

export default AlloyWheelSpinner;
