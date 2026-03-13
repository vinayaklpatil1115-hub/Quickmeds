'use client';
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Phone, 
  Clock, 
  Star, 
  ChevronRight, 
  Info,
  Map as MapIcon,
  Layers,
  Zap,
  CheckCircle2,
  Car
} from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{ "weight": "2.00" }]
    },
    {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#9c9c9c" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [{ "visibility": "on" }]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{ "color": "#f2f2f2" }]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#7b7b7b" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#c8d7d4" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#070707" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#ffffff" }]
    }
  ]
};

export default function PharmacyMapPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [hoveredPharmacy, setHoveredPharmacy] = useState(null);
  const [closestPharmacy, setClosestPharmacy] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/pharmacies/nearby`);
        setPharmacies(data);
        if (data.length > 0) {
            setSelectedPharmacy(data[0]);
            // Calculate distances and find closest
            let minDistance = Infinity;
            let closest = data[0];
            data.forEach(p => {
                const dist = Math.sqrt(
                    Math.pow(p.location.coordinates[1] - userLocation.lat, 2) + 
                    Math.pow(p.location.coordinates[0] - userLocation.lng, 2)
                );
                if (dist < minDistance) {
                    minDistance = dist;
                    closest = p;
                }
            });
            setClosestPharmacy(closest);
        }
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacies();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Geolocation failed or denied")
      );
    }
  }, []);

  const filteredPharmacies = pharmacies.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-slate-50 mt-20">
        
        {/* Sidebar: Pharmacy List */}
        <div className="w-full lg:w-[450px] flex flex-col space-y-8 h-full bg-white border-r border-slate-100 p-8 shadow-2xl z-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20 shadow-sm">
                <MapPin className="h-3.5 w-3.5 fill-secondary" /> {filteredPharmacies.length} Stores in Pune
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight">Nearby <span className="text-primary">Pharmacies</span></h1>
            
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-2 pr-4 shadow-sm focus-within:bg-white focus-within:shadow-xl transition-all">
                    <Search className="h-5 w-5 text-slate-400 ml-4 mr-3 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by area or name..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-50 rounded-[32px] animate-pulse"></div>
              ))
            ) : (
              filteredPharmacies.map((pharmacy) => (
                <motion.div 
                  key={pharmacy._id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  onMouseEnter={() => setHoveredPharmacy(pharmacy)}
                  onMouseLeave={() => setHoveredPharmacy(null)}
                  className={`p-6 rounded-[32px] border transition-all cursor-pointer group relative ${selectedPharmacy?._id === pharmacy._id ? 'bg-slate-900 border-slate-900 shadow-2xl shadow-slate-200' : 'bg-white border-slate-100 hover:border-primary/30 shadow-sm'}`}
                >
                  {closestPharmacy?._id === pharmacy._id && (
                    <div className="absolute -top-3 left-8 bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg z-10">
                        Closest to You
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h3 className={`font-black text-lg ${selectedPharmacy?._id === pharmacy._id ? 'text-white' : 'text-slate-900 group-hover:text-primary'}`}>{pharmacy.name}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedPharmacy?._id === pharmacy._id ? 'text-slate-400' : 'text-slate-400'}`}>{pharmacy.address}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${selectedPharmacy?._id === pharmacy._id ? 'bg-white/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-[10px] font-black">{pharmacy.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50/10">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPharmacy?._id === pharmacy._id ? 'text-primary' : 'text-slate-400'}`}>
                        {selectedPharmacy?._id === pharmacy._id ? 'Selected' : 'View Details'}
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${selectedPharmacy?._id === pharmacy._id ? 'text-white' : 'text-slate-300'}`} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Main: Map View */}
        <div className="flex-1 relative bg-slate-100">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedPharmacy ? { lat: selectedPharmacy.location.coordinates[1], lng: selectedPharmacy.location.coordinates[0] } : userLocation}
              zoom={14}
              options={mapOptions}
            >
              {/* User Marker */}
              <Marker
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#0EA5E9',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: 8
                }}
              />

              {/* Pharmacy Markers */}
              {filteredPharmacies.map(pharmacy => (
                <Marker
                  key={pharmacy._id}
                  position={{ lat: pharmacy.location.coordinates[1], lng: pharmacy.location.coordinates[0] }}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  onMouseOver={() => setHoveredPharmacy(pharmacy)}
                  onMouseOut={() => setHoveredPharmacy(null)}
                  icon={{
                    url: selectedPharmacy?._id === pharmacy._id ? '/images/marker-active.png' : '/images/marker-inactive.png',
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 40)
                  }}
                  label={hoveredPharmacy?._id === pharmacy._id ? {
                    text: pharmacy.name,
                    className: 'map-badge-hover', // We'll add this CSS to globals.css
                  } : null}
                />
              ))}

              {/* Path to selected or hovered pharmacy */}
              {(selectedPharmacy || hoveredPharmacy) && (
                <Polyline
                  path={[
                    userLocation,
                    { 
                      lat: (hoveredPharmacy || selectedPharmacy).location.coordinates[1], 
                      lng: (hoveredPharmacy || selectedPharmacy).location.coordinates[0] 
                    }
                  ]}
                  options={{
                    strokeColor: '#22C55E',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    icons: [{
                      icon: {
                        path: 'M23.5 17h-1.5v-2h1.5c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5h-1.5v-2h1.5c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5h-1.5v-2c0-1.1-.9-2-2-2h-13c-1.1 0-2 .9-2 2v2h-1.5c-.3 0-.5.2-.5.5v1c0 .3.2.5.5.5h1.5v2h-1.5c-.3 0-.5.2-.5.5v1c0 .3.2.5.5.5h1.5v2h-1.5c-.3 0-.5.2-.5.5v1c0 .3.2.5.5.5h1.5v2c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-2zm-16-10c0-.6.4-1 1-1h8c.6 0 1 .4 1 1v2h-10v-2zm10 12h-10c-.6 0-1-.4-1-1v-2h12v2c0 .6-.4 1-1 1z',
                        fillColor: '#22C55E',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: '#FFFFFF',
                        scale: 1,
                        rotation: 0
                      },
                      offset: '50%',
                      repeat: '100px'
                    }]
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Interactive Map...</p>
               </div>
            </div>
          )}
          
          {/* Map Overlay Info */}
          <AnimatePresence>
            {selectedPharmacy && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-30"
                >
                    <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <MapPin className="h-32 w-32" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-2">
                                    <div className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full border border-green-100 w-fit uppercase tracking-widest">
                                        Open Now
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 leading-none">{selectedPharmacy.name}</h2>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{selectedPharmacy.address}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Store Rating</p>
                                    <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 px-3 py-1.5 rounded-2xl w-fit ml-auto">
                                        <Star className="h-4 w-4 fill-yellow-500" />
                                        <span className="text-sm font-black">{selectedPharmacy.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Distance</p>
                                    <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                                        <Navigation className="h-4 w-4 text-primary" /> 
                                        {(() => {
                                            const dist = Math.sqrt(
                                                Math.pow(selectedPharmacy.location.coordinates[1] - userLocation.lat, 2) + 
                                                Math.pow(selectedPharmacy.location.coordinates[0] - userLocation.lng, 2)
                                            ) * 111; // Approx 111km per degree
                                            return `${dist.toFixed(1)} km away`;
                                        })()}
                                    </p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Contact</p>
                                    <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-secondary" /> {selectedPharmacy.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link 
                                    href={`/pharmacy/${selectedPharmacy._id}`}
                                    className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm hover:bg-primary transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
                                >
                                    Visit Store <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a 
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPharmacy.location.coordinates[1]},${selectedPharmacy.location.coordinates[0]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-16 h-16 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center shadow-lg shadow-slate-100"
                                >
                                    <Car className="h-6 w-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-12 left-12 bg-white/80 backdrop-blur-xl border border-white rounded-[24px] px-6 py-4 shadow-2xl flex items-center gap-4 z-10">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Location</p>
                <p className="text-sm font-black text-slate-900">Pune, Maharashtra</p>
            </div>
          </div>
        </div>
    </div>
  );
}
