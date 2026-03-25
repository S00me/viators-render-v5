import { useState, useEffect } from 'react';
import { ArrowRight, Mountain, Ruler, Clock } from 'lucide-react';
import Map from '@/components/map/Map';
import { parseTrack } from '@/lib/gpx';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface UpcomingData {
  title: string;
  description: string;
  elevation: string;
  distance: string;
  duration: string;
  shelter: string;
  region: string;
  highlights: string[];
  route_gpx: string | null;
  center_lat: number;
  center_lng: number;
  zoom: number;
  image: string | null;
  title_hu?: string;
  description_hu?: string;
  region_hu?: string;
  shelter_hu?: string;
  highlights_hu?: string[];
  elevation_hu?: string;
  distance_hu?: string;
  duration_hu?: string;
}

export function UpcomingExpedition() {
  const [data, setData] = useState<UpcomingData | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [center, setCenter] = useState<[number, number]>([46.0000, 7.7300]);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/upcoming');
        const json = await res.json();
        
        // Parse highlights_hu if it's a string
        if (json.highlights_hu && typeof json.highlights_hu === 'string') {
          try {
            json.highlights_hu = JSON.parse(json.highlights_hu);
          } catch (e) {
            json.highlights_hu = [];
          }
        }
        
        setData(json);
        setCenter([json.center_lat, json.center_lng]);

        if (json.route_gpx) {
          try {
            const coordinates = await parseTrack(json.route_gpx);
            setRoute(coordinates);
            if (coordinates.length > 0) {
              setCenter(coordinates[0]);
            }
          } catch (e) {
            console.error("Failed to parse GPX", e);
          }
        }
      } catch (e) {
        console.error("Failed to fetch upcoming expedition", e);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div className="py-24 bg-black text-white text-center">Loading...</div>;

  const title = language === 'hu' && data.title_hu ? data.title_hu : data.title;
  const description = language === 'hu' && data.description_hu ? data.description_hu : data.description;
  const highlights = language === 'hu' && data.highlights_hu && data.highlights_hu.length > 0 ? data.highlights_hu : data.highlights;
  const elevation = language === 'hu' && data.elevation_hu ? data.elevation_hu : data.elevation;
  const distance = language === 'hu' && data.distance_hu ? data.distance_hu : data.distance;
  const duration = language === 'hu' && data.duration_hu ? data.duration_hu : data.duration;

  return (
    <section id="expedition" className="py-24 bg-black text-white px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none z-10 h-96" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-10 mt-auto h-96" />
      
      {/* Background Map - Removed expensive drop-shadow filter for scroll performance */}
      <div className="absolute inset-0 z-0 opacity-65 pointer-events-none">
        <Map 
          route={route} 
          center={center} 
          zoom={data.zoom} 
          basemap="dark" 
          interactive={false} 
          fitBounds={true} 
          lineColor="#b876ff" 
          lineWeight={3}
          className="w-full h-full scale-[1.5]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-12">
          <span className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2 block">{t('upcoming.title')}</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-none">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">{t('upcoming.summary')}</h3>
              <p className="text-zinc-300 leading-relaxed text-lg mb-10">
                {description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <a 
                  href="https://www.instagram.com/kolossa_mark/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  {t('upcoming.join')} <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <Link 
              to={language === 'hu' ? '/hu/itinerary' : '/itinerary'}
              className="relative flex items-center justify-center gap-3 w-full px-8 py-6 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white rounded-2xl font-display font-bold text-xl md:text-2xl transition-all backdrop-blur-md group overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">{t('upcoming.view_itinerary')}</span>
              <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform text-white" />
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
              <h3 className="text-zinc-400 text-xs uppercase tracking-widest mb-6">{t('upcoming.stats')}</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/50 rounded-xl text-white">
                    <Mountain size={20} />
                  </div>
                  <div>
                    <span className="block text-xl font-mono font-bold">{elevation}</span>
                    <span className="text-zinc-500 text-[10px] uppercase">{t('upcoming.elevation')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/50 rounded-xl text-white">
                    <Ruler size={20} />
                  </div>
                  <div>
                    <span className="block text-xl font-mono font-bold">{distance}</span>
                    <span className="text-zinc-500 text-[10px] uppercase">{t('upcoming.distance')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/50 rounded-xl text-white">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="block text-xl font-mono font-bold">{duration}</span>
                    <span className="text-zinc-500 text-[10px] uppercase">{t('upcoming.duration')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-xl">
              <h3 className="text-purple-400 text-xs uppercase tracking-widest mb-4">{t('upcoming.highlights')}</h3>
              <ul className="space-y-3">
                {highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

