'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Star, MapPin, Phone, Clock, ChevronRight, Award } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TopPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const { data } = await api.get('/pharmacies/top');
        setPharmacies(data);
      } catch (error) {
        console.error('Error fetching top pharmacies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <Award className="h-10 w-10 text-red-600" /> Top Rated Pharmacies
          </h1>
          <p className="text-slate-500 font-medium">The most trusted medical stores near your location based on user reviews.</p>
        </div>
        <div className="bg-red-50 px-6 py-3 rounded-2xl border border-red-100">
          <p className="text-xs font-black text-red-600 uppercase tracking-widest">Verified Stores</p>
          <p className="text-sm font-bold text-red-800">5 Best Matches Found</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-[32px]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pharmacies.map((pharmacy, idx) => (
            <motion.div 
              key={pharmacy._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:border-red-100 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-200">
                  RANK #{idx + 1}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors pr-12">{pharmacy.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-yellow-500 bg-yellow-50 px-2.5 py-1 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 mr-1" />
                      <span className="text-xs font-black">{pharmacy.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">({pharmacy.numReviews} Reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <span className="font-medium leading-relaxed">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Phone className="h-4 w-4 text-red-600 shrink-0" />
                    <span className="font-bold">{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Clock className="h-4 w-4 text-red-600 shrink-0" />
                    <span className="font-medium">Open until 10:00 PM</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <Link 
                    href={`/pharmacy/${pharmacy._id}`}
                    className="flex-1 bg-slate-900 text-white text-center py-4 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group/btn"
                  >
                    Visit Store <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
