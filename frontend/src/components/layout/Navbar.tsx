'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  User as UserIcon, 
  Search, 
  MapPin, 
  Pill, 
  MessageSquare, 
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Store,
  Award,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { userInfo, logout } = useAuthStore();
  const { cartItems, fetchCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    if (userInfo?.token) fetchCart(userInfo.token);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userInfo, fetchCart]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const { data } = await api.get(`/medicines/suggestions?q=${searchQuery}`);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const onLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3 bg-white/95 backdrop-blur-2xl border-b border-border shadow-md' : 'py-6 bg-white border-b border-transparent'}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-8">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center group relative z-50">
            <div className="relative">
                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <Pill className="h-8 w-8 text-primary relative group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <span className="ml-3 text-2xl font-black tracking-tighter text-foreground font-heading">
              MEDI<span className="text-secondary">FIND</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl relative group">
            <div className="relative flex items-center w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-2.5 transition-all focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search medicines, symptoms, brands..."
                    className="w-full bg-transparent border-none text-sm font-medium focus:ring-0 placeholder:text-slate-400 focus:outline-none text-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                />
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2">
                    {suggestions.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => {
                          router.push(`/medicine/${s._id}`);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all text-left group"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          <Pill className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.genericName} • {s.brand}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-5">
            <nav className="hidden xl:flex items-center gap-8 mr-4">
                {[
                    { href: '/top-pharmacies', label: 'Top Stores', icon: Award },
                    { href: '/bestsellers', label: 'Bestsellers', icon: Zap },
                    { href: '/map', label: 'Map', icon: MapPin }
                ].map(link => (
                    <Link 
                        key={link.href} 
                        href={link.href} 
                        className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center gap-2 relative group"
                    >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                ))}
            </nav>

            {/* Cart Button */}
            <Link href="/cart" className="relative group p-3 bg-secondary/50 rounded-2xl hover:bg-primary/10 transition-all">
                <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-black text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-background animate-in zoom-in duration-300">
                        {cartItems.length}
                    </span>
                )}
            </Link>

            {/* User Dropdown / Login */}
            {userInfo ? (
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                        <p className="text-xs font-black text-slate-900">{userInfo.name.split(' ')[0]}</p>
                    </div>
                    <Link href="/profile" className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-black text-sm uppercase border border-slate-200 hover:bg-white hover:text-primary transition-all">
                        {userInfo.name.charAt(0)}
                    </Link>
                </div>
            ) : (
                <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-black text-sm shadow-lg shadow-primary/20 transition-all">
                    Login
                </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 bg-secondary/50 rounded-2xl text-foreground"
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-background border-b border-border overflow-hidden"
            >
                <div className="container mx-auto px-4 py-8 space-y-6">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search medicines..." 
                            className="w-full bg-secondary/50 border border-border rounded-2xl px-12 py-4 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <nav className="grid grid-cols-2 gap-4">
                        <Link href="/map" className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-3xl border border-border/50 hover:bg-primary/10 transition-all">
                            <MapPin className="h-8 w-8 text-primary mb-3" />
                            <span className="text-xs font-black uppercase tracking-widest">Find Map</span>
                        </Link>
                        <Link href="/chat" className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-3xl border border-border/50 hover:bg-primary/10 transition-all">
                            <MessageSquare className="h-8 w-8 text-primary mb-3" />
                            <span className="text-xs font-black uppercase tracking-widest">AI Doctor</span>
                        </Link>
                    </nav>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
