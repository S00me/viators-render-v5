import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.itinerary': 'Itinerary',
    'nav.gear': 'Gear',
    'nav.admin': 'Admin',
    'hero.subtitle': 'Alpinist & Photographer',
    'hero.scroll': 'Scroll to explore',
    'hero.whats_viators': 'What\'s <span class="font-bold text-white">VIATORS</span>?',
    '"It is not the mountain we conquer, but ourselves."': '"It is not the mountain we conquer, but ourselves."',
    'Begin Ascent': 'Begin Ascent',
    'upcoming.title': 'Next Objective',
    'upcoming.summary': 'Summary',
    'upcoming.join': 'Want to join? Hit me up!',
    'upcoming.view_itinerary': 'VIEW FULL ITINERARY',
    'upcoming.stats': 'Key Statistics',
    'upcoming.elevation': 'Elevation',
    'upcoming.distance': 'Distance',
    'upcoming.duration': 'Duration',
    'upcoming.highlights': 'Highlights',
    'past.title': 'Past Expeditions',
    'past.archive': 'Archive',
    'past.view_details': 'View Details',
    'past.gallery': 'Gallery',
    'past.more': 'More',
    'past.stats': 'Statistics',
    'past.elevation': 'Elevation',
    'past.location': 'Location',
    'past.date': 'Date',
    'past.total': 'total',
    'past.show_all': 'Show All',
    'past.collapse': 'Collapse',
    'nav.community': 'Community',
    'nav.about': 'About Us',
    'about.vision': 'Vision',
    'about.community': 'Community',
    'about.how_to_join': 'How to Join',
    'about.how_can_i_join': 'How can I join?',
    'about.hit_me_up': 'DM me!',
    'nav.return': 'Return to Base Camp',
    'itinerary.title': 'Expedition Itinerary',
    'itinerary.day': 'Day',
    'itinerary.stats': 'Daily Stats',
    'itinerary.distance': 'Distance',
    'itinerary.elevation_gain': 'Elevation Gain',
    'itinerary.elevation_loss': 'Elevation Loss',
    'itinerary.logistics': 'Logistics',
    'itinerary.shelter': 'Shelter',
    'itinerary.water': 'Water Source',
    'itinerary.food': 'Food Available',
    'itinerary.store': 'Store Available',
    'itinerary.difficulty': 'Difficulty',
    'itinerary.komoot': 'View on Komoot',
    'itinerary.download_gpx': 'Download GPX',
    'itinerary.map': 'Interactive Map',
    'itinerary.layers': 'Map Layers',
    'gear.title': 'Gear List',
    'gear.category': 'Category',
    'footer.rights': 'All rights reserved.',
    'A community dedicated to high-altitude exploration and the shared experience of the mountains.': 'A community dedicated to high-altitude exploration and the shared experience of the mountains.',
    'Coming Soon': 'Coming Soon',
    'Interested in the vision?': 'Interested in the vision?',
    'Message me!': 'Message me!',
    'Back to Summit': 'Back to Summit',
    'All photos belong to': 'All photos belong to',
    '© 2026 Viators Community. All Rights Reserved.': '© 2026 Viators Community. All Rights Reserved.',
    'FULL ITINERARY': 'FULL ITINERARY',
    'Detailed breakdown of the route, daily stats, and essential gear for the expedition.': 'Detailed breakdown of the route, daily stats, and essential gear for the expedition.',
    'Daily Breakdown': 'Daily Breakdown',
    'DAY': 'DAY',
    'View on Komoot': 'View on Komoot',
    'Distance': 'Distance',
    'Gain': 'Gain',
    'Loss': 'Loss',
    'Difficulty': 'Difficulty',
    'Shelter': 'Shelter',
    'Water Source': 'Water Source',
    'Available': 'Available',
    'None': 'None',
    'Food Source': 'Food Source',
    'Store': 'Store',
    'Expedition Gear': 'Expedition Gear',
    'Route Key': 'Route Key',
  },
  hu: {
    'nav.home': 'Főoldal',
    'nav.itinerary': 'Útiterv',
    'nav.gear': 'Felszerelés',
    'nav.admin': 'Admin',
    'hero.subtitle': 'Alpinista és Fotós',
    'hero.scroll': 'Görgess le',
    'hero.whats_viators': 'Mi az a <span class="font-bold text-white">VIATORS</span>?',
    '"It is not the mountain we conquer, but ourselves."': '"Nem a hegyet hódítjuk meg, hanem önmagunkat."',
    'Begin Ascent': 'Kezdd meg az ereszkedést',
    'upcoming.title': 'Következő túra',
    'upcoming.summary': 'Összefoglaló',
    'upcoming.join': 'Csatlakoznál? Írj nekem!',
    'upcoming.view_itinerary': 'TELJES ÚTITERV',
    'upcoming.stats': 'Fontos adatok',
    'upcoming.elevation': 'Magasság',
    'upcoming.distance': 'Távolság',
    'upcoming.duration': 'Időtartam',
    'upcoming.highlights': 'Fénypontok',
    'past.title': 'Korábbi Expedíciók',
    'past.archive': 'Archívum',
    'past.view_details': 'Részletek',
    'past.gallery': 'Galéria',
    'past.more': 'Több',
    'past.stats': 'Fontos adatok',
    'past.elevation': 'Magasság',
    'past.location': 'Helyszín',
    'past.date': 'Dátum',
    'past.total': 'összesen',
    'past.show_all': 'Összes Mutatása',
    'past.collapse': 'Összecsukás',
    'nav.community': 'Kapcsolat',
    'nav.about': 'Rólunk',
    'about.vision': 'Vízió',
    'about.community': 'Közösség',
    'about.how_to_join': 'Hogyan csatlakozhatsz?',
    'about.how_can_i_join': 'Hogyan csatlakozhatok?',
    'about.hit_me_up': 'Írj nekem!',
    'nav.return': 'Vissza az Alaptáborba',
    'itinerary.title': 'Expedíció Útiterv',
    'itinerary.day': 'Nap',
    'itinerary.stats': 'Napi Statisztika',
    'itinerary.distance': 'Távolság',
    'itinerary.elevation_gain': 'Szintemelkedés',
    'itinerary.elevation_loss': 'Szintcsökkenés',
    'itinerary.logistics': 'Logisztika',
    'itinerary.shelter': 'Szállás',
    'itinerary.water': 'Vízvételi lehetőség',
    'itinerary.food': 'Étel elérhető',
    'itinerary.store': 'Bolt elérhető',
    'itinerary.difficulty': 'Nehézség',
    'itinerary.komoot': 'Megtekintés Komoot-on',
    'itinerary.download_gpx': 'GPX Letöltése',
    'itinerary.map': 'Interaktív Térkép',
    'itinerary.layers': 'Térképrétegek',
    'gear.title': 'Felszerelés Lista',
    'gear.category': 'Kategória',
    'footer.rights': 'Minden jog fenntartva.',
    'A community dedicated to high-altitude exploration and the shared experience of the mountains.': 'Egy közösség, amelyet a magashegyi felfedezésnek és a hegyek közös élményének szenteltek.',
    'Coming Soon': 'Hamarosan',
    'Interested in the vision?': 'Érdekel a vízió?',
    'Message me!': 'Írj nekem!',
    'Back to Summit': 'Vissza a csúcsra',
    'All photos belong to': 'Minden fotó tulajdonosa:',
    '© 2026 Viators Community. All Rights Reserved.': '© 2026 Viators Community. Minden jog fenntartva.',
    'FULL ITINERARY': 'TELJES ÚTITERV',
    'Detailed breakdown of the route, daily stats, and essential gear for the expedition.': 'Az útvonal részletes lebontása, napi statisztikák és a legfontosabb felszerelések.',
    'Daily Breakdown': 'Napi ütemterv',
    'DAY': 'NAP',
    'View on Komoot': 'Megtekintés Komoot-on',
    'Distance': 'Távolság',
    'Gain': 'Szintemelkedés',
    'Loss': 'Szintcsökkenés',
    'Difficulty': 'Nehézség',
    'Shelter': 'Szállás',
    'Water Source': 'Vízvételi lehetőség',
    'Available': 'Elérhető',
    'None': 'Nincs',
    'Food Source': 'Étel elérhető',
    'Store': 'Bolt elérhető',
    'Expedition Gear': 'Felszerelés',
    'Route Key': 'Útvonal Jelmagyarázat',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hu')) {
      setLanguageState(savedLang);
    } else if (window.location.pathname.startsWith('/hu')) {
      setLanguageState('hu');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    
    // Handle URL routing for language
    const currentPath = window.location.pathname;
    if (lang === 'hu' && !currentPath.startsWith('/hu')) {
      window.history.pushState({}, '', '/hu' + (currentPath === '/' ? '' : currentPath));
    } else if (lang === 'en' && currentPath.startsWith('/hu')) {
      const newPath = currentPath.replace('/hu', '') || '/';
      window.history.pushState({}, '', newPath);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
