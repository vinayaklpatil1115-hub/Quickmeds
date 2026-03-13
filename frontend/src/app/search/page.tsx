'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Search as SearchIcon, Filter, MapPin, Clock, Star, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    category: 'All',
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/medicines?keyword=${query}`);
        setMedicines(data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, [query]);

  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
            Search <span className="text-primary">Medicines</span> Across Verified Stores
          </h1>
          <p className="text-slate-500 font-medium">Find the best prices and guaranteed availability in Pune.</p>
        </div>
        <div className="w-full max-w-lg">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[32px] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative flex items-center bg-white border border-slate-100 rounded-[32px] p-2 pr-6 shadow-xl">
                <SearchIcon className="h-6 w-6 text-slate-400 ml-6 mr-4" />
                <input 
                    type="text" 
                    placeholder="Search medicine, symptoms, brands..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none text-base font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs hover:bg-primary transition-all shadow-lg shadow-slate-200 uppercase tracking-widest">
                   Find Now
                </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Filters Sidebar */}
        <div className="md:col-span-1 space-y-10">
          <div className="bg-white border border-slate-50 rounded-[40px] p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" /> Refine Results
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By</p>
                <div className="grid grid-cols-1 gap-2">
                    {['Relevance', 'Price: Low to High', 'Rating'].map(sort => (
                        <button key={sort} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-white hover:border-primary/30 border border-transparent rounded-xl text-sm font-bold text-slate-600 transition-all">
                            {sort}
                        </button>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Range</p>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  className="w-full accent-primary" 
                  onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400">
                    <span>₹0</span>
                    <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-slate-50 animate-pulse rounded-[40px]"></div>
              ))}
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-20 bg-secondary/10 rounded-[40px] border border-dashed border-border">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold">No medicines found</h2>
                <p className="text-muted-foreground mt-2">Try searching with different keywords or symptoms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {medicines.map((med, idx) => (
                <MedicineCard key={med._id} medicine={med} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MedicineCard({ medicine, idx }) {
   return (
     <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ delay: idx * 0.05 }}
       className="group bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all relative flex flex-col h-full"
     >
       <Link href={`/medicine/${medicine._id}`} className="flex-1 flex flex-col">
         <div className="w-full aspect-square bg-slate-50 rounded-[32px] mb-6 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
           <img 
             src={medicine.image || '/images/sample-medicine.jpg'} 
             alt={medicine.name}
             className="max-h-full object-contain drop-shadow-xl"
           />
           {medicine.discount > 0 && (
             <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
               {medicine.discount}% OFF
             </div>
           )}
         </div>
 
         <div className="flex-1 space-y-3">
           <div>
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{medicine.category}</p>
             <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{medicine.name}</h3>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{medicine.brand} • {medicine.genericName}</p>
           </div>
 
           <div className="space-y-2 pt-4 border-t border-slate-50 mt-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <MapPin className="h-3 w-3 text-secondary" /> Omkar Medical
                 </div>
                 <div className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${medicine.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {medicine.stock > 0 ? 'In Stock' : 'Out of Stock'}
                 </div>
              </div>

             <div className="flex items-center justify-between">
               <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                   <div className="flex items-baseline gap-2">
                       <p className="text-2xl font-black text-slate-900">₹{medicine.price || (medicine.mrp * 0.9).toFixed(0)}</p>
                       {medicine.discount > 0 && <p className="text-xs text-slate-400 line-through">₹{medicine.mrp}</p>}
                   </div>
               </div>
               <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all shadow-lg shadow-slate-100">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
               </div>
             </div>
           </div>
         </div>
       </Link>
     </motion.div>
   );
 }
