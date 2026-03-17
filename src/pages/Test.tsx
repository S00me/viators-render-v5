import { useEffect } from 'react';

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
    <div className="relative min-h-[300dvh] w-full text-white flex flex-col">
      <main className="relative z-10 w-full px-8 flex-grow pt-[calc(env(safe-area-inset-top,40px)+6rem)] flex flex-col gap-16 pb-[calc(env(safe-area-inset-bottom,40px)+6rem)]">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-white/90 tracking-tight">
            SAFE AREA
            <br />
            LAB
          </h1>
          <p className="mt-6 text-white/80 max-w-sm text-lg font-medium">
            The dynamic lines are gone. The background is a solid dark gray. Scroll down to slide these panels into the notch area and see if they break the safe area.
          </p>
        </div>

        {/* Test Panel 1: High Contrast Block */}
        <div className="bg-white text-black p-8 rounded-3xl shadow-2xl relative z-20">
          <h3 className="font-black text-2xl mb-2">High Contrast Panel</h3>
          <p className="font-medium opacity-80">Sometimes pure white or bright elements scrolling near the notch can trigger Safari's contrast protection.</p>
        </div>

        {/* Test Panel 2: Glassmorphism */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl relative z-20">
          <h3 className="font-black text-2xl mb-2">Glassmorphism Panel</h3>
          <p className="font-medium opacity-80">Heavy backdrop filters can sometimes cause rendering glitches near the safe areas on older iOS versions.</p>
        </div>
        
        {/* Test Panel 3: Solid Color Block */}
        <div className="bg-blue-600 p-8 rounded-3xl relative z-20">
          <h3 className="font-black text-2xl mb-2">Solid Color Block</h3>
          <p className="font-medium opacity-80">Just another block to create scrollable height and test intersection with the bottom home bar.</p>
        </div>
      </main>
    </div>
  );
}
