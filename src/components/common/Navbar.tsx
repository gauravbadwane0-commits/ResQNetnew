import React, { useState } from 'react';
import { ShieldAlert, Globe, MapPin, Wifi, WifiOff, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation, PRESET_CITIES } from '../../context/LocationContext';
import { useOffline } from '../../context/OfflineContext';
import { SupportedLanguage } from '../../types/emergency';

interface NavbarProps {
  onOpenLocationModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLocationModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { location, requestCurrentLocation } = useLocation();
  const { effectiveOnline, isSimulatedOffline, toggleSimulatedOffline } = useOffline();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const langLabels: Record<SupportedLanguage, string> = {
    en: 'EN',
    hi: 'हिंदी',
    mr: 'मराठी',
  };

  return (
    <header className="h-14 bg-navy-950/95 border-b border-navy-700/80 px-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
      {/* Brand & Team */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm tracking-wider text-white">RESQNET</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 font-semibold px-1.5 py-0.2 rounded border border-red-500/30">
              HC-05
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <span>Team Endless Coders</span>
          </div>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-1.5">
        {/* Location Hub Button */}
        <button
          onClick={() => (onOpenLocationModal ? onOpenLocationModal() : setShowLocationPicker(true))}
          title="Change location or refresh GPS"
          className="flex items-center gap-1 text-[11px] bg-navy-800 hover:bg-navy-700 text-slate-200 px-2 py-1.5 rounded-lg border border-navy-600 transition"
        >
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span className="max-w-[85px] truncate font-medium">
            {location.cityName.split(' ')[0]}
          </span>
        </button>

        {/* Offline Demo Simulator Toggle */}
        <button
          onClick={toggleSimulatedOffline}
          title={isSimulatedOffline ? "Restore Live Internet" : "Simulate Offline Mode (For Judges)"}
          className={`p-1.5 rounded-lg border transition ${
            effectiveOnline
              ? 'bg-navy-800 text-emerald-400 border-navy-600 hover:bg-navy-700'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}
        >
          {effectiveOnline ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          )}
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 text-[11px] font-bold bg-navy-800 hover:bg-navy-700 text-slate-200 px-2 py-1.5 rounded-lg border border-navy-600 transition"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{langLabels[language]}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-28 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl py-1 z-50">
              <button
                onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-navy-800 ${
                  language === 'en' ? 'text-red-400 font-bold bg-navy-800/60' : 'text-slate-300'
                }`}
              >
                <span>English</span>
                {language === 'en' && '✓'}
              </button>
              <button
                onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-navy-800 ${
                  language === 'hi' ? 'text-red-400 font-bold bg-navy-800/60' : 'text-slate-300'
                }`}
              >
                <span>हिंदी</span>
                {language === 'hi' && '✓'}
              </button>
              <button
                onClick={() => { setLanguage('mr'); setShowLangMenu(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-navy-800 ${
                  language === 'mr' ? 'text-red-400 font-bold bg-navy-800/60' : 'text-slate-300'
                }`}
              >
                <span>मराठी</span>
                {language === 'mr' && '✓'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
