import React from 'react';

const TireCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto glass-panel rounded-3xl p-6 space-y-5 border border-slate-800 animate-pulse relative overflow-hidden">
      {/* Shimmer gradient line */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

      {/* Top Header Badge */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-24 bg-slate-800 rounded-full" />
        <div className="h-6 w-20 bg-slate-800 rounded-full" />
      </div>

      {/* Tire Brand & Model Placeholder */}
      <div className="space-y-2">
        <div className="h-8 w-3/4 bg-slate-800 rounded-lg" />
        <div className="h-4 w-1/2 bg-slate-800/60 rounded-md" />
      </div>

      {/* Specs Box */}
      <div className="bg-dark-800/80 rounded-2xl p-4 flex justify-between items-center border border-slate-800/60">
        <div className="space-y-1">
          <div className="h-3 w-12 bg-slate-800 rounded" />
          <div className="h-6 w-28 bg-slate-700 rounded" />
        </div>
        <div className="h-10 w-10 bg-slate-800 rounded-xl" />
      </div>

      {/* Terrain Tag Badges */}
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-800/70 rounded-md" />
        <div className="h-6 w-20 bg-slate-800/70 rounded-md" />
        <div className="h-6 w-16 bg-slate-800/70 rounded-md" />
      </div>

      {/* Price & CTA Button */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-800">
        <div className="space-y-1">
          <div className="h-3 w-10 bg-slate-800 rounded" />
          <div className="h-8 w-24 bg-slate-700 rounded-lg" />
        </div>
        <div className="h-12 w-32 bg-red-accent/30 rounded-2xl" />
      </div>
    </div>
  );
};

export default TireCardSkeleton;
