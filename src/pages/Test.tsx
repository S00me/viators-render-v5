import { useEffect } from 'react';
import { motion } from 'motion/react';

export default function Test() {
  useEffect(() => {
    // CRITICAL FIX: Safari uses the html/body background color for the safe areas.
    // If we only put the background on a div, the safe areas default to the body's color (black).
    // We set it to bright blue (#007AFF) here to definitively prove the safe area is covered.
    document.documentElement.style.backgroundColor = '#007AFF';
    document.body.style.backgroundColor = '#007AFF';
    
    return () => {
      // Cleanup when leaving the test page
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="relative min-h-[300dvh] w-full text-white flex flex-col justify-between">
      {/* Dynamic Background - GPU Accelerated Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100dvh] left-[-100vw] w-[300vw] h-[300dvh] origin-center -rotate-45">
          <motion.div
            animate={{
              y: [0, 42],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-full h-full"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 42px)',
            }}
          />
        </div>
      </div>

      {/* Top content: Pushed down by the notch/island */}
      <header className="relative z-10 pt-[env(safe-area-inset-top)] bg-black/20 pb-5 text-center">
        <div className="font-bold text-xl">↑ CONTENT IS BEHIND NOTCH ↑</div>
        <p>If the background above this is blue, it's working.</p>
      </header>

      {/* Stationary Text Relative to Page (Scrolls up into safe area) */}
      <main className="relative z-10 w-full pt-32 px-8 flex-grow">
        <h1 className="text-5xl md:text-7xl font-black text-white/90 tracking-tight">
          STATIONARY
          <br />
          TEXT
        </h1>
        <p className="mt-6 text-white/80 max-w-sm text-lg font-medium">
          This text is positioned relative to the document. As you scroll down, it will move up and into the safe area (behind the notch or dynamic island).
        </p>
      </main>

      {/* Bottom content: Pushed up by the Home Indicator */}
      <footer className="relative z-10 pb-[env(safe-area-inset-bottom)] bg-black/20 pt-5 text-center">
        <p>If the background below this is blue, it's working.</p>
        <div className="font-bold text-xl">↓ CONTENT IS BEHIND HOME BAR ↓</div>
      </footer>
    </div>
  );
}
