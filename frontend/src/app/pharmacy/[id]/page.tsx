'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowLeft, 
  ShieldCheck, 
  Pill,
  Search,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export default function PharmacyDetailsPage() {
  const { id } = useParams();
  const [pharmacy, setPharmacy] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { userInfo } = useAuthStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchPharmacy = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/pharmacies/${id}`);
        setPharmacy(data.pharmacy);
        setInventory(data.inventory);
      } catch (error) {
        console.error('Error fetching pharmacy details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacy();
  }, [id]);

  const filteredInventory = inventory.filter(item => 
    item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!pharmacy) return (
    <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-slate-900">Pharmacy not found</h1>
        <Link href="/top-pharmacies" className="text-red-600 mt-4 inline-block font-bold underline">Back to top pharmacies</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 mt-16 max-w-7xl">
      <Link href="/top-pharmacies" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-red-600 transition-colors mb-12 group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to stores
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Store Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm sticky top-32">
            <div className="space-y-6">
              <div>
                <div className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-full w-fit mb-4 border border-red-100 uppercase tracking-widest">
                  Verified Partner
                </div>
                <h1 className="text-4xl font-black text-slate-900 leading-tight">{pharmacy.name}</h1>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-xl">
                    <Star className="h-4 w-4 fill-yellow-500 mr-1.5" />
                    <span className="text-sm font-black">{pharmacy.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">({pharmacy.numReviews} Reviews)</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-start gap-4 text-slate-500">
                  <MapPin className="h-5 w-5 text-red-600 mt-1 shrink-0" />
                  <span className="text-sm font-medium leading-relaxed">{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <Phone className="h-5 w-5 text-red-600 shrink-0" />
                  <span className="text-sm font-bold">{pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <Clock className="h-5 w-5 text-red-600 shrink-0" />
                  <span className="text-sm font-medium">Open: 09:00 AM - 10:00 PM</span>
                </div>
              </div>

              <div className="pt-8">
                <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-green-800 uppercase tracking-wider">Stock Guaranteed</p>
                    <p className="text-[11px] text-green-700/70 mt-1 leading-relaxed">This store updates its inventory every 30 minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Inventory Search & List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 whitespace-nowrap">
                <Pill className="h-6 w-6 text-red-600" /> Available Medicines
              </h2>
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search in this store..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                <Pill className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No medicines found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInventory.map((item) => (
                  <motion.div 
                    key={item._id}
                    layout
                    className="bg-white border border-slate-100 rounded-[32px] p-6 hover:shadow-xl hover:border-red-100 transition-all flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3 shrink-0">
                        <img src={item.medicine.image} alt={item.medicine.name} className="max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-0.5">{item.medicine.category}</p>
                        <h3 className="text-base font-black text-slate-900 truncate">{item.medicine.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{item.medicine.brand}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                        <p className="text-xl font-black text-slate-900">₹{item.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/medicine/${item.medicine._id}`}
                          className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => userInfo && addItem(userInfo.token, item.medicine._id, pharmacy._id, 1)}
                          className="px-5 h-10 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
