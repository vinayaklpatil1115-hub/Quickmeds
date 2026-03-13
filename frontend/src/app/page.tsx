'use client';
import { motion } from 'framer-motion';
import { Search, MapPin, ShieldCheck, Clock, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-24 lg:py-32 bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />
          <div className="absolute h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] -top-20 -left-20" />
          <div className="absolute h-[400px] w-[400px] bg-secondary/5 rounded-full blur-[100px] bottom-0 right-0" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] border border-primary/20 shadow-sm"
            >
              <Zap className="h-4 w-4 fill-primary" /> India's Smartest Medicine Finder
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl text-slate-900 leading-[0.9]"
            >
              Your Health, <span className="text-primary">Delivered</span> <span className="text-secondary">Smartly.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl text-lg sm:text-xl text-slate-500 font-medium leading-relaxed"
            >
              Compare medicine prices across Omkar, Vinyak, and other verified local stores. Get the best discounts and fastest delivery in Pune.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 pt-8"
            >
              <Link 
                href="/search" 
                className="px-10 py-5 bg-primary text-white rounded-[24px] font-black text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-3 group"
              >
                Find Medicine <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/top-pharmacies" 
                className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-[24px] font-black text-lg shadow-2xl shadow-slate-100 hover:shadow-slate-200 hover:-translate-y-1 transition-all"
              >
                Top Rated Stores
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Features */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="h-8 w-8" />}
              title="Price Comparison"
              description="Find the same medicine at different prices across local pharmacies like Omkar and Suraj Medical."
              color="bg-primary/10 text-primary"
            />
            <FeatureCard 
              icon={<MapPin className="h-8 w-8" />}
              title="Nearby Stores"
              description="Locate verified pharmacies near you with real-time stock availability and ratings."
              color="bg-secondary/10 text-secondary"
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Loyalty Rewards"
              description="Get a 20% discount coupon (LOYAL20) after every 5 orders of ₹200 or more."
              color="bg-orange-100 text-orange-600"
            />
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Verified <span className="text-secondary">Partners</span></h2>
              <p className="text-slate-500 font-medium leading-relaxed">We work with the most trusted local pharmacies in Pune to ensure you get authentic medicines at the best prices.</p>
            </div>
            <Link href="/top-pharmacies" className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                View All Stores <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {['Omkar', 'Vinyak', 'Darshan', 'Suraj', 'Pajji'].map(store => (
              <div key={store} className="bg-white border border-slate-100 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <MapPin className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-black text-slate-900 text-sm">{store} Medical</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Verified</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-4"
    >
      <div className={`p-4 rounded-full ${color || 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}
