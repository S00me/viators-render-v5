import { useState, useEffect } from 'react';
import { X, Plus, Trash, Save } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'itinerary' | 'map' | 'gear' | 'settings' | 'about'>('upcoming');
  const [upcomingData, setUpcomingData] = useState<any>(null);
  const [pastTrips, setPastTrips] = useState<any[]>([]);
  const [itineraryDays, setItineraryDays] = useState<any[]>([]);
  const [mapLayers, setMapLayers] = useState<any[]>([]);
  const [gearCategories, setGearCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [aboutData, setAboutData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const upcomingRes = await fetch('/api/upcoming');
      const upcoming = await upcomingRes.json();
      setUpcomingData(upcoming);

      const pastRes = await fetch('/api/past-trips');
      const past = await pastRes.json();
      setPastTrips(past);

      const itineraryRes = await fetch('/api/itinerary');
      const itinerary = await itineraryRes.json();
      setItineraryDays(itinerary.map((day: any) => {
        let parsedAmenities = [];
        try {
          parsedAmenities = typeof day.amenities === 'string' ? JSON.parse(day.amenities) : (day.amenities || []);
        } catch (e) {
          parsedAmenities = [];
        }
        return {
          ...day,
          amenities: parsedAmenities
        };
      }));

      const mapLayersRes = await fetch('/api/itinerary/map-layers');
      const layers = await mapLayersRes.json();
      setMapLayers(layers);

      const gearRes = await fetch('/api/gear');
      const gear = await gearRes.json();
      setGearCategories(gear);

      // Fetch settings
      const profilePicRes = await fetch('/api/settings/profile_picture');
      const profilePic = await profilePicRes.json();
      const heroBgRes = await fetch('/api/settings/hero_background');
      const heroBg = await heroBgRes.json();
      
      setSettings({
        profile_picture: profilePic.value,
        hero_background: heroBg.value
      });

      const aboutRes = await fetch('/api/about');
      const about = await aboutRes.json();
      setAboutData(about);

    } catch (e) {
      console.error('Failed to fetch data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: string, value: string) => {
    try {
        await fetch(`/api/settings/${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
        });
        setSettings({ ...settings, [key]: value });
    } catch (e) {
        console.error(`Failed to save setting ${key}`, e);
    }
  };

  const handleUpcomingChange = (field: string, value: any) => {
    setUpcomingData({ ...upcomingData, [field]: value });
  };

  const handleUpcomingSave = async () => {
    try {
      await fetch('/api/upcoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upcomingData),
      });
      alert('Saved successfully');
    } catch (e) {
      console.error('Failed to save', e);
      alert('Failed to save');
    }
  };

  const handlePastTripChange = (id: number, field: string, value: any) => {
    setPastTrips(pastTrips.map(trip => trip.id === id ? { ...trip, [field]: value } : trip));
  };

  const handlePastTripSave = async (trip: any) => {
    try {
      if (trip.id < 0) {
        // Create new
        const res = await fetch('/api/past-trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trip),
        });
        const data = await res.json();
        if (data.success) {
          setPastTrips(pastTrips.map(t => t.id === trip.id ? { ...t, id: data.id } : t));
          alert('Created successfully');
        }
      } else {
        // Update
        await fetch(`/api/past-trips/${trip.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trip),
        });
        alert('Updated successfully');
      }
    } catch (e) {
      console.error('Failed to save trip', e);
      alert('Failed to save trip');
    }
  };

  const handlePastTripDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      await fetch(`/api/past-trips/${id}`, { method: 'DELETE' });
      setPastTrips(pastTrips.filter(t => t.id !== id));
    } catch (e) {
      console.error('Failed to delete trip', e);
      alert('Failed to delete trip');
    }
  };

  const handleAddPastTrip = () => {
    setPastTrips([{
      id: -Date.now(), // Temporary ID
      name: 'New Trip',
      date: 'Date',
      location: 'Location',
      elevation: 'Elevation',
      image: '',
      description: 'Description',
      gallery: [],
      route_gpx: null,
      center_lat: 0,
      center_lng: 0,
      zoom: 10
    }, ...pastTrips]);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.urls[0];
    } catch (e) {
      console.error('Upload failed', e);
      alert('Upload failed');
      return null;
    }
  };

  const handleBulkUpload = async (files: FileList) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Bulk upload failed');
        const data = await res.json();
        return data.urls;
    } catch (e) {
        console.error('Bulk upload failed', e);
        alert('Bulk upload failed');
        return [];
    }
  };

  // Itinerary Handlers
  const handleItineraryChange = (id: number, field: string, value: any) => {
    setItineraryDays(itineraryDays.map(day => day.id === id ? { ...day, [field]: value } : day));
  };

  const handleAmenityChange = (dayId: number, amenity: string, isChecked: boolean) => {
    setItineraryDays(itineraryDays.map(day => {
      if (day.id === dayId) {
        const amSet = new Set(day.amenities || []);
        if (isChecked) amSet.add(amenity);
        else amSet.delete(amenity);
        return { ...day, amenities: Array.from(amSet) };
      }
      return day;
    }));
  };

  const handleItinerarySave = async (day: any) => {
    try {
      if (day.id < 0) {
        const res = await fetch('/api/itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(day),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (data.success) {
          setItineraryDays(itineraryDays.map(d => d.id === day.id ? { ...d, id: data.id } : d));
          alert('Saved day');
        }
      } else {
        const res = await fetch(`/api/itinerary/${day.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(day),
        });
        if (!res.ok) {
           throw new Error(await res.text());
        }
        alert('Updated day');
      }
    } catch (e: any) {
      console.error('Failed to save day', e);
      alert('Failed to save day: ' + e.message);
    }
  };

  const handleItineraryDelete = async (id: number) => {
    if (!confirm('Delete day?')) return;
    try {
      await fetch(`/api/itinerary/${id}`, { method: 'DELETE' });
      setItineraryDays(itineraryDays.filter(d => d.id !== id));
    } catch (e) {
      console.error('Failed to delete day', e);
    }
  };

  const handleAddDay = () => {
    setItineraryDays([...itineraryDays, {
      id: -Date.now(),
      day_number: itineraryDays.length + 1,
      title: 'New Day',
      description: '',
      km: '0km',
      elevation_gain: '0m',
      elevation_loss: '0m',
      shelter: '',
      amenities: [],
      difficulty: 'Moderate',
      komoot_link: '',
      gpx_url: '',
      color: '#ffffff'
    }]);
  };

  // Map Layer Handlers
  const handleAddMapGroup = async () => {
    const name = prompt('Layer Name (Legend Label):');
    if (!name) return;
    const name_hu = prompt('Layer Name (HU):');
    try {
      const res = await fetch('/api/itinerary/map-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, name_hu, color: '#ffffff' }),
      });
      const data = await res.json();
      if (data.success) {
        setMapLayers([...mapLayers, { id: data.id, name, name_hu, color: '#ffffff', files: [] }]);
      }
    } catch (e) {
      console.error('Failed to add map group', e);
    }
  };

  const handleUpdateMapGroup = async (id: number, field: string, value: string) => {
    const layer = mapLayers.find(l => l.id === id);
    if (!layer) return;
    
    const updatedLayer = { ...layer, [field]: value };
    setMapLayers(mapLayers.map(l => l.id === id ? updatedLayer : l)); // Optimistic update

    try {
      await fetch(`/api/itinerary/map-groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedLayer.name, name_hu: updatedLayer.name_hu, color: updatedLayer.color }),
      });
    } catch (e) {
      console.error('Failed to update map group', e);
    }
  };

  const handleAboutSave = async () => {
    try {
      await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });
      alert('About page saved successfully!');
    } catch (e) {
      console.error('Failed to save about page', e);
      alert('Failed to save about page');
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'group_photo_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setAboutData({ ...aboutData, [field]: data.urls[0] });
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    }
  };

  const handleDeleteMapGroup = async (id: number) => {
    if (!confirm('Delete this layer group and all its tracks?')) return;
    try {
      await fetch(`/api/itinerary/map-groups/${id}`, { method: 'DELETE' });
      setMapLayers(mapLayers.filter(l => l.id !== id));
    } catch (e) {
      console.error('Failed to delete map group', e);
    }
  };

  const handleAddMapFile = async (groupId: number, file: File) => {
    const url = await handleFileUpload(file);
    if (!url) return;

    try {
      const res = await fetch('/api/itinerary/map-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, file_url: url }),
      });
      const data = await res.json();
      if (data.success) {
        setMapLayers(mapLayers.map(l => 
          l.id === groupId ? { ...l, files: [...l.files, { id: data.id, group_id: groupId, file_url: url }] } : l
        ));
      }
    } catch (e) {
      console.error('Failed to add map file', e);
    }
  };

  const handleDeleteMapFile = async (groupId: number, fileId: number) => {
    try {
      await fetch(`/api/itinerary/map-files/${fileId}`, { method: 'DELETE' });
      setMapLayers(mapLayers.map(l => 
        l.id === groupId ? { ...l, files: l.files.filter((f: any) => f.id !== fileId) } : l
      ));
    } catch (e) {
      console.error('Failed to delete map file', e);
    }
  };

  // Gear Handlers
  const handleAddCategory = async () => {
    const name = prompt('Category Name:');
    if (!name) return;
    const name_hu = prompt('Category Name (HU):');
    try {
      const res = await fetch('/api/gear/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, name_hu }),
      });
      const data = await res.json();
      if (data.success) {
        setGearCategories([...gearCategories, { id: data.id, name, name_hu, items: [] }]);
      }
    } catch (e) {
      console.error('Failed to add category', e);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete category and all items?')) return;
    try {
      await fetch(`/api/gear/categories/${id}`, { method: 'DELETE' });
      setGearCategories(gearCategories.filter(c => c.id !== id));
    } catch (e) {
      console.error('Failed to delete category', e);
    }
  };

  const handleUpdateCategory = async (id: number, field: 'name' | 'name_hu', value: string) => {
    const updatedCategories = gearCategories.map(c => c.id === id ? { ...c, [field]: value } : c);
    setGearCategories(updatedCategories);
    const category = updatedCategories.find(c => c.id === id);
    if (!category) return;
    try {
      await fetch(`/api/gear/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category.name, name_hu: category.name_hu }),
      });
    } catch (e) {
      console.error('Failed to update category', e);
    }
  };

  const fetchGearData = async () => {
    try {
      const gearRes = await fetch('/api/gear');
      const gear = await gearRes.json();
      setGearCategories(gear);
    } catch (e) {
      console.error('Failed to fetch gear', e);
    }
  };

  const handleAddItem = async (categoryId: number, parentItemId?: number, isNote?: boolean) => {
    const name = prompt(isNote ? 'Note Text:' : (parentItemId ? 'Sub-Item Name:' : 'Item Name:'));
    if (!name) return;
    const name_hu = isNote ? '' : prompt(parentItemId ? 'Sub-Item Name (HU):' : 'Item Name (HU):');
    try {
      const res = await fetch('/api/gear/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: categoryId, name, name_hu, parent_item_id: parentItemId, is_note: isNote }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchGearData();
      }
    } catch (e) {
      console.error('Failed to add item', e);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await fetch(`/api/gear/items/${itemId}`, { method: 'DELETE' });
      await fetchGearData();
    } catch (e) {
      console.error('Failed to delete item', e);
    }
  };

  const handleUpdateItem = async (itemId: number, field: 'name' | 'name_hu', value: string) => {
    // Optimistic UI update could go here but it's nested deep, so we just mutate and fetch
    // Actually, we need the full item to put. So let's find it.
    let targetItem: any = null;
    gearCategories.forEach(c => {
      c.items.forEach((i: any) => {
        if (i.id === itemId) targetItem = i;
        i.sub_items?.forEach((si: any) => { if (si.id === itemId) targetItem = si; });
        i.notes?.forEach((ni: any) => { if (ni.id === itemId) targetItem = ni; });
      });
    });
    if (!targetItem) return;
    
    // Optimistic update for rapid typing
    setGearCategories([...gearCategories.map(c => ({
      ...c,
      items: c.items.map((i: any) => {
        if (i.id === itemId) return { ...i, [field]: value };
        return {
          ...i,
          sub_items: i.sub_items?.map((si: any) => si.id === itemId ? { ...si, [field]: value } : si),
          notes: i.notes?.map((ni: any) => ni.id === itemId ? { ...ni, [field]: value } : ni)
        };
      })
    }))]);

    try {
      await fetch(`/api/gear/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: field === 'name' ? value : targetItem.name, name_hu: field === 'name_hu' ? value : targetItem.name_hu }),
      });
    } catch (e) {
      console.error('Failed to update item', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] overflow-y-auto p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col relative">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-white/10 overflow-x-auto">
          {['upcoming', 'past', 'itinerary', 'map', 'gear', 'settings', 'about'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'text-purple-500 border-b-2 border-purple-500' : 'text-zinc-400 hover:text-white'}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="text-center text-zinc-400">Loading...</div>
          ) : activeTab === 'upcoming' && upcomingData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={upcomingData.title}
                    onChange={(e) => handleUpcomingChange('title', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Title (HU)</label>
                  <input
                    type="text"
                    value={upcomingData.title_hu || ''}
                    onChange={(e) => handleUpcomingChange('title_hu', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                  <textarea
                    value={upcomingData.description}
                    onChange={(e) => handleUpcomingChange('description', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Description (HU)</label>
                  <textarea
                    value={upcomingData.description_hu || ''}
                    onChange={(e) => handleUpcomingChange('description_hu', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Elevation</label>
                  <input
                    type="text"
                    value={upcomingData.elevation}
                    onChange={(e) => handleUpcomingChange('elevation', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Elevation (HU)</label>
                  <input
                    type="text"
                    value={upcomingData.elevation_hu || ''}
                    onChange={(e) => handleUpcomingChange('elevation_hu', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Distance</label>
                  <input
                    type="text"
                    value={upcomingData.distance}
                    onChange={(e) => handleUpcomingChange('distance', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Distance (HU)</label>
                  <input
                    type="text"
                    value={upcomingData.distance_hu || ''}
                    onChange={(e) => handleUpcomingChange('distance_hu', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={upcomingData.duration}
                    onChange={(e) => handleUpcomingChange('duration', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Duration (HU)</label>
                  <input
                    type="text"
                    value={upcomingData.duration_hu || ''}
                    onChange={(e) => handleUpcomingChange('duration_hu', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Shelter</label>
                  <input
                    type="text"
                    value={upcomingData.shelter}
                    onChange={(e) => handleUpcomingChange('shelter', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Shelter (HU)</label>
                  <input
                    type="text"
                    value={upcomingData.shelter_hu || ''}
                    onChange={(e) => handleUpcomingChange('shelter_hu', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Region</label>
                  <input
                    type="text"
                    value={upcomingData.region}
                    onChange={(e) => handleUpcomingChange('region', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Region (HU)</label>
                  <input
                    type="text"
                    value={upcomingData.region_hu || ''}
                    onChange={(e) => handleUpcomingChange('region_hu', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Highlights (JSON Array)</label>
                  <input
                    type="text"
                    value={JSON.stringify(upcomingData.highlights)}
                    onChange={(e) => {
                      try {
                        handleUpcomingChange('highlights', JSON.parse(e.target.value));
                      } catch (err) {
                        // ignore parse error while typing
                      }
                    }}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Highlights (HU) (JSON Array)</label>
                  <input
                    type="text"
                    value={JSON.stringify(upcomingData.highlights_hu || [])}
                    onChange={(e) => {
                      try {
                        handleUpcomingChange('highlights_hu', JSON.parse(e.target.value));
                      } catch (err) {
                        // ignore parse error while typing
                      }
                    }}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">GPX File</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".gpx"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await handleFileUpload(e.target.files[0]);
                          if (url) handleUpcomingChange('route_gpx', url);
                        }
                      }}
                      className="text-white text-sm"
                    />
                    {upcomingData.route_gpx && <span className="text-green-500 text-xs">Uploaded</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={handleUpcomingSave}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : activeTab === 'past' ? (
            <div className="space-y-8">
              <button
                onClick={handleAddPastTrip}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} /> Add New Trip
              </button>
              
              {pastTrips.map((trip) => (
                <div key={trip.id} className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{trip.name}</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePastTripSave(trip)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                            <Save size={12} />
                        </button>
                        <button
                            onClick={() => handlePastTripDelete(trip.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        >
                            <Trash size={12} />
                        </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={trip.name}
                      onChange={(e) => handlePastTripChange(trip.id, 'name', e.target.value)}
                      placeholder="Name"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={trip.name_hu || ''}
                      onChange={(e) => handlePastTripChange(trip.id, 'name_hu', e.target.value)}
                      placeholder="Name (HU)"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={trip.date}
                      onChange={(e) => handlePastTripChange(trip.id, 'date', e.target.value)}
                      placeholder="Date"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={trip.date_hu || ''}
                      onChange={(e) => handlePastTripChange(trip.id, 'date_hu', e.target.value)}
                      placeholder="Date (HU)"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={trip.elevation}
                      onChange={(e) => handlePastTripChange(trip.id, 'elevation', e.target.value)}
                      placeholder="Elevation"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={trip.elevation_hu || ''}
                      onChange={(e) => handlePastTripChange(trip.id, 'elevation_hu', e.target.value)}
                      placeholder="Elevation (HU)"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={trip.location}
                      onChange={(e) => handlePastTripChange(trip.id, 'location', e.target.value)}
                      placeholder="Location"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      value={trip.location_hu || ''}
                      onChange={(e) => handlePastTripChange(trip.id, 'location_hu', e.target.value)}
                      placeholder="Location (HU)"
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    />
                    <div className="col-span-2">
                      <textarea
                        value={trip.description}
                        onChange={(e) => handlePastTripChange(trip.id, 'description', e.target.value)}
                        placeholder="Description"
                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm h-20"
                      />
                    </div>
                    <div className="col-span-2">
                      <textarea
                        value={trip.description_hu || ''}
                        onChange={(e) => handlePastTripChange(trip.id, 'description_hu', e.target.value)}
                        placeholder="Description (HU)"
                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm h-20"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-zinc-400 mb-1">Main Image</label>
                      <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={trip.image}
                            onChange={(e) => handlePastTripChange(trip.id, 'image', e.target.value)}
                            placeholder="Image URL"
                            className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const url = await handleFileUpload(e.target.files[0]);
                                    if (url) handlePastTripChange(trip.id, 'image', url);
                                }
                            }}
                            className="text-xs text-zinc-400 w-24"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-zinc-400 mb-1">GPX File</label>
                      <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={trip.route_gpx || ''}
                            onChange={(e) => handlePastTripChange(trip.id, 'route_gpx', e.target.value)}
                            placeholder="GPX URL"
                            className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                        />
                        <input
                            type="file"
                            accept=".gpx"
                            onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const url = await handleFileUpload(e.target.files[0]);
                                    if (url) handlePastTripChange(trip.id, 'route_gpx', url);
                                }
                            }}
                            className="text-xs text-zinc-400 w-24"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs text-zinc-400 mb-1">Gallery Images (Bulk Upload)</label>
                        <div className="flex gap-2 items-center mb-2">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const urls = await handleBulkUpload(e.target.files);
                                        if (urls.length > 0) {
                                            const currentGallery = trip.gallery || [];
                                            handlePastTripChange(trip.id, 'gallery', [...currentGallery, ...urls]);
                                        }
                                    }
                                }}
                                className="text-xs text-zinc-400"
                            />
                        </div>
                        <textarea
                            value={trip.gallery?.join('\n')}
                            onChange={(e) => handlePastTripChange(trip.id, 'gallery', e.target.value.split('\n'))}
                            placeholder="Gallery URLs (one per line)"
                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm h-20 font-mono"
                        />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'itinerary' ? (
            <div className="space-y-8">
              <button
                onClick={handleAddDay}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} /> Add Day
              </button>
              
              {itineraryDays.map((day) => (
                <div key={day.id} className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Day {day.day_number}: {day.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => handleItinerarySave(day)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"><Save size={12} /></button>
                      <button onClick={() => handleItineraryDelete(day.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"><Trash size={12} /></button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="number" value={day.day_number} onChange={(e) => handleItineraryChange(day.id, 'day_number', parseInt(e.target.value))} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Day #" />
                    <input type="text" value={day.title} onChange={(e) => handleItineraryChange(day.id, 'title', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Title" />
                    <input type="text" value={day.title_hu || ''} onChange={(e) => handleItineraryChange(day.id, 'title_hu', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Title (HU)" />
                    
                    <textarea value={day.description} onChange={(e) => handleItineraryChange(day.id, 'description', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm col-span-3 h-20" placeholder="Description" />
                    <textarea value={day.description_hu || ''} onChange={(e) => handleItineraryChange(day.id, 'description_hu', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm col-span-3 h-20" placeholder="Description (HU)" />
                    
                    <input type="text" value={day.km} onChange={(e) => handleItineraryChange(day.id, 'km', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Distance (e.g. 10km)" />
                    <input type="text" value={day.km_hu || ''} onChange={(e) => handleItineraryChange(day.id, 'km_hu', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Distance (HU)" />
                    <input type="text" value={day.elevation_gain} onChange={(e) => handleItineraryChange(day.id, 'elevation_gain', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Gain (e.g. 1000m)" />
                    <input type="text" value={day.elevation_gain_hu || ''} onChange={(e) => handleItineraryChange(day.id, 'elevation_gain_hu', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Gain (HU)" />
                    <input type="text" value={day.elevation_loss} onChange={(e) => handleItineraryChange(day.id, 'elevation_loss', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Loss (e.g. 500m)" />
                    <input type="text" value={day.elevation_loss_hu || ''} onChange={(e) => handleItineraryChange(day.id, 'elevation_loss_hu', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Loss (HU)" />
                    
                    <input type="text" value={day.shelter} onChange={(e) => handleItineraryChange(day.id, 'shelter', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Shelter" />
                    <input type="text" value={day.shelter_hu || ''} onChange={(e) => handleItineraryChange(day.id, 'shelter_hu', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Shelter (HU)" />
                    <input type="text" value={day.difficulty} onChange={(e) => handleItineraryChange(day.id, 'difficulty', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Difficulty" />
                    <input type="text" value={day.difficulty_hu || ''} onChange={(e) => handleItineraryChange(day.id, 'difficulty_hu', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Difficulty (HU)" />
                    <input type="color" value={day.color} onChange={(e) => handleItineraryChange(day.id, 'color', e.target.value)} className="bg-black/50 border border-white/10 rounded h-10 w-full" title="Route Color" />

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-zinc-400">
                        <input type="checkbox" checked={day.amenities?.includes('water') || false} onChange={(e) => handleAmenityChange(day.id, 'water', e.target.checked)} /> Water
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-400">
                        <input type="checkbox" checked={day.amenities?.includes('food') || false} onChange={(e) => handleAmenityChange(day.id, 'food', e.target.checked)} /> Food
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-400">
                        <input type="checkbox" checked={day.amenities?.includes('store') || false} onChange={(e) => handleAmenityChange(day.id, 'store', e.target.checked)} /> Store
                      </label>
                    </div>

                    <input type="text" value={day.komoot_link} onChange={(e) => handleItineraryChange(day.id, 'komoot_link', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm col-span-2" placeholder="Komoot Link" />
                    
                    <div className="col-span-3 flex gap-2 items-center">
                        <input type="text" value={day.gpx_url} onChange={(e) => handleItineraryChange(day.id, 'gpx_url', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="GPX URL" />
                        <input type="file" accept=".gpx" onChange={async (e) => {
                            if (e.target.files?.[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                if (url) handleItineraryChange(day.id, 'gpx_url', url);
                            }
                        }} className="text-xs text-zinc-400 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'map' ? (
            <div className="space-y-8">
              <button onClick={handleAddMapGroup} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus size={16} /> Add Map Layer
              </button>
              
              <div className="space-y-6">
                {mapLayers.map((layer) => (
                  <div key={layer.id} className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1 flex gap-4">
                        <input 
                          type="text" 
                          value={layer.name} 
                          onChange={(e) => handleUpdateMapGroup(layer.id, 'name', e.target.value)} 
                          className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm flex-1" 
                          placeholder="Layer Name"
                        />
                        <input 
                          type="text" 
                          value={layer.name_hu || ''} 
                          onChange={(e) => handleUpdateMapGroup(layer.id, 'name_hu', e.target.value)} 
                          className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm flex-1" 
                          placeholder="Layer Name (HU)"
                        />
                        <input 
                          type="color" 
                          value={layer.color} 
                          onChange={(e) => handleUpdateMapGroup(layer.id, 'color', e.target.value)} 
                          className="bg-black/50 border border-white/10 rounded h-10 w-16" 
                          title="Layer Color" 
                        />
                      </div>
                      <button onClick={() => handleDeleteMapGroup(layer.id)} className="text-red-500 hover:text-red-400"><Trash size={16} /></button>
                    </div>
                    
                    <div className="bg-black/20 rounded-lg p-4">
                      <h4 className="text-xs text-zinc-400 uppercase tracking-wider mb-3">GPX Tracks</h4>
                      <ul className="space-y-2 mb-4">
                        {layer.files.map((file: any) => (
                          <li key={file.id} className="flex justify-between items-center bg-black/50 px-3 py-2 rounded text-sm text-zinc-300">
                            <span className="truncate max-w-[200px]">{file.file_url.split('/').pop()}</span>
                            <div className="flex items-center gap-2">
                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs">View</a>
                                <button onClick={() => handleDeleteMapFile(layer.id, file.id)} className="text-zinc-500 hover:text-red-500"><X size={14} /></button>
                            </div>
                          </li>
                        ))}
                        {layer.files.length === 0 && <li className="text-zinc-500 text-xs italic">No tracks uploaded</li>}
                      </ul>
                      
                      <div className="flex items-center gap-2">
                         <input
                            type="file"
                            accept=".gpx"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleAddMapFile(layer.id, e.target.files[0]);
                                    e.target.value = ''; // Reset input
                                }
                            }}
                            className="text-xs text-zinc-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            <div className="space-y-8">
                <h3 className="text-xl font-bold text-white">Site Settings</h3>
                
                <div className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 className="text-lg font-bold text-white">Hero Background</h4>
                    <div className="flex gap-4 items-start">
                        {settings.hero_background && (
                            <img src={settings.hero_background} alt="Hero" className="w-32 h-20 object-cover rounded" />
                        )}
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                value={settings.hero_background || ''}
                                onChange={(e) => handleSettingChange('hero_background', e.target.value)}
                                placeholder="Image URL"
                                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleFileUpload(e.target.files[0]);
                                        if (url) handleSettingChange('hero_background', url);
                                    }
                                }}
                                className="text-sm text-zinc-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 className="text-lg font-bold text-white">Profile Picture</h4>
                    <div className="flex gap-4 items-start">
                        {settings.profile_picture && (
                            <img src={settings.profile_picture} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
                        )}
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                value={settings.profile_picture || ''}
                                onChange={(e) => handleSettingChange('profile_picture', e.target.value)}
                                placeholder="Image URL"
                                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleFileUpload(e.target.files[0]);
                                        if (url) handleSettingChange('profile_picture', url);
                                    }
                                }}
                                className="text-sm text-zinc-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
          ) : activeTab === 'about' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">About Page Content</h3>
                <button onClick={handleAboutSave} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Save size={16} /> Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-black/30 border border-white/5 p-6 rounded-xl">
                  <h4 className="font-bold text-white">Description</h4>
                  <textarea value={aboutData.description || ''} onChange={e => setAboutData({...aboutData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="English Description" />
                  <textarea value={aboutData.description_hu || ''} onChange={e => setAboutData({...aboutData, description_hu: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="Hungarian Description" />
                </div>

                <div className="space-y-4 bg-black/30 border border-white/5 p-6 rounded-xl">
                  <h4 className="font-bold text-white">Vision</h4>
                  <textarea value={aboutData.vision || ''} onChange={e => setAboutData({...aboutData, vision: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="English Vision" />
                  <textarea value={aboutData.vision_hu || ''} onChange={e => setAboutData({...aboutData, vision_hu: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="Hungarian Vision" />
                </div>

                <div className="space-y-4 bg-black/30 border border-white/5 p-6 rounded-xl">
                  <h4 className="font-bold text-white">Community</h4>
                  <textarea value={aboutData.community || ''} onChange={e => setAboutData({...aboutData, community: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="English Community" />
                  <textarea value={aboutData.community_hu || ''} onChange={e => setAboutData({...aboutData, community_hu: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="Hungarian Community" />
                </div>

                <div className="space-y-4 bg-black/30 border border-white/5 p-6 rounded-xl">
                  <h4 className="font-bold text-white">How to Join</h4>
                  <textarea value={aboutData.how_to_join || ''} onChange={e => setAboutData({...aboutData, how_to_join: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="English How to Join" />
                  <textarea value={aboutData.how_to_join_hu || ''} onChange={e => setAboutData({...aboutData, how_to_join_hu: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white h-32" placeholder="Hungarian How to Join" />
                </div>

                <div className="space-y-4 bg-black/30 border border-white/5 p-6 rounded-xl">
                  <h4 className="font-bold text-white">Images</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Logo</label>
                      {aboutData.logo_url && <img src={aboutData.logo_url} alt="Logo" className="h-16 object-contain mb-2" />}
                      <input type="file" accept="image/png" onChange={e => handleAboutImageUpload(e, 'logo_url')} className="text-sm text-zinc-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Group Photo</label>
                      {aboutData.group_photo_url && <img src={aboutData.group_photo_url} alt="Group" className="h-32 object-cover rounded mb-2" />}
                      <input type="file" accept="image/*" onChange={e => handleAboutImageUpload(e, 'group_photo_url')} className="text-sm text-zinc-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <button onClick={handleAddCategory} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus size={16} /> Add Category
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gearCategories.map((category) => (
                  <div key={category.id} className="bg-black/30 border border-white/5 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4 gap-2">
                      <div className="flex-1 flex gap-2">
                        <input type="text" value={category.name} onChange={e => handleUpdateCategory(category.id, 'name', e.target.value)} className="bg-transparent border-b border-white/10 text-white font-bold w-full focus:outline-none focus:border-purple-500" placeholder="Category Name" />
                        <input type="text" value={category.name_hu || ''} onChange={e => handleUpdateCategory(category.id, 'name_hu', e.target.value)} className="bg-transparent border-b border-white/10 text-zinc-400 text-sm w-full focus:outline-none focus:border-purple-500" placeholder="Category Name (HU)" />
                      </div>
                      <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-400"><Trash size={16} /></button>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {category.items.map((item: any) => (
                        <li key={item.id} className="flex flex-col bg-black/50 p-3 rounded text-sm text-zinc-300 gap-2">
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex-1 flex gap-2">
                              <input type="text" value={item.name} onChange={e => handleUpdateItem(item.id, 'name', e.target.value)} className="bg-transparent border-b border-white/10 w-full focus:outline-none focus:border-purple-500" placeholder="Item Name" />
                              <input type="text" value={item.name_hu || ''} onChange={e => handleUpdateItem(item.id, 'name_hu', e.target.value)} className="bg-transparent border-b border-white/10 text-zinc-500 w-full focus:outline-none focus:border-purple-500" placeholder="Item Name (HU)" />
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleAddItem(category.id, item.id, false)} title="Add Sub-Item" className="text-zinc-500 hover:text-green-500 font-bold">+</button>
                              <button onClick={() => handleAddItem(category.id, item.id, true)} title="Add Note" className="text-zinc-500 hover:text-yellow-500 font-bold">N</button>
                              <button onClick={() => handleDeleteItem(item.id)} className="text-zinc-500 hover:text-red-500"><X size={14} /></button>
                            </div>
                          </div>
                          
                          {/* Sub Items */}
                          {(item.sub_items?.length > 0 || item.notes?.length > 0) && (
                            <div className="pl-4 border-l border-white/10 space-y-2 mt-2">
                              {item.sub_items?.map((sub: any) => (
                                <div key={sub.id} className="flex justify-between items-center bg-black/30 px-2 py-1 rounded gap-2">
                                  <div className="flex-1 flex gap-2">
                                    <input type="text" value={sub.name} onChange={e => handleUpdateItem(sub.id, 'name', e.target.value)} className="bg-transparent border-b border-white/10 w-full focus:outline-none focus:border-purple-500" placeholder="Sub-Item Name" />
                                    <input type="text" value={sub.name_hu || ''} onChange={e => handleUpdateItem(sub.id, 'name_hu', e.target.value)} className="bg-transparent border-b border-white/10 text-zinc-500 w-full focus:outline-none focus:border-purple-500" placeholder="Sub-Item Name (HU)" />
                                  </div>
                                  <button onClick={() => handleDeleteItem(sub.id)} className="text-zinc-500 hover:text-red-500"><X size={12} /></button>
                                </div>
                              ))}
                              {item.notes?.map((note: any) => (
                                <div key={note.id} className="flex justify-between items-center bg-zinc-900/50 px-2 py-1 rounded gap-2 text-zinc-500">
                                  <span className="font-mono text-xs">//</span>
                                  <div className="flex-1 flex gap-2">
                                    <input type="text" value={note.name} onChange={e => handleUpdateItem(note.id, 'name', e.target.value)} className="bg-transparent border-b border-white/5 w-full focus:outline-none focus:border-yellow-500/50 text-zinc-400" placeholder="Note text" />
                                  </div>
                                  <button onClick={() => handleDeleteItem(note.id)} className="text-zinc-500 hover:text-red-500"><X size={12} /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    
                    <button onClick={() => handleAddItem(category.id)} className="w-full py-2 border border-white/10 rounded hover:bg-white/5 text-xs text-zinc-400">
                      + Add Item
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
