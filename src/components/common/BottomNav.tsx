import React from 'react';
import { AlertCircle, Map, Building2, AlertTriangle, UserCheck } from 'lucide-react';
import { NavigationTab } from '../../types/emergency';
import { useLanguage } from '../../context/LanguageContext';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'home' as NavigationTab,
      label: t('nav_home'),
      icon: AlertCircle,
      accent: 'text-red-500',
      activeBg: 'bg-red-500/15 text-red-400 border-red-500/30',
    },
    {
      id: 'map' as NavigationTab,
      label: t('nav_map'),
      icon: Map,
      accent: 'text-blue-400',
      activeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    },
    {
      id: 'hospitals' as NavigationTab,
      label: t('nav_hospitals'),
      icon: Building2,
      accent: 'text-cyan-400',
      activeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'reports' as NavigationTab,
      label: t('nav_reports'),
      icon: AlertTriangle,
      accent: 'text-amber-400',
      activeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    },
    {
      id: 'profile' as NavigationTab,
      label: t('nav_profile'),
      icon: UserCheck,
      accent: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 border-t border-navy-700/80 backdrop-blur-lg pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? `${item.activeBg} border shadow-md font-bold scale-[1.02]`
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.id === 'home' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
