import React, { useState } from 'react';
import {
  Briefcase,
  Trophy,
  HelpCircle,
  FileText,
  Wallet,
  ShieldCheck,
  Menu,
  X,
  Building2,
  PlusCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';
import { Avatar } from './Avatar';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
}) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden 5-Click Admin Shortcut
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setLogoClicks(0);
      onOpenAdmin();
    }
  };

  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'jobs', label: 'Tasks', badge: '4,421' },
    { id: 'challenge', label: 'Challenge', badge: '$1K WIN' },
    { id: 'about', label: 'Agency' },
    { id: 'faq', label: 'FAQ' },
    { id: 'help', label: 'Support' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with 5-Click Admin Trigger */}
        <div className="flex items-center gap-10">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none transition-transform active:scale-95 text-left"
            title="WEJOBS Freelance Marketplace (5-click admin shortcut)"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-black font-black text-lg tracking-tighter shadow-md shadow-orange-500/30">
              W
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white font-display">
                WEJOBS<span className="text-orange-500">.</span>PRO
              </span>
              <span className="text-[9px] font-bold text-orange-400 tracking-[0.2em] uppercase -mt-0.5">
                REAL REWARDS • 4,421 TASKS
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 py-1.5 border-b-2 ${
                    active
                      ? 'text-white border-orange-500'
                      : 'text-slate-400 hover:text-white border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider ${
                        active
                          ? 'bg-orange-500 text-black'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {/* Notification Center Popover */}
              <NotificationCenter
                currentUser={currentUser}
                onNavigate={(tab) => onSelectTab(tab)}
              />

              <button
                onClick={() => onSelectTab('wallet')}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#141417] border border-white/10 hover:border-orange-500/40 transition-all"
                title="View Wallet Ledger & Cash Out"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400 border border-orange-500/30 font-bold">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Balance</span>
                  <span className="text-xs font-black text-white leading-tight font-mono">
                    ${currentUser.balanceAvailable.toFixed(2)} <span className="text-[9px] text-orange-400">USD</span>
                  </span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('my-jobs')}
                className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  currentTab === 'my-jobs'
                    ? 'bg-white text-black border-white'
                    : 'bg-[#141417] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>My Tasks</span>
                {currentUser.tasksActive > 0 && (
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-black text-[10px] font-black flex items-center justify-center font-mono">
                    {currentUser.tasksActive}
                  </span>
                )}
              </button>

              {/* User Profile Button */}
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-[#141417] border border-white/10 hover:border-white/20 transition-all"
                title="View & Edit Profile"
              >
                <Avatar type={currentUser.avatar} size="xs" />
                <div className="flex flex-col text-left hidden md:inline">
                  <span className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-orange-400 font-semibold uppercase tracking-wider leading-none">
                    {currentUser.role}
                  </span>
                </div>
              </button>

              {/* Super Admin Control Access */}
              {currentUser.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => onSelectTab('admin')}
                  className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-black transition-colors"
                  title="Super Admin Control Panel"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-extrabold uppercase tracking-wider text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-white hover:bg-slate-200 text-black px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-md shadow-white/10"
              >
                <span>Start Earning</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#141417] border border-white/10 text-slate-400 hover:text-white xl:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-[#0a0a0a] px-4 py-6 space-y-3 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black uppercase tracking-[0.2em] border ${
                currentTab === item.id
                  ? 'bg-white text-black border-white'
                  : 'text-slate-400 border-white/5 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-black px-2 py-0.5 bg-orange-500 text-black font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {currentUser ? (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  onSelectTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3.5 bg-[#121212] border border-white/10 text-white"
              >
                <div className="flex items-center gap-3">
                  <Avatar type={currentUser.avatar} size="xs" />
                  <span className="font-bold text-xs">{currentUser.name}</span>
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-400">Profile →</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectTab('my-jobs');
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 text-xs font-black uppercase tracking-wider text-slate-300 bg-[#121212] border border-white/10"
                >
                  My Tasks ({currentUser.tasksActive})
                </button>
                <button
                  onClick={() => {
                    onSelectTab('wallet');
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 text-xs font-black uppercase tracking-wider text-orange-400 bg-[#121212] border border-white/10"
                >
                  Wallet (${currentUser.balanceAvailable.toFixed(2)})
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest text-center"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-orange-500 text-black text-xs font-black uppercase tracking-widest text-center"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
