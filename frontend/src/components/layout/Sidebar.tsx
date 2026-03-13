'use client';
import Link from 'next/link';
import { 
  User, 
  MapPin, 
  MessageSquare, 
  ShoppingBag, 
  History, 
  Settings, 
  LayoutDashboard,
  ShieldCheck,
  Pill,
  ChevronRight,
  LogOut,
  Award,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { userInfo, logout } = useAuthStore();

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-slate-100 bg-slate-50/50 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide p-6">
      
      {/* Profile Section */}
      <div className="mb-10">
        {userInfo ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black text-lg uppercase shadow-lg shadow-primary/20">
                {userInfo.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 truncate">{userInfo.name}</h4>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{userInfo.role}</p>
              </div>
            </div>
            <Link href="/profile" className="w-full py-2 px-4 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between group">
              My Profile <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">Join MEDIFIND</h4>
            <p className="text-[10px] text-slate-500 mb-4">Access price history, track orders, and chat with AI.</p>
            <Link href="/login" className="block w-full py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Login / Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="space-y-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">Core Tools</h3>
          <nav className="space-y-1">
            <SidebarLink href="/search" icon={Pill} label="Find Medicines" />
            <SidebarLink href="/top-pharmacies" icon={Award} label="Top Pharmacies" />
            <SidebarLink href="/bestsellers" icon={Zap} label="Bestsellers" />
            <SidebarLink href="/map" icon={MapPin} label="Nearby Map" />
            <SidebarLink href="/chat" icon={MessageSquare} label="AI Doctor" />
          </nav>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">My Health</h3>
          <nav className="space-y-1">
            <SidebarLink href="/orders" icon={ShoppingBag} label="Order History" />
            <SidebarLink href="/prescriptions" icon={History} label="Prescriptions" />
            <SidebarLink href="/settings" icon={Settings} label="Preferences" />
          </nav>
        </div>

        {userInfo?.role === 'admin' && (
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4 px-4">Management</h3>
            <nav className="space-y-1">
              <SidebarLink href="/admin" icon={LayoutDashboard} label="Admin Panel" />
            </nav>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-10 px-4">
        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-green-800">Verified Stores</p>
            <p className="text-[9px] text-green-700/70 mt-0.5 leading-relaxed">All our partner pharmacies are government certified.</p>
          </div>
        </div>
        
        {userInfo && (
          <button 
            onClick={logout}
            className="w-full mt-6 flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 text-xs font-bold transition-all group"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm border border-transparent hover:border-slate-100 transition-all group"
    >
      <Icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
      {label}
    </Link>
  );
}
