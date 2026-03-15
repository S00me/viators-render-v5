import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Menu, ArrowLeft, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  isSubpage?: boolean;
}

export function Header({ isSubpage: propIsSubpage = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const isItineraryPage = location.pathname.includes('/itinerary');
  const isAboutPage = location.pathname.includes('/about');
  const isSubpage = isItineraryPage || isAboutPage || propIsSubpage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch profile picture
    fetch('/api/settings/profile_picture')
      .then(res => res.json())
      .then(data => {
        if (data.value) setProfilePic(data.value);
      })
      .catch(console.error);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (isSubpage) return; // Should not happen if buttons are hidden
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = isItineraryPage 
    ? [
        { label: t('nav.itinerary'), id: 'itinerary' },
        { label: t('nav.gear'), id: 'gear' }
      ]
    : isAboutPage
    ? []
    : [
        { label: t('upcoming.title'), id: 'expedition' },
        { label: t('past.archive'), id: 'trips' },
        { label: t('nav.community'), id: 'community' }
      ];

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-[1100] transition-all duration-500 px-6 pb-4 flex justify-between items-center",
        isMenuOpen ? "bg-black" : (isScrolled ? "bg-black/50 backdrop-blur-md border-b border-white/5" : "bg-transparent")
      )}
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 cursor-pointer">
        {isSubpage ? (
           <Link to={language === 'hu' ? '/hu' : '/'} className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-[#1e1e1e] rounded-full flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
               <ArrowLeft size={16} className="text-white" />
             </div>
             <span className="text-white font-display font-bold tracking-wider text-lg">VIATORS</span>
           </Link>
        ) : (
          <div className="flex items-center gap-2" onClick={() => scrollToSection('hero')}>
            <div 
              className="w-8 h-8 bg-[#1e1e1e] rounded-full flex items-center justify-center overflow-hidden relative group"
            >
              {profilePic ? (
                <img src={profilePic} alt="Community" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">V</span>
              )}
            </div>
            <span className="text-white font-display font-bold tracking-wider text-lg">VIATORS</span>
          </div>
        )}
      </div>

      <nav className="hidden lg:flex gap-8 items-center">
        {isSubpage ? (
          <Link
            to={language === 'hu' ? '/hu' : '/'}
            className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors uppercase flex items-center gap-2"
          >
            {t('nav.return')}
          </Link>
        ) : (
          <>
            <Link
              to={language === 'hu' ? '/hu/about' : '/about'}
              className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors uppercase"
            >
              {t('nav.about')}
            </Link>
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors uppercase"
              >
                {item.label}
              </button>
            ))}
          </>
        )}
        
        {/* Language Toggle */}
        <div className="flex items-center gap-2 ml-4 border-l border-white/10 pl-6">
          <span className={cn("text-xs font-bold", language === 'en' ? "text-white" : "text-white/40")}>ENG</span>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hu' : 'en')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                language === 'hu' ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-xs font-bold", language === 'hu' ? "text-white" : "text-white/40")}>HU</span>
        </div>
      </nav>

      <div className="flex items-center gap-4 lg:hidden z-50">
        {/* Mobile Language Toggle */}
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-bold", language === 'en' ? "text-white" : "text-white/40")}>EN</span>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hu' : 'en')}
            className="relative inline-flex h-5 w-9 items-center rounded-full bg-white/10 transition-colors"
          >
            <span
              className={cn(
                "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                language === 'hu' ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-[10px] font-bold", language === 'hu' ? "text-white" : "text-white/40")}>HU</span>
        </div>
        <button 
          className="text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-white/10 p-6 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            {isSubpage && (
                 <Link
                    to={language === 'hu' ? '/hu' : '/'}
                    className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors uppercase py-2 border-b border-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.return')}
                  </Link>
            )}
            {!isSubpage && (
              <Link
                to={language === 'hu' ? '/hu/about' : '/about'}
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors uppercase py-2 border-b border-white/5"
              >
                {t('nav.about')}
              </Link>
            )}
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                    if (isItineraryPage && item.id === 'gear') {
                        // Special handling for gear section in itinerary page if needed, 
                        // but scrollIntoView should work if id exists
                        const element = document.getElementById('gear');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                    } else if (isItineraryPage && item.id === 'itinerary') {
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        scrollToSection(item.id);
                    }
                    setIsMenuOpen(false);
                }}
                className="text-left text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors uppercase py-2 border-b border-white/5 last:border-0"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
