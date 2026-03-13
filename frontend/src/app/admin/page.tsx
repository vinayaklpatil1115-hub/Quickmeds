'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Search,
  CheckCircle,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const { userInfo } = useAuthStore();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userInfo?.token && userInfo.role === 'admin') {
      fetchAnalytics();
    }
  }, [userInfo]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/analytics`);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo || userInfo.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-4 text-red-500">
            <ShieldAlert className="h-10 w-10" /> Access Denied
        </h1>
        <p className="text-muted-foreground mb-8">You do not have permission to view this page.</p>
        <Link href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-card border-r border-border p-8 flex flex-col space-y-10">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-black">Admin Panel</h1>
        </div>

        <nav className="flex-1 space-y-2">
            {[
                { id: 'overview', icon: BarChart3, label: 'Overview' },
                { id: 'users', icon: Users, label: 'Manage Users' },
                { id: 'pharmacies', icon: Store, label: 'Pharmacies' },
                { id: 'medicines', icon: Package, label: 'Inventory' },
                { id: 'orders', icon: ShoppingBag, label: 'Total Orders' },
                { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                </button>
            ))}
        </nav>

        <div className="mt-auto p-6 bg-secondary/30 rounded-3xl border border-border/50">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full border-2 border-primary/30 flex items-center justify-center font-black text-primary uppercase">
                    {userInfo.name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-sm leading-tight">{userInfo.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Master Admin</p>
                </div>
            </div>
            <button className="w-full text-xs font-bold text-red-500 hover:underline">Logout Securely</button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen scrollbar-hide">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
                <h2 className="text-4xl font-black mb-2">Welcome back, Admin.</h2>
                <p className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative group hidden lg:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                        type="search" 
                        placeholder="Search for medicines, orders, or users..." 
                        className="bg-card border border-border rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary w-80 shadow-sm"
                    />
                </div>
                <button className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    <Plus className="h-6 w-6" />
                </button>
            </div>
        </div>

        {loading ? (
            <div className="py-20 text-center">Loading analytics...</div>
        ) : (
            <div className="space-y-12">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard 
                        icon={<DollarSign className="h-8 w-8 text-green-500" />}
                        label="Total Revenue"
                        value={`₹${analytics?.totalRevenue.toLocaleString()}`}
                        trend="+12.5%"
                        color="green"
                    />
                    <StatCard 
                        icon={<ShoppingBag className="h-8 w-8 text-red-500" />}
                        label="Total Orders"
                        value={analytics?.totalOrders}
                        trend="+8.2%"
                        color="red"
                    />
                    <StatCard 
                        icon={<Users className="h-8 w-8 text-purple-500" />}
                        label="Active Users"
                        value={analytics?.activeUsers}
                        trend="+15.1%"
                        color="purple"
                    />
                    <StatCard 
                        icon={<Store className="h-8 w-8 text-orange-500" />}
                        label="Active Pharmacies"
                        value={analytics?.activePharmacies}
                        trend="+3.4%"
                        color="orange"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-card border border-border rounded-[40px] p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-primary" /> Revenue Growth
                            </h3>
                            <select className="bg-secondary/50 border border-border rounded-xl px-4 py-2 text-xs font-bold focus:outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Jan', value: 4500 },
                                    { name: 'Feb', value: 5200 },
                                    { name: 'Mar', value: 4800 },
                                    { name: 'Apr', value: 6100 },
                                    { name: 'May', value: 5900 },
                                    { name: 'Jun', value: 7200 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#666" />
                                    <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#666" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '16px', color: '#fff' }}
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                    />
                                    <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm">
                        <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                            <Package className="h-6 w-6 text-primary" /> Top Categories
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Pain Relief', value: 40 },
                                            { name: 'Antibiotics', value: 30 },
                                            { name: 'Diabetes', value: 20 },
                                            { name: 'Other', value: 10 }
                                        ]}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {[ '#ef4444', '#10b981', '#f59e0b', '#8b5cf6' ].map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 space-y-4">
                            {[
                                { name: 'Pain Relief', color: 'bg-red-500', value: '40%' },
                                { name: 'Antibiotics', color: 'bg-green-500', value: '30%' },
                                { name: 'Diabetes', color: 'bg-yellow-500', value: '20%' }
                            ].map((cat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                                        <span className="text-xs font-bold text-muted-foreground">{cat.name}</span>
                                    </div>
                                    <span className="text-xs font-black">{cat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Popular Medicines Table */}
                <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm overflow-hidden">
                    <h3 className="text-2xl font-black mb-8">Popular Medicines</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <th className="pb-6">Medicine Name</th>
                                    <th className="pb-6">Total Sales</th>
                                    <th className="pb-6">Price Point</th>
                                    <th className="pb-6">Stock Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {analytics?.popularMedicines.map((med, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                                    {med.name.charAt(0)}
                                                </div>
                                                <span className="font-bold group-hover:text-primary transition-colors">{med.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 font-medium">{med.count} units</td>
                                        <td className="py-6 font-medium">₹{(50 + i * 20).toFixed(2)} avg</td>
                                        <td className="py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                <CheckCircle className="h-3 w-3" /> In Stock
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }) {
    const colors = {
        green: 'bg-green-500/10 border-green-500/20 text-green-500',
        red: 'bg-red-500/10 border-red-500/20 text-red-500',
        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
        orange: 'bg-orange-500/10 border-orange-500/20 text-orange-500'
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-card border border-border rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group"
        >
            <div className={`p-4 rounded-2xl inline-block mb-6 transition-transform group-hover:scale-110 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <h4 className="text-3xl font-black">{value}</h4>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {trend}
                </span>
            </div>
        </motion.div>
    );
}
