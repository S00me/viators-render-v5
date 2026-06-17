import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const isScrollingUpRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          const halfway = window.innerHeight / 2;
          
          if (scrollPos > halfway) {
            setIsVisible(true);
            // Safety check against somehow being at the top with a large scroll (impossible normally)
            if (scrollPos === 0) {
              setIsVisible(false);
              setIsScrollingUp(false);
              isScrollingUpRef.current = false;
            }
          } else {
            // Hide it if we scroll back to top (either smoothly or via touch), but avoid glitching
            if (scrollPos <= 5) {
              setIsVisible(false);
              setIsScrollingUp(false);
              isScrollingUpRef.current = false;
            } else if (!isScrollingUpRef.current) {
              setIsVisible(false);
            }
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
    setIsScrollingUp(true);
    isScrollingUpRef.current = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-8 right-6 z-40 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom,1rem)]">
      <AnimatePresence>
        {isVisible && (
           <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              backgroundColor: isScrollingUp ? "#9333ea" : "rgba(0,0,0,0.3)",
              color: isScrollingUp ? "#000000" : "#ffffff",
              borderColor: isScrollingUp ? "transparent" : "rgba(255,255,255,0.05)"
            }}
            exit={{ opacity: 0, scale: 0.8, y: isScrollingUp ? -50 : 20 }}
            whileTap={{ scale: 0.9 }}
            transition={{ 
              opacity: { duration: 0.3 },
              y: { type: "spring", stiffness: 300, damping: 20 },
              backgroundColor: { duration: 0.1 },
              color: { duration: 0.1 }
            }}
            onClick={scrollToTop}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="pointer-events-auto p-3.5 w-12 h-12 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center outline-none border"
          >
            <motion.div
              animate={{
                scaleY: isScrollingUp ? 3.5 : 1,
                y: isScrollingUp ? -15 : 0,
                opacity: isScrollingUp ? 0 : 1,
              }}
              transition={{
                duration: 0.7,
                ease: "easeIn" // accelerate upwards
              }}
              className="flex items-center justify-center transform origin-bottom"
            >
              <ArrowUp className="w-5 h-5 block" strokeWidth={2.5} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

