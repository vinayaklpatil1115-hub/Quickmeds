'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Pill, Zap, ShieldCheck, ArrowRight, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BestSellersPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data } = await api.get('/medicines/bestsellers');
        setMedicines(data);
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-red-100">
            <Zap className="h-3.5 w-3.5 fill-red-600" /> Top Demand
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
            Best Selling <span className="text-red-600">Medicines</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Discover the most frequently purchased medicines across all verified stores. High quality and guaranteed availability.
          </p>
        </div>
        <div className="hidden lg:block">
            <div className="w-48 h-48 bg-red-600 rounded-[40px] rotate-12 flex items-center justify-center shadow-2xl shadow-red-200">
                <Pill className="h-24 w-24 text-white -rotate-12" />
            </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-slate-50 animate-pulse rounded-[40px]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {medicines.map((med, idx) => (
            <motion.div 
              key={med._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all flex flex-col h-full relative"
            >
              <div className="absolute top-6 left-6">
                <div className="bg-green-50 text-green-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-green-100 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Certified
                </div>
              </div>

              <div className="w-full aspect-square bg-slate-50 rounded-3xl mb-8 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500">
                <img src={med.image} alt={med.name} className="max-h-full object-contain drop-shadow-xl" />
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div>
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-1">{med.category}</p>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">{med.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{med.brand}</p>
                </div>
                
                <div className="flex items-center justify-center sm:justify-between pt-4 border-t border-slate-50 mt-4">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting from</p>
                        <p className="text-2xl font-black text-slate-900">₹{med.mrp}</p>
                    </div>
                    <Link 
                        href={`/medicine/${med._id}`}
                        className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-slate-200 group/btn"
                    >
                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Categories Banner */}
      <div className="mt-24 p-12 bg-slate-900 rounded-[60px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
            <Pill className="h-64 w-64" />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
                <h4 className="text-2xl font-black mb-4">Pain Relief</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Fast-acting relief for headaches, muscle pain, and fever.</p>
            </div>
            <div>
                <h4 className="text-2xl font-black mb-4">Antibiotics</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Effective treatment for bacterial and throat infections.</p>
            </div>
            <div>
                <h4 className="text-2xl font-black mb-4">Diabetes</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Essential blood sugar control and insulin management.</p>
            </div>
            <div>
                <h4 className="text-2xl font-black mb-4">Heart Care</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Cholesterol and blood pressure management specialists.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
