import { useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

export default function Test() {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll position to a color.
  // We use dark, muted colors to ensure Safari doesn't trigger its contrast protection 
  // (which forces a black plate if it thinks the white status bar text will be unreadable).
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#1a1a1a', '#064e3b', '#4c1d95'] // Dark Gray -> Deep Emerald -> Deep Purple
  );

  useEffect(() => {
    // 1. Ensure theme-color Meta Tag exists
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const originalThemeColor = metaThemeColor?.getAttribute('content');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    // 2. The "Nuclear" CSS for #root and overscroll
    const style = document.createElement('style');
    style.innerHTML = `
      #root {
          background-color: transparent !important;
          min-height: 100dvh !important;
      }
      /* Prevent rubber-banding from showing default browser background */
      html, body {
          overscroll-behavior: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup
      if (originalThemeColor) {
        metaThemeColor?.setAttribute('content', originalThemeColor);
      } else {
        metaThemeColor?.remove();
      }
      style.remove();
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
    };
  }, []);

  // 3. Dynamically update the DOM and Meta tag when the color changes
  useMotionValueEvent(backgroundColor, "change", (latest) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', latest);
    }
    
    // Update html and body backgrounds imperatively to bypass React render cycle for maximum performance
    document.documentElement.style.setProperty('background-color', latest, 'important');
    document.body.style.setProperty('background-color', latest, 'important');
  });

  return (
    <div className="relative min-h-[300dvh] w-full text-white flex flex-col justify-between overflow-hidden bg-transparent">
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
          This text is positioned relative to the document. As you scroll down, the background color (and the notch!) will dynamically change.
        </p>
        <p className="mt-12 text-white/50 font-mono text-sm">
          ↓ Scroll down to see the transition ↓
        </p>
      </main>
    </div>
  );
}
