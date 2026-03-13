'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Pill, 
  ChevronRight,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return (
    <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-slate-900">Order not found</h1>
        <Link href="/" className="text-primary mt-4 inline-block font-bold underline">Back to home</Link>
    </div>
  );

  const steps = [
    { id: 'pending', label: 'Order Placed', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'confirmed', label: 'Confirmed', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'packed', label: 'Packed', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'out for delivery', label: 'Out for Delivery', icon: Truck, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' }
  ];

  const currentStepIdx = steps.findIndex(s => s.id === order.status);

  return (
    <div className="container mx-auto px-4 py-24 mt-16 max-w-7xl">
      <Link href="/orders" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-12 group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to history
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Order Info & Tracking */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Order Tracking</h1>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                </div>
                <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-black text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Tracking Steps */}
            <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0 hidden md:block"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-4 group">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? `${step.bg} ${step.color} shadow-lg shadow-slate-100 scale-110` : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</p>
                                    {isCurrent && <p className="text-[9px] font-bold text-primary mt-1">NOW</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Order Items</h2>
            <div className="space-y-6">
                {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-6 border border-slate-50 rounded-[32px] group hover:border-primary/20 transition-all">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center p-4 shrink-0 group-hover:scale-105 transition-transform">
                            <img src={item.image} alt={item.name} className="max-h-full object-contain drop-shadow-md" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors truncate">{item.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.qty} units • ₹{item.price} per unit</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-slate-900">₹{(item.qty * item.price).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm sticky top-32">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Summary</h3>
            <div className="space-y-6">
                <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Items Subtotal</span>
                    <span className="text-slate-900">₹{order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Shipping</span>
                    <span className="text-slate-900">{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-green-600">
                    <span className="font-black uppercase tracking-widest text-[10px]">Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                </div>
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900">Total Paid</span>
                    <span className="text-3xl font-black text-primary">₹{order.totalPrice.toFixed(2)}</span>
                </div>

                <div className="pt-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                            <p className="text-xs font-bold text-slate-900">{order.paymentMethod}</p>
                            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-500'}`}>{order.paymentStatus}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Address</p>
                            <p className="text-xs font-bold text-slate-900">{order.shippingAddress.address}</p>
                            <p className="text-xs font-medium text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
