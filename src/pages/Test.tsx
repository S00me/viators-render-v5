import { useEffect } from 'react';
import { motion } from 'motion/react';

export default function Test() {
  useEffect(() => {
    // 1. The theme-color Meta Tag
    // Safari uses this to color the status bar / notch area
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const originalThemeColor = metaThemeColor?.getAttribute('content');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', '#1a1a1a'); // Dark gray

    // 2. The "Nuclear" CSS for html, body, and #root
    // Overrides global CSS that might be setting black backgrounds
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
    <div className="relative min-h-[300dvh] w-full text-white flex flex-col justify-between overflow-hidden">
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

      {/* Stationary Text Relative to Page (Scrolls up into safe area) */}
      <main className="relative z-10 w-full pt-[env(safe-area-inset-top,120px)] px-8 flex-grow mt-32">
        <h1 className="text-5xl md:text-7xl font-black text-white/90 tracking-tight">
          STATIONARY
          <br />
          TEXT
        </h1>
        <p className="mt-6 text-white/80 max-w-sm text-lg font-medium">
          This text is positioned relative to the document. As you scroll down, it will move up and into the safe area (behind the notch or dynamic island).
        </p>
      </main>
    </div>
  );
}
