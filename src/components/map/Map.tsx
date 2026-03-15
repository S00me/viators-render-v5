import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  route?: [number, number][]; // Single route (legacy support)
  routes?: { coordinates: [number, number][]; color: string }[]; // Multiple routes
  center?: [number, number];
  zoom?: number;
  className?: string;
  fitBounds?: boolean;
  basemap?: 'dark' | 'outdoors' | 'topo-dark' | 'none';
  lineColor?: string;
  lineWeight?: number;
  interactive?: boolean;
}

function MapUpdater({ center, zoom, route, routes, fitBounds }: { center: [number, number]; zoom: number; route?: [number, number][]; routes?: { coordinates: [number, number][]; color: string }[]; fitBounds?: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    // If fitBounds is true and we have routes, fit to them
    if (fitBounds) {
      const bounds = L.latLngBounds([]);
      let hasPoints = false;

      if (route && route.length > 0) {
        route.forEach(coord => bounds.extend(coord));
        hasPoints = true;
      }
      if (routes && routes.length > 0) {
        routes.forEach(r => {
          if (r.coordinates && r.coordinates.length > 0) {
            r.coordinates.forEach(coord => bounds.extend(coord));
            hasPoints = true;
          }
        });
      }

      if (hasPoints && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Fallback to center/zoom if no valid bounds
        map.setView(center, zoom);
      }
    } else {
      // If not fitting bounds, just set view
      map.setView(center, zoom);
    }
  }, [center, zoom, map, fitBounds, route, routes]);
  return null;
}

function CustomZoomControl() {
  const map = useMap();

  return (
    <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
        aria-label="Zoom In"
      >
        <Plus size={16} />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
        aria-label="Zoom Out"
      >
        <Minus size={16} />
      </button>
    </div>
  );
}

export default function Map({ route, routes, center = [46.5775, 7.9052], zoom = 13, className, fitBounds = false, basemap = 'dark', lineColor = '#8B5CF6', lineWeight = 4, interactive = true }: MapProps) {
  
  const tileLayer = (basemap === 'outdoors' || basemap === 'topo-dark')
    ? {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }
    : {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={false} 
      zoomControl={false}
      dragging={interactive}
      touchZoom={interactive}
      doubleClickZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      className={`w-full h-full rounded-xl z-0 ${className}`}
    >
      {basemap !== 'none' && (
        <TileLayer
          attribution={tileLayer.attribution}
          url={tileLayer.url}
          className={basemap === 'topo-dark' ? 'invert brightness-90 contrast-75 grayscale' : ''}
        />
      )}
      
      {/* Render Legacy Single Route */}
      {route && route.length > 0 && (
        <Polyline 
          positions={route} 
          pathOptions={{ color: lineColor, weight: lineWeight, opacity: 0.8 }} 
        />
      )}

      {/* Render Multiple Independent Routes */}
      {routes && routes.map((r, i) => (
        <Polyline 
          key={`route-${i}-${r.color}`} // Unique key to force re-render if color changes
          positions={r.coordinates} 
          pathOptions={{ color: r.color, weight: lineWeight, opacity: 0.8 }} 
        />
      ))}

      <MapUpdater center={center} zoom={zoom} route={route} routes={routes} fitBounds={fitBounds} />
      {interactive && <CustomZoomControl />}
    </MapContainer>
  );
}
