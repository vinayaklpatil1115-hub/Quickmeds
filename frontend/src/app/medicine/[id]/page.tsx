'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { 
  ShoppingCart, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  Star, 
  CheckCircle, 
  TrendingUp, 
  History,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function MedicineDetailsPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [recommendations, setRecommendations] = useState({ genericAlternatives: [], similarMedicines: [] });
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [medRes, invRes, recRes, historyRes] = await Promise.all([
          api.get(`/medicines/${id}`),
          api.get(`/medicines/${id}/inventory`),
          api.get(`/medicines/${id}/recommended`),
          api.get(`/medicines/${id}/history`)
        ]);
        setMedicine(medRes.data);
        setInventory(invRes.data);
        setRecommendations(recRes.data);
        setPriceHistory(historyRes.data);
      } catch (error) {
        console.error('Error fetching medicine details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!medicine) return (
    <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Medicine not found</h1>
        <Link href="/search" className="text-primary mt-4 inline-block underline">Back to search</Link>
    </div>
  );

  // Sample data for price history
  const priceHistoryData = [
    { name: 'Jan', price: medicine.mrp * 0.95 },
    { name: 'Feb', price: medicine.mrp * 0.92 },
    { name: 'Mar', price: medicine.mrp * 0.9 },
    { name: 'Apr', price: medicine.mrp * 0.88 },
    { name: 'May', price: medicine.mrp * 0.92 },
    { name: 'Jun', price: medicine.mrp * 0.9 }
  ];

  return (
    <div className="container mx-auto px-4 py-12 mt-16 max-w-7xl">
      <Link href="/search" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Image & Info */}
        <div className="space-y-8">
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="aspect-square bg-secondary/20 rounded-3xl overflow-hidden p-8 border border-border flex items-center justify-center"
          >
            <img 
              src={medicine.image || '/images/sample-medicine.jpg'} 
              alt={medicine.name}
              className="max-h-full object-contain hover:scale-110 transition-transform duration-500"
            />
          </motion.div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" /> Product Information
            </h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                    <span className="text-muted-foreground block mb-1">Generic Name</span>
                    <span className="font-medium">{medicine.genericName}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block mb-1">Brand</span>
                    <span className="font-medium">{medicine.brand}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block mb-1">Category</span>
                    <span className="font-medium uppercase tracking-wider text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block mt-1">
                        {medicine.category}
                    </span>
                </div>
                <div>
                    <span className="text-muted-foreground block mb-1">Symptoms Treated</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {medicine.symptoms.map((s, i) => (
                            <span key={i} className="bg-secondary px-2 py-0.5 rounded-md text-[10px]">{s}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground leading-relaxed">{medicine.description}</p>
            </div>
          </div>

          {/* Price History Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <History className="mr-2 h-5 w-5 text-primary" /> Price History
              </h3>
              <div className="flex items-center text-sm font-medium text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" /> Lowest Price: ₹{medicine.mrp * 0.88}
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory.length > 0 ? priceHistory : [{name: 'No data', price: medicine.mrp}]}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Price Comparison & Pharmacies */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">{medicine.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">by {medicine.brand}</p>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-yellow-500 font-bold">
                    <Star className="h-4 w-4 fill-yellow-500 mr-1" /> 4.8 (2,400 reviews)
                </div>
                <div className="flex items-center text-primary font-medium">
                    <CheckCircle className="h-4 w-4 mr-1" /> Verified Pharmacy Stock
                </div>
            </div>
          </div>

          {/* Inventory / Price Comparison Table */}
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-red-600" /> Compare Store Prices
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="pb-6">Pharmacy</th>
                    <th className="pb-6">Rating</th>
                    <th className="pb-6">Stock</th>
                    <th className="pb-6">Price</th>
                    <th className="pb-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventory.map((item) => (
                    <tr key={item._id} className="group">
                      <td className="py-6">
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-red-600 transition-colors">{item.pharmacy.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> 1.2 km away
                          </p>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 w-fit px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 fill-yellow-500" />
                          <span className="text-[10px] font-black">{item.pharmacy.rating}</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.stock > 20 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          <CheckCircle className="h-3 w-3" /> {item.stock > 20 ? 'In Stock' : `Only ${item.stock} left`}
                        </div>
                      </td>
                      <td className="py-6">
                        <div>
                          <p className="text-xl font-black text-slate-900">₹{item.price}</p>
                          {item.discount > 0 && (
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{item.discount}% OFF applied</p>
                          )}
                        </div>
                      </td>
                      <td className="py-6">
                        <button 
                          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-red-600 transition-all shadow-lg shadow-slate-200"
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <Clock className="h-6 w-6" />
            </div>
            <div>
                <h4 className="font-bold text-red-400">1-Hour Express Delivery</h4>
                <p className="text-sm text-red-300/70 mt-1">Get this medicine delivered within 1 hour because your location is within 3km of Apollo Pharmacy Central.</p>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="space-y-8 pt-8">
            {recommendations.genericAlternatives.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" /> Generic Alternatives
                </h3>
                <p className="text-sm text-muted-foreground">Same salt composition, often at better prices.</p>
                <div className="grid grid-cols-1 gap-4">
                  {recommendations.genericAlternatives.map((alt) => (
                    <Link key={alt._id} href={`/medicine/${alt._id}`} className="block group">
                      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary transition-all">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center p-2">
                          <img src={alt.image} alt={alt.name} className="max-h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{alt.name}</h4>
                          <p className="text-[10px] text-muted-foreground">{alt.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-primary text-sm">₹{alt.mrp}</p>
                          <p className="text-[10px] text-green-500 font-bold">Recommended</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {recommendations.similarMedicines.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Similar Products
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {recommendations.similarMedicines.map((sim) => (
                    <Link key={sim._id} href={`/medicine/${sim._id}`} className="block group">
                      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary transition-all">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center p-2">
                          <img src={sim.image} alt={sim.name} className="max-h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{sim.name}</h4>
                          <p className="text-[10px] text-muted-foreground">{sim.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm">₹{sim.mrp}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
