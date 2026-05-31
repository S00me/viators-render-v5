import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let ticking = false;
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Initialize
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  let tapBgColor = "#ffffff";
  let tapTextColor = "#000000";

  if (pathname.includes('/itinerary')) {
    tapBgColor = "#9333ea"; // purple-600
    tapTextColor = "#ffffff";
  } else if (pathname.includes('/about')) {
    tapBgColor = "#52525b"; // zinc-600
    tapTextColor = "#ffffff";
  }

  return (
    <div className="fixed bottom-8 right-6 z-40 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom,1rem)]">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileTap={{ 
              scale: 0.9, 
              backgroundColor: tapBgColor, 
              color: tapTextColor,
              borderColor: tapBgColor
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20, 
              opacity: { duration: 0.2 } 
            }}
            onClick={scrollToTop}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="pointer-events-auto p-3.5 bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-full text-zinc-300 shadow-xl flex items-center justify-center outline-none"
          >
            <ArrowUp className="w-5 h-5 pointer-events-none block" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

