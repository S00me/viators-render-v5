import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  const description = language === 'hu' && data.description_hu ? data.description_hu : data.description;
  const vision = language === 'hu' && data.vision_hu ? data.vision_hu : data.vision;
  const community = language === 'hu' && data.community_hu ? data.community_hu : data.community;
  const howToJoin = language === 'hu' && data.how_to_join_hu ? data.how_to_join_hu : data.how_to_join;

  return (
    <>
      <Header isSubpage={true} />
      <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
        
        <main className="pt-32 pb-24 px-4 md:px-8 max-w-6xl mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-16"
        >
          <div className="relative flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16">
            {data.logo_url && (
              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-100 md:relative md:inset-auto md:w-1/3 flex-shrink-0 pointer-events-none md:pointer-events-auto">
                <img src={data.logo_url} alt="Logo" className="w-full max-w-[300px] mx-auto object-contain" />
              </div>
            )}
            <div className={`relative z-10 text-center md:text-right space-y-6 p-6 md:p-0 ${data.logo_url ? 'w-full md:w-2/3' : 'w-full'}`}>
              {/* Gradual blur background for mobile */}
              <div 
                className="absolute inset-[-20%] -z-10 md:hidden pointer-events-none" 
                style={{ 
                  backdropFilter: 'blur(8px)', 
                  WebkitBackdropFilter: 'blur(8px)', 
                  maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)', 
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)' 
                }} 
              />
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight uppercase drop-shadow-lg md:drop-shadow-none">
                {t('nav.about')}
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 md:text-zinc-400 font-light leading-relaxed drop-shadow-md md:drop-shadow-none">
                {description}
              </p>
            </div>
          </div>

          {data.group_photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img src={data.group_photo_url} alt="Community" className="w-full h-auto object-cover max-h-[600px]" />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6 text-center"
            >
              <h2 className="font-display text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4 text-center uppercase tracking-widest">{t('about.vision')}</h2>
              <p className="text-zinc-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{vision}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6 text-center"
            >
              <h2 className="font-display text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4 text-center uppercase tracking-widest">{t('about.community')}</h2>
              <p className="text-zinc-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{community}</p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* How to join section - Full width */}
      <section className="bg-purple-900/20 border-y border-purple-500/20 py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-20 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1 space-y-6 text-left">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white uppercase tracking-widest">{t('about.how_can_i_join')}</h2>
            <p className="text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">{howToJoin}</p>
          </div>
          <div className="flex-shrink-0">
            <a 
              href="https://www.instagram.com/kolossa_mark/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-nowrap"
            >
              {t('about.hit_me_up')}
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
      </div>
    </>
  );
}
