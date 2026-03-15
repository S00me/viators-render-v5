import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, MapPin, Calendar, Mountain, X } from 'lucide-react';
import Map from '@/components/map/Map';
import { parseTrack } from '@/lib/gpx';
import { Lightbox } from '@/components/ui/Lightbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface Trip {
  id: number;
  name: string;
  date: string;
  location: string;
  elevation: string;
  image: string;
  description?: string;
  gallery: string[];
  route_gpx: string | null;
  center_lat: number;
  center_lng: number;
  zoom: number;
  name_hu?: string;
  location_hu?: string;
  description_hu?: string;
  date_hu?: string;
  elevation_hu?: string;
}

export function PastTrips() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [detailRoute, setDetailRoute] = useState<[number, number][]>([]);
  const [gradientColor, setGradientColor] = useState<string>('rgba(24, 24, 27, 1)'); // Default zinc-900
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('/api/past-trips');
        const data = await res.json();
        setTrips(data);
      } catch (e) {
        console.error('Failed to fetch past trips', e);
      }
    };
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTrip && selectedTrip.route_gpx) {
      parseTrack(selectedTrip.route_gpx).then(setDetailRoute).catch(console.error);
    } else {
        // Default route or empty
        setDetailRoute([]);
    }

    // Extract color from image
    if (selectedTrip && selectedTrip.image) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = selectedTrip.image;
        img.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    // Get data from bottom 10%
                    const startY = Math.floor(img.height * 0.9);
                    const height = img.height - startY;
                    const imageData = ctx.getImageData(0, startY, img.width, height);
                    const data = imageData.data;
                    
                    let r = 0, g = 0, b = 0;
                    let count = 0;
                    
                    for (let i = 0; i < data.length; i += 4) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                    
                    r = Math.floor(r / count);
                    g = Math.floor(g / count);
                    b = Math.floor(b / count);
                    
                    setGradientColor(`rgba(${r}, ${g}, ${b}, 1)`);
                }
            }
        };
    } else {
        setGradientColor('rgba(24, 24, 27, 1)');
    }
  }, [selectedTrip]);

  const visibleTrips = isExpanded ? trips : trips.slice(0, 3);

  const getTripName = (trip: Trip) => language === 'hu' && trip.name_hu ? trip.name_hu : trip.name;
  const getTripLocation = (trip: Trip) => language === 'hu' && trip.location_hu ? trip.location_hu : trip.location;
  const getTripDescription = (trip: Trip) => language === 'hu' && trip.description_hu ? trip.description_hu : trip.description;
  const getTripDate = (trip: Trip) => language === 'hu' && trip.date_hu ? trip.date_hu : trip.date;
  const getTripElevation = (trip: Trip) => language === 'hu' && trip.elevation_hu ? trip.elevation_hu : trip.elevation;

  return (
    <section id="trips" className="py-24 bg-[#0e0e0e] text-white px-4 md:px-8 relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="max-w-7xl mx-auto relative">
        <AnimatePresence mode="wait">
          {selectedTrip ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-3xl overflow-hidden border border-white/10 transition-colors duration-500 shadow-2xl"
              style={{ backgroundColor: gradientColor }}
            >
              <div className="relative h-[40vh] md:h-[50vh]">
                {selectedTrip.image ? (
                  <img 
                    src={selectedTrip.image} 
                    alt={getTripName(selectedTrip)} 
                    className="absolute inset-0 w-full h-full object-cover opacity-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-zinc-900 flex items-center justify-center">
                    <Mountain size={64} className="text-zinc-800" />
                  </div>
                )}
                <div 
                    className="absolute inset-0" 
                    style={{ 
                        background: `linear-gradient(to top, ${gradientColor} 0%, transparent 100%)` 
                    }} 
                />
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-white hover:text-black transition-colors z-10"
                >
                  <X size={24} />
                </button>
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-2 block"
                  >
                    {getTripDate(selectedTrip)}
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white"
                  >
                    {getTripName(selectedTrip)}
                  </motion.h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-12">
                <div className="lg:col-span-2 space-y-8">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-xl text-zinc-100 font-light leading-relaxed mix-blend-plus-lighter">
                      {getTripDescription(selectedTrip)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {selectedTrip.gallery && selectedTrip.gallery.slice(0, 2).map((img, i) => (
                      <div 
                        key={i} 
                        className="aspect-square rounded-xl overflow-hidden bg-zinc-800 border border-white/5 cursor-pointer group"
                        onClick={() => {
                            setLightboxIndex(i);
                            setIsLightboxOpen(true);
                        }}
                      >
                        {img ? (
                          <img 
                            src={img} 
                            alt="Gallery" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Mountain size={24} className="text-zinc-700" />
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedTrip.gallery && selectedTrip.gallery.length > 2 && (
                      <div 
                        className="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer group flex items-center justify-center hover:bg-zinc-800 transition-colors"
                        onClick={() => {
                            setLightboxIndex(2);
                            setIsLightboxOpen(true);
                        }}
                      >
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-white">+{selectedTrip.gallery.length - 2}</span>
                            <span className="text-xs text-zinc-500 uppercase tracking-widest">{t('past.more')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-lg">
                    <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-widest mb-4">{t('past.stats')}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-zinc-300 flex items-center gap-2"><Mountain size={14} /> {t('past.elevation')}</span>
                        <span className="font-mono">{getTripElevation(selectedTrip)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-zinc-300 flex items-center gap-2"><MapPin size={14} /> {t('past.location')}</span>
                        <span className="font-mono text-right">{getTripLocation(selectedTrip)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-zinc-300 flex items-center gap-2"><Calendar size={14} /> {t('past.date')}</span>
                        <span className="font-mono">{getTripDate(selectedTrip)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-black relative shadow-xl hidden md:block">
                     <Map 
                      route={detailRoute} 
                      center={[selectedTrip.center_lat, selectedTrip.center_lng]} 
                      zoom={selectedTrip.zoom || 12} 
                      className="w-full h-full grayscale-[0.3]" 
                      fitBounds={true}
                      basemap="dark"
                      interactive={false}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2 block">{t('past.archive')}</span>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight uppercase">{t('past.title')}</h2>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-zinc-500 text-sm font-mono">
                    {trips.length} {t('past.total')}
                  </p>
                </div>
              </div>

              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {visibleTrips.map((trip) => (
                    <motion.div
                      key={trip.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedTrip(trip)}
                      className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5 hover:border-white/20 transition-colors"
                    >
                      {trip.image ? (
                        <img 
                          src={trip.image} 
                          alt={getTripName(trip)} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-900">
                          <Mountain size={48} className="text-zinc-800" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-purple-400 text-xs font-mono mb-2 block">{getTripDate(trip)}</span>
                        <h3 className="font-display text-2xl font-bold text-white mb-1">{getTripName(trip)}</h3>
                        <div className="flex items-center gap-4 text-zinc-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {getTripLocation(trip)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mountain size={12} /> {getTripElevation(trip)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {!isExpanded && trips.length > 3 && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="group flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <span className="text-xs uppercase tracking-widest">{t('past.show_all')}</span>
                    <div className="p-3 rounded-full border border-white/10 group-hover:border-white/30 transition-all group-hover:bg-white/5">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              )}
              
              {isExpanded && (
                 <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest transition-colors"
                  >
                    {t('past.collapse')}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedTrip && (
        <Lightbox 
            images={selectedTrip.gallery || []}
            initialIndex={lightboxIndex}
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </section>
  );
}

