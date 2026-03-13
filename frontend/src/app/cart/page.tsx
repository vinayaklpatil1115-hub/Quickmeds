'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingCart, 
  ChevronRight, 
  Tag, 
  ArrowLeft,
  Truck,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { userInfo } = useAuthStore();
  const { cartItems, loading, fetchCart, updateQty, removeItem } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);

  useEffect(() => {
    if (userInfo?.token) {
      fetchCart(userInfo.token);
    }
  }, [userInfo, fetchCart]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxPrice = itemsPrice * 0.12;
  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  
  // Automatic volume discount
  let volumeDiscount = 0;
  if (itemsPrice >= 2000) volumeDiscount = itemsPrice * 0.15;
  else if (itemsPrice >= 1000) volumeDiscount = itemsPrice * 0.10;
  else if (itemsPrice >= 500) volumeDiscount = itemsPrice * 0.05;

  const totalPrice = itemsPrice + taxPrice + shippingPrice - volumeDiscount - discountApplied;

  if (!userInfo) return (
    <div className="container mx-auto px-4 py-32 text-center max-w-md">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary">
        <ShoppingCart className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4">Your cart is waiting</h1>
      <p className="text-slate-500 font-medium mb-10">Sign in to see the medicines you've added and get exclusive discounts.</p>
      <Link href="/login" className="w-full block bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-primary transition-all shadow-xl shadow-slate-200">
        Login Now
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-24 mt-16 max-w-7xl">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-4">
            <ShoppingCart className="h-10 w-10 text-primary" /> My Cart
          </h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
            Review your medicines and select a delivery method.
          </p>
        </div>
        <Link href="/search" className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="py-32 text-center bg-white border border-slate-100 rounded-[60px] shadow-sm">
          <ShoppingCart className="h-20 w-20 mx-auto text-slate-200 mb-8" />
          <h2 className="text-2xl font-black text-slate-900 mb-4">Your cart is empty</h2>
          <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Looks like you haven't added anything yet. Search for medicines to get started.</p>
          <Link href="/search" className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-primary transition-all shadow-xl shadow-slate-200">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-100 rounded-[40px] p-8 flex flex-col sm:flex-row items-center gap-8 group hover:shadow-2xl hover:border-primary/20 transition-all"
                >
                  <div className="w-28 h-28 bg-slate-50 rounded-[32px] p-5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <img src={item.medicine.image} alt={item.medicine.name} className="max-h-full object-contain drop-shadow-lg" />
                  </div>
                  
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{item.medicine.category}</p>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{item.medicine.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                            <MapPin className="h-3 w-3 text-secondary" /> {item.pharmacy.name}
                        </p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-6 pt-4">
                        <div className="flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                            <button 
                                onClick={() => updateQty(userInfo.token, item._id, Math.max(1, item.qty - 1))}
                                className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-primary rounded-lg transition-colors shadow-sm"
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center font-black text-slate-900 text-sm">{item.qty}</span>
                            <button 
                                onClick={() => updateQty(userInfo.token, item._id, item.qty + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-primary rounded-lg transition-colors shadow-sm"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <button 
                            onClick={() => removeItem(userInfo.token, item._id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                  </div>

                  <div className="text-center sm:text-right pt-4 sm:pt-0 sm:pl-8 border-t sm:border-t-0 sm:border-l border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
                    <p className="text-3xl font-black text-slate-900">₹{(item.qty * item.price).toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">₹{item.price} / unit</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-8 flex items-center gap-6">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="text-sm">
                    <h4 className="font-black text-slate-900 uppercase tracking-widest">Secure Checkout Guarantee</h4>
                    <p className="text-slate-500 font-medium mt-1">Your health data and payments are protected with 256-bit encryption.</p>
                </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm space-y-8 sticky top-32">
              <h3 className="text-2xl font-black text-slate-900">Order Summary</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="text-slate-900">₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Tax (GST 12%)</span>
                  <span className="text-slate-900">₹{taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Shipping</span>
                  <span className={`text-slate-900 ${shippingPrice === 0 ? 'text-green-600' : ''}`}>
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>
                {volumeDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                        <Tag className="h-3.5 w-3.5" /> Bulk Discount
                    </span>
                    <span className="font-black">-₹{volumeDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-slate-50">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-black text-slate-900">Total</span>
                  <span className="text-4xl font-black text-primary">₹{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="relative mb-8 group">
                    <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase tracking-widest"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-primary transition-all uppercase tracking-widest">
                        Apply
                    </button>
                </div>

                <Link 
                    href="/checkout"
                    className="w-full bg-slate-900 text-white text-center py-5 rounded-[24px] font-black text-sm hover:bg-primary transition-all shadow-xl shadow-slate-200 flex items-center justify-center group"
                >
                  Proceed to Checkout <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                    <Truck className="h-4 w-4" /> Express delivery available
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
