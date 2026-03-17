import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function Test() {
  const { scrollY } = useScroll();
  
  // Slide the glass panel up from 100% (below the header, hidden by overflow) 
  // to 0% (fully covering the header) over the first 150px of scrolling.
  const glassY = useTransform(scrollY, [0, 150], ['100%', '0%']);

  useEffect(() => {
    const bgColor = '#fdfbff'; // White-ish purple-ish

    // 1. The theme-color Meta Tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const originalThemeColor = metaThemeColor?.getAttribute('content');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', bgColor); 

    // 2. The "Nuclear" CSS for html, body, and #root
    const style = document.createElement('style');
    style.innerHTML = `
      html {
          background-color: ${bgColor} !important;
      }
      body {
          background-color: ${bgColor} !important;
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
    <div className="relative w-full text-slate-900 flex flex-col">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full overflow-hidden">
        {/* The Glassy Panel that slides up */}
        <motion.div 
          style={{ y: glassY }}
          className="absolute inset-0 bg-white/60 backdrop-blur-2xl border-b border-purple-900/10"
        />
        
        {/* Header Content */}
        <div className="relative z-10 px-8 pb-4 pt-[calc(env(safe-area-inset-top,40px)+16px)] flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight text-purple-950">Safe Area Header</span>
          <span className="text-sm font-bold text-purple-900/40 uppercase tracking-widest">Scroll ↓</span>
        </div>
      </header>

      {/* Initial Screen (matches background) */}
      <main className="relative z-10 w-full px-8 pt-12 pb-32 flex flex-col min-h-[100dvh]">
        <h1 className="text-5xl md:text-7xl font-black text-purple-950 tracking-tight">
          DYNAMIC
          <br />
          HEADER
        </h1>
        <p className="mt-6 text-purple-900/80 max-w-sm text-lg font-medium">
          The background is a uniform white-ish purple. As you scroll down, the glassy panel will slide up into the header and safe area.
        </p>
      </main>

      {/* Different Colored Section (Panel) */}
      <section className="relative z-20 w-full bg-purple-950 text-white px-8 py-24 rounded-t-[3rem] min-h-[150dvh] shadow-[0_-20px_50px_rgba(76,29,149,0.15)]">
        <h2 className="text-4xl font-black mb-6">Dark Panel</h2>
        <p className="text-purple-200 text-lg max-w-md">
          When this panel scrolls up and goes under the header, you will be able to see it through the glassy effect that slid into place.
        </p>
        
        <div className="mt-24 space-y-8">
          <div className="h-48 bg-purple-900/50 rounded-3xl border border-purple-700/50 p-8 flex items-center justify-center">
            <h3 className="font-bold text-2xl text-purple-300/50">Keep scrolling</h3>
          </div>
          <div className="h-48 bg-purple-900/50 rounded-3xl border border-purple-700/50 p-8 flex items-center justify-center">
            <h3 className="font-bold text-2xl text-purple-300/50">Keep scrolling</h3>
          </div>
          <div className="h-48 bg-purple-900/50 rounded-3xl border border-purple-700/50 p-8 flex items-center justify-center">
            <h3 className="font-bold text-2xl text-purple-300/50">Almost there</h3>
          </div>
        </div>
      </section>
      
    </div>
  );
}
