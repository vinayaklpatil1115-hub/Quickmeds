'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  ChevronRight,
  Store,
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  IndianRupee,
  Layers,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PharmacyDashboard() {
  const { userInfo } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (userInfo?.token && userInfo.role === 'pharmacy') {
      fetchData();
    }
  }, [userInfo]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orderRes, invRes] = await Promise.all([
        api.get(`/pharmacies/orders`),
        api.get(`/pharmacies/${userInfo._id}`) // This should be adjusted based on real profile ID
      ]);
      setOrders(orderRes.data);
      setInventory(invRes.data.inventory || []);
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo || userInfo.role !== 'pharmacy') {
    return (
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-4 text-orange-500">
              <AlertCircle className="h-10 w-10" /> Pharmacy Portal
          </h1>
          <p className="text-muted-foreground mb-8">Access restricted to verified pharmacy partners.</p>
          <Link href="/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">Login as Partner</Link>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Pharmacy Sidebar */}
      <aside className="w-full md:w-80 bg-card border-r border-border p-10 flex flex-col space-y-12">
        <div className="flex items-center gap-4">
            <div className="p-4 bg-primary rounded-3xl shadow-xl shadow-primary/20">
                <Store className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
                <h1 className="text-2xl font-black">Partner</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dashboard v1.0</p>
            </div>
        </div>

        <nav className="flex-1 space-y-3">
            {[
                { id: 'orders', icon: ShoppingBag, label: 'Incoming Orders', count: orders.length },
                { id: 'inventory', icon: Package, label: 'Inventory Management', count: inventory.length },
                { id: 'analytics', icon: BarChart3, label: 'Store Analytics' },
                { id: 'settings', icon: Settings, label: 'Store Settings' }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30 scale-105' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                    <div className="flex items-center gap-4">
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                    </div>
                    {tab.count !== undefined && (
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${activeTab === tab.id ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </nav>

        <div className="mt-auto p-8 bg-gradient-to-br from-primary/10 to-red-500/10 rounded-[32px] border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-20 w-20" />
            </div>
            <h4 className="font-black text-primary mb-2">Need Help?</h4>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-6 leading-relaxed">
                Contact our partner support for technical assistance.
            </p>
            <button className="text-xs font-black bg-white text-black px-6 py-3 rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all">
                Support Hub
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen scrollbar-hide">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
                <h2 className="text-4xl font-black mb-2">Hello, {userInfo.name}</h2>
                <div className="flex items-center gap-6">
                    <p className="text-muted-foreground flex items-center gap-2 font-medium">
                        <MapPin className="h-4 w-4 text-primary" /> Apollo Pharmacy Central
                    </p>
                    <div className="flex items-center gap-1 text-xs font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Store Online
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="p-4 bg-card border border-border rounded-2xl shadow-sm text-center min-w-[120px]">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Today's Revenue</p>
                    <p className="text-xl font-black text-primary">₹12,450</p>
                </div>
                <button className="bg-primary text-primary-foreground p-5 rounded-[24px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    <Plus className="h-8 w-8" />
                </button>
            </div>
        </header>

        {loading ? (
            <div className="py-20 text-center">Loading portal...</div>
        ) : (
            <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                    <motion.div 
                        key="orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <ShoppingBag className="h-6 w-6 text-primary" /> Active Orders
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sort by:</span>
                                <select className="bg-secondary/50 border border-border rounded-xl px-4 py-2 text-xs font-bold focus:outline-none">
                                    <option>Newest First</option>
                                    <option>Priority (Express)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {orders.length === 0 ? (
                                <div className="text-center py-32 bg-secondary/10 rounded-[40px] border border-dashed border-border opacity-50">
                                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                    <h4 className="text-xl font-bold">No active orders right now</h4>
                                    <p className="text-sm text-muted-foreground mt-2">Check back soon for new customer requests.</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order._id} className="bg-card border border-border rounded-[32px] p-8 hover:shadow-2xl transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                                        
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                            <div className="flex items-start gap-6">
                                                <div className="p-4 bg-primary/10 rounded-2xl text-primary font-black text-xl">
                                                    #{order._id.slice(-4).toUpperCase()}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-xl">{order.user.name}</h4>
                                                        {order.deliveryType.includes('Express') && (
                                                            <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                                                <Zap className="h-3 w-3" /> Express
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <MapPin className="h-3 w-3" /> {order.shippingAddress.address}, {order.shippingAddress.city}
                                                    </p>
                                                    <div className="flex items-center gap-4 pt-3">
                                                        {order.orderItems.map((item, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-xl border border-border">
                                                                <span className="text-[10px] font-black bg-primary text-primary-foreground w-5 h-5 rounded-md flex items-center justify-center">
                                                                    {item.qty}
                                                                </span>
                                                                <span className="text-xs font-bold">{item.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Order Total</p>
                                                    <p className="text-2xl font-black">₹{order.totalPrice.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button className="p-4 bg-secondary border border-border rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-colors">
                                                        <Trash2 className="h-6 w-6" />
                                                    </button>
                                                    <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-2">
                                                        Process Order <ArrowRight className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'inventory' && (
                    <motion.div 
                        key="inventory"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <Layers className="h-6 w-6 text-primary" /> Store Inventory
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    placeholder="Filter inventory..." 
                                    className="bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none w-64"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {inventory.map((item) => (
                                <div key={item._id} className="bg-card border border-border rounded-[32px] p-8 hover:border-primary/30 transition-all group shadow-sm">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-16 bg-secondary/50 rounded-2xl p-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <img src={item.medicine.image} alt={item.medicine.name} className="max-h-full object-contain" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-bold text-lg leading-tight">{item.medicine.name}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">{item.medicine.brand}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-secondary/30 rounded-2xl border border-border/50">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Stock</p>
                                                <p className={`text-sm font-bold flex items-center gap-2 ${item.stock < 10 ? 'text-red-500' : 'text-foreground'}`}>
                                                    <Package className="h-3 w-3" /> {item.stock} units
                                                </p>
                                            </div>
                                            <div className="p-3 bg-secondary/30 rounded-2xl border border-border/50">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Price</p>
                                                <p className="text-sm font-bold flex items-center gap-1 text-primary">
                                                    <IndianRupee className="h-3 w-3" /> {item.price}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Discount</span>
                                            <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-1 rounded-full">{item.discount}% OFF</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Add New Item Card */}
                            <button className="border-2 border-dashed border-border rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                                    <Plus className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold">Add New Medicine</p>
                                    <p className="text-xs text-muted-foreground">Expand your store catalog</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        )}
      </main>
    </div>
  );
}
