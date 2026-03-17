import { useEffect } from 'react';
import { motion } from 'motion/react';

export default function Test() {
  useEffect(() => {
    // 1. The theme-color Meta Tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const originalThemeColor = metaThemeColor?.getAttribute('content');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', '#1a1a1a'); // Dark gray

    // 2. The "Nuclear" CSS for html, body, and #root
    const style = document.createElement('style');
    style.innerHTML = `
      html {
          background-color: #1a1a1a !important;
      }
      body {
          background-color: #1a1a1a !important;
          overscroll-behavior: none !important;
      }
      #root {
          background-color: transparent !important;
          min-height: 100dvh !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup when leaving the test page
      if (originalThemeColor) {
        metaThemeColor?.setAttribute('content', originalThemeColor);
      } else {
        metaThemeColor?.remove();
      }
      style.remove();
    };
  }, []);

  return (
    <div className="relative min-h-[300dvh] w-full text-white flex flex-col overflow-hidden">
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
              background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 42px)',
            }}
          />
        </div>
      </div>

      {/* Test Panel 1: Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-zinc-900/80 backdrop-blur-md border-b border-white/10 p-4 pt-[env(safe-area-inset-top,20px)]">
        <h2 className="text-center font-bold text-sm tracking-widest text-zinc-300">STICKY HEADER TEST</h2>
      </header>

      <main className="relative z-10 w-full px-8 flex-grow mt-24 flex flex-col gap-16 pb-48">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-white/90 tracking-tight">
            SAFE AREA
            <br />
            LAB
          </h1>
          <p className="mt-6 text-white/80 max-w-sm text-lg font-medium">
            We reverted to the stable dark gray background. Scroll down to test different UI panels and see if they break Safari's safe area.
          </p>
        </div>

        {/* Test Panel 2: High Contrast Block */}
        <div className="bg-white text-black p-8 rounded-3xl shadow-2xl relative z-20">
          <h3 className="font-black text-2xl mb-2">High Contrast Panel</h3>
          <p className="font-medium opacity-80">Sometimes pure white or bright elements scrolling near the notch can trigger Safari's contrast protection.</p>
        </div>

        {/* Test Panel 3: Glassmorphism */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl relative z-20">
          <h3 className="font-black text-2xl mb-2">Glassmorphism Panel</h3>
          <p className="font-medium opacity-80">Heavy backdrop filters can sometimes cause rendering glitches near the safe areas on older iOS versions.</p>
        </div>
        
        {/* Test Panel 4: Solid Color Block */}
        <div className="bg-blue-600 p-8 rounded-3xl relative z-20">
          <h3 className="font-black text-2xl mb-2">Solid Color Block</h3>
          <p className="font-medium opacity-80">Just another block to create scrollable height and test intersection with the bottom home bar.</p>
        </div>
      </main>

      {/* Test Panel 5: Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-zinc-900/90 backdrop-blur-lg border-t border-white/10 p-4 pb-[env(safe-area-inset-bottom,20px)]">
        <p className="text-center text-xs font-mono text-zinc-400">FIXED BOTTOM BAR TEST</p>
      </div>
    </div>
  );
}
