'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  Package, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderHistoryPage() {
  const { userInfo } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) fetchOrders();
  }, [userInfo]);

  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  if (loading) return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-24 mt-16 max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Order History</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Track and manage your past medical purchases.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'confirmed', 'packed', 'out for delivery', 'delivered'].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterStatus === status ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/30'}`}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-32 bg-white border border-slate-100 rounded-[60px] shadow-sm">
            <Package className="h-20 w-20 text-slate-200 mx-auto mb-8" />
            <h2 className="text-2xl font-black text-slate-900 mb-4">No orders found</h2>
            <p className="text-slate-500 font-medium mb-12">Looks like you haven't placed any orders with this filter yet.</p>
            <Link href="/search" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-primary transition-all shadow-xl shadow-slate-200">
                Start Shopping
            </Link>
        </div>
      ) : (
        <div className="space-y-8">
            {filteredOrders.map((order, idx) => (
                <motion.div 
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all group"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center p-5 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                <h3 className="text-xl font-black text-slate-900">{order.orderItems.length} Medicines</h3>
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                        {order.status}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" /> {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 lg:pr-8">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</p>
                                <p className="text-3xl font-black text-slate-900">₹{order.totalPrice.toFixed(2)}</p>
                            </div>
                            <Link 
                                href={`/order/${order._id}`}
                                className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all shadow-xl shadow-slate-200 group/btn"
                            >
                                <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Simple Item Preview */}
                    <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap gap-4">
                        {order.orderItems.slice(0, 4).map((item, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 group/item hover:border-primary/20 transition-all">
                                <img src={item.image} alt={item.name} className="h-6 w-6 object-contain" />
                                <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{item.name}</span>
                            </div>
                        ))}
                        {order.orderItems.length > 4 && (
                            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 flex items-center">
                                +{order.orderItems.length - 4} MORE
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}
