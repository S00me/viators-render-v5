import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const scrollToExpedition = () => {
    const element = document.getElementById('expedition');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-[100svh] relative flex items-center justify-center bg-black overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <div className="absolute inset-0 bg-black" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ opacity }}
        >
          <h1 className="font-display text-[22vw] md:text-[14vw] font-bold leading-none tracking-tighter select-none elegant-glint-text">
            VIATORS
          </h1>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-[25vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 w-max"
      >
        <div className="h-12 md:h-16 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <Link 
          to={language === 'hu' ? '/hu/about' : '/about'}
          className="inline-block px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all text-white/80 hover:text-white font-light text-sm md:text-base tracking-widest"
          dangerouslySetInnerHTML={{ __html: t('hero.whats_viators') }}
        />
      </motion.div>

      <motion.button
        onClick={scrollToExpedition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors flex flex-col items-center gap-2 group cursor-pointer z-20"
        style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
      >
        <span className="text-[10px] uppercase tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">{t('Begin Ascent')}</span>
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </motion.button>
    </section>
  );
}
