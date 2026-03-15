import { useState, useEffect } from 'react';
import { Instagram, Twitter, Mail, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/settings/profile_picture')
      .then(res => res.json())
      .then(data => {
        if (data.value) setProfilePic(data.value);
      })
      .catch(console.error);
  }, []);

  const scrollToTop = () => {
    // Disable pointer events temporarily to improve scroll performance
    document.body.style.pointerEvents = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Re-enable after scroll completes
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 1000);
  };

  return (
    <footer id="community" className="bg-black text-white py-8 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-4">
        {/* Left Third */}
        <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left md:w-1/3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e1e1e] rounded-full flex items-center justify-center overflow-hidden relative">
              {profilePic ? (
                <img src={profilePic} alt="Community" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">V</span>
              )}
            </div>
            <span className="font-display font-bold tracking-wider text-lg">VIATORS</span>
          </div>
          <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
            {t('A community dedicated to high-altitude exploration and the shared experience of the mountains.')}
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a href="https://www.instagram.com/_viators/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
            <button className="text-zinc-500 hover:text-white transition-colors cursor-not-allowed opacity-50" title={t('Coming Soon')}>
              <Twitter size={18} />
            </button>
            <a href="mailto:viatoors@gmail.com" className="text-zinc-500 hover:text-white transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Middle Third (Copyright & Photo Rights) */}
        <div className="flex flex-col items-center justify-end gap-3 text-center md:w-1/3 order-last md:order-none mt-4 md:mt-0">
          <p className="text-zinc-500 text-xs">
            {t('All photos belong to')} <a href="https://www.instagram.com/mark_kolossa/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors">@mark_kolossa</a>.
          </p>
          <p className="text-zinc-700 text-[10px] uppercase tracking-widest">
            {t('© 2026 Viators Community. All Rights Reserved.')}
          </p>
        </div>

        {/* Right Third */}
        <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right md:w-1/3">
          <div>
            <p className="text-lg md:text-xl font-display font-light text-zinc-300 max-w-sm leading-tight mb-2">
              {t('Interested in the vision?')}
            </p>
            <a 
              href="https://www.instagram.com/_viators/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium text-base inline-flex items-center gap-2"
            >
              {t('Message me!')} <Instagram size={16} />
            </a>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="mt-4 flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
          >
            {t('Back to Summit')}
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
