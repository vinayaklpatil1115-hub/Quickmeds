'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ChevronRight, 
  Wallet, 
  DollarSign,
  Smartphone,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const { userInfo } = useAuthStore();
  const { cartItems, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const router = useRouter();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice = itemsPrice * 0.12;
  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country: 'India' },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        couponCode
      });
      clearCart(userInfo.token);
      router.push(`/order/${data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" /> Shipping Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Address</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Street name, Building..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">City</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Pune, Mumbai..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Postal Code</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="411001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Wallet className="h-8 w-8 text-secondary" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'Google Pay', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50' },
                { id: 'PhonePe', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50' },
                { id: 'Cash on Delivery', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-6 rounded-[32px] border transition-all text-center group relative overflow-hidden ${paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-100 bg-white hover:border-primary/30'}`}
                >
                  {paymentMethod === method.id && (
                    <div className="absolute top-4 right-4 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className={`w-12 h-12 ${method.bg} ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <p className="font-black text-sm text-slate-900">{method.id}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm sticky top-32">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Order Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Subtotal ({cartItems.length} items)</span>
                <span className="text-slate-900">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Shipping</span>
                <span className="text-slate-900">{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Tax (GST 12%)</span>
                <span className="text-slate-900">₹{taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="pt-6 border-t border-slate-50 space-y-4">
                <div className="relative group">
                    <input 
                        type="text" 
                        placeholder="Coupon Code"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase tracking-widest"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black hover:bg-primary transition-all">
                        APPLY
                    </button>
                </div>
                {userInfo?.coupons?.includes('LOYAL20') && (
                    <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                        <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Available: LOYAL20</p>
                        <button onClick={() => setCouponCode('LOYAL20')} className="text-[10px] font-black text-green-700 underline">USE</button>
                    </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">Total</span>
                <span className="text-3xl font-black text-primary">₹{totalPrice.toFixed(2)}</span>
              </div>

              <button 
                onClick={placeOrderHandler}
                disabled={loading || !address || !city || !postalCode}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm hover:bg-primary transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? 'Processing...' : (
                  <>
                    Confirm Order <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-6 flex items-center justify-center gap-2 text-slate-400">
                <Lock className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
