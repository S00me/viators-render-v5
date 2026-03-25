import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

export function Hero() {
  const { scrollY } = useScroll();
  
  // We keep the exact same animation values
  const y = useTransform(scrollY, [0, 500], [0, -300]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const bgOpacity = useTransform(scrollY, [300, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  
  const [bgImage, setBgImage] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch('/api/settings/hero_background')
      .then(res => res.json())
      .then(data => {
        if (data.value) {
          setBgImage(data.value);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const scrollToExpedition = () => {
    const element = document.getElementById('expedition');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-[100svh] relative flex items-center justify-center bg-black">
      {/* 
        OPTIMIZATION 1: Fixed Parallax
        Instead of moving an absolute element down inside a scrolling container,
        we fix it to the viewport and move it up slightly. This completely detaches
        the heavy image from the document's scroll flow, preventing the browser
        from constantly repainting it.
      */}
      <motion.div 
        className="fixed inset-0 z-0 origin-top pointer-events-none"
        style={{ 
          y, 
          scale,
          opacity: bgOpacity,
          willChange: "transform, opacity",
          WebkitTransform: "translateZ(0)" // Safari specific hardware acceleration
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          initial={{ opacity: 0 }}
          animate={{ opacity: bgImage ? 1 : 0 }}
          transition={{ duration: 1 }}
          style={{ 
            backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
            willChange: "opacity"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black pointer-events-none" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ opacity: textOpacity, willChange: "opacity, transform" }}
        >
          <h1 className="font-display text-[18vw] md:text-[12vw] font-bold text-white leading-none tracking-tighter opacity-90">
            VIATORS
          </h1>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        style={{ opacity: textOpacity, willChange: "opacity" }}
        className="absolute bottom-[25vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 w-max"
      >
        <div className="h-12 md:h-16 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <MotionLink 
          to={language === 'hu' ? '/hu/about' : '/about'}
          className="inline-block px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/80 hover:text-white font-light text-sm md:text-base tracking-widest"
          initial={{ backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          transition={{ delay: 0.8, duration: 1 }}
          dangerouslySetInnerHTML={{ __html: t('hero.whats_viators') }}
        />
      </motion.div>

      <motion.button
        onClick={scrollToExpedition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors flex flex-col items-center gap-2 group cursor-pointer z-20"
        style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))', willChange: "opacity" }}
      >
        <span className="text-[10px] uppercase tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">{t('Begin Ascent')}</span>
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </motion.button>
    </section>
  );
}
