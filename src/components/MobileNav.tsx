import React from 'react';
import { Home, Briefcase, CheckSquare, Wallet, User as UserIcon, Building2 } from 'lucide-react';
import { User } from '../types';

interface MobileNavProps {
  activeTab?: string;
  currentTab?: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  currentTab,
  onSelectTab,
  currentUser,
}) => {
  const current = activeTab || currentTab || 'home';

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Explore', icon: Briefcase },
    {
      id: 'my-jobs',
      label: 'Tasks',
      icon: CheckSquare,
      badge: currentUser && currentUser.tasksActive > 0 ? currentUser.tasksActive : null,
    },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 px-2 py-2">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab, idx) => {
          const active = current === tab.id;
          return (
            <button
              key={`${tab.id}-${idx}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors relative ${
                active ? 'text-amber-400 bg-white/5' : 'text-gray-500 hover:text-white'
              }`}
            >
              <div className="relative">
                <tab.icon className={`w-5 h-5 ${active ? 'text-amber-400' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[55px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
