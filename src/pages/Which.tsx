import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'motion/react';

export default function Which() {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSelect('hu');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (lang: 'en' | 'hu') => {
    setLanguage(lang);
    localStorage.setItem('languagePromptShown', 'true');
    navigate(lang === 'hu' ? '/hu' : '/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black overflow-hidden">
      {logoUrl && (
        <div 
          className="absolute inset-0 opacity-20 blur-xl pointer-events-none"
          style={{
            backgroundImage: `url(${logoUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl text-center relative z-10"
      >
        <button 
          onClick={() => handleSelect('hu')}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 uppercase">Nyelv kiválasztása</h2>
        <p className="text-zinc-400 mb-10 text-sm md:text-base">Szeretnéd magyarul folytatni az oldalt?</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleSelect('hu')}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            igen
          </button>
          <button 
            onClick={() => handleSelect('en')}
            className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/5 hover:scale-[1.02] active:scale-[0.98]"
          >
            stick to english
          </button>
        </div>
      </motion.div>
    </div>
  );
}
