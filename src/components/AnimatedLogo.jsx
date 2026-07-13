import React from 'react';

export const AnimatedLogo = ({ variant = 'default', className = '' }) => {
  // Variants:
  // - 'login': Centered, large, continuous looping premium anchor.
  // - 'sidebar': Top watermarked brand emblem.
  // - 'seal': Citizen QR Viewport header, pulsing 3D digital verification seal.

  const baseVideoPath = '/animated-logo-v2.mp4';

  if (variant === 'login') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        {/* Dark badge background for light mode so mix-blend-screen works perfectly */}
        <div className="absolute w-[11rem] h-[11rem] md:w-[13rem] md:h-[13rem] bg-slate-950 rounded-full dark:bg-transparent shadow-2xl dark:shadow-none z-0"></div>
        <div className="absolute w-64 h-64 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow z-0"></div>
        <video
          src={baseVideoPath}
          autoPlay
          loop
          muted
          playsInline
          className="w-48 h-48 md:w-56 md:h-56 object-contain z-10 drop-shadow-[0_15px_15px_rgba(13,148,136,0.2)] transition-transform duration-500 hover:scale-105 mix-blend-screen"
        />
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 p-4 border-b border-white/10 ${className}`}>
        <div className="relative w-12 h-12 bg-slate-950 dark:bg-slate-900/30 rounded-xl overflow-hidden border border-slate-800 dark:border-white/20 shadow-inner flex items-center justify-center">
          <video
            src={baseVideoPath}
            autoPlay
            loop
            muted
            playsInline
            className="w-[120%] h-[120%] object-cover mix-blend-screen"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">الرقابة الصحية</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">محافظة نينوى</span>
        </div>
      </div>
    );
  }

  if (variant === 'seal') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <div className="absolute w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl animate-ping opacity-30 z-0"></div>
        <div className="relative p-2.5 rounded-full bg-slate-950 dark:bg-gradient-to-tr dark:from-emerald-600/30 dark:to-teal-500/10 border-2 border-slate-800 dark:border-emerald-500/40 shadow-[0_0_30px_rgba(13,148,136,0.4)] animate-pulse z-10 flex items-center justify-center">
          <video
            src={baseVideoPath}
            autoPlay
            loop
            muted
            playsInline
            className="w-24 h-24 object-contain rounded-full mix-blend-screen"
          />
        </div>
      </div>
    );
  }

  // Default fallback style
  return (
    <div className="relative rounded-full bg-slate-950 dark:bg-transparent overflow-hidden flex items-center justify-center shadow-lg dark:shadow-none">
      <video
        src={baseVideoPath}
        autoPlay
        loop
        muted
        playsInline
        className={`w-20 h-20 object-contain mix-blend-screen ${className}`}
      />
    </div>
  );
};

export default AnimatedLogo;
