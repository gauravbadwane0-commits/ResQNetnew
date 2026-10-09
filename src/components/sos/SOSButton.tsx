import React, { useState } from 'react';
import { AlertCircle, Phone, Volume2, VolumeX, ShieldAlert, Waves, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from '../../context/LocationContext';
import { sirenEngine } from '../../utils/sirenAudio';

interface SOSButtonProps {
  onTriggerSOS: (presetNote?: string) => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onTriggerSOS }) => {
  const { t } = useLanguage();
  const { location } = useLocation();
  const [sirenActive, setSirenActive] = useState<boolean>(false);

  const toggleSiren = () => {
    if (sirenActive) {
      sirenEngine.stop();
      setSirenActive(false);
    } else {
      sirenEngine.start();
      setSirenActive(true);
    }
  };

  const presetMessages = [
    { id: 'flood', label: '🌊 Flood Water Rising', note: t('preset_flood') },
    { id: 'medical', label: '🩺 Medical Emergency', note: t('preset_medical') },
    { id: 'trapped', label: '🏚️ Trapped in Building', note: t('preset_trapped') },
    { id: 'accident', label: '🚗 Waterlogged Accident', note: t('preset_accident') },
    { id: 'supplies', label: '🥫 Need Clean Water & Food', note: t('preset_supplies') },
  ];

  return (
    <div className="space-y-5">
      {/* Central High-Impact SOS Button Container */}
      <div className="relative flex flex-col items-center justify-center pt-4 pb-2">
        {/* Pulsing Ripple Rings */}
        <div className="absolute w-64 h-64 rounded-full bg-red-600/10 animate-ping opacity-60 pointer-events-none"></div>
        <div className="absolute w-52 h-52 rounded-full bg-red-600/20 animate-pulse pointer-events-none"></div>

        {/* The SOS Trigger Button */}
        <button
          onClick={() => onTriggerSOS()}
          className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-rose-700 p-1.5 shadow-[0_0_50px_rgba(239,68,68,0.6)] active:scale-95 transition-all group border-4 border-red-400/40 hover:shadow-[0_0_70px_rgba(239,68,68,0.85)] flex flex-col items-center justify-center text-center select-none"
        >
          <div className="w-full h-full rounded-full border-2 border-dashed border-white/50 flex flex-col items-center justify-center p-2 bg-gradient-to-tr from-red-600 to-rose-600 group-hover:from-red-500 group-hover:to-rose-500 transition">
            <AlertCircle className="w-12 h-12 text-white drop-shadow-md group-hover:scale-110 transition-transform animate-pulse" />
            <span className="text-2xl font-black text-white tracking-widest mt-1 drop-shadow">
              SOS
            </span>
            <span className="text-[9px] font-bold text-red-100 uppercase tracking-wider mt-0.5 max-w-[110px] leading-tight">
              1-TAP DISPATCH
            </span>
          </div>
        </button>

        {/* Live GPS Coordinate Badge */}
        <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-slate-300 text-[11px] font-mono shadow-inner">
          <MapPin className="w-3.5 h-3.5 text-red-400 animate-bounce" />
          <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
          <span className="text-[10px] text-emerald-400 font-sans font-bold">● GPS Active</span>
        </div>
      </div>

      {/* Primary Emergency Quick Calls: Call 112 & Search Siren */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Direct Call 112 */}
        <a
          href="tel:112"
          className="py-3 px-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 border border-red-500/50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 active:scale-95 transition"
        >
          <Phone className="w-4 h-4 text-white animate-pulse" />
          <span>CALL 112 (DIRECT)</span>
        </a>

        {/* Rescue Siren Beacon Toggle */}
        <button
          onClick={toggleSiren}
          className={`py-3 px-3 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
            sirenActive
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse'
              : 'bg-navy-800 hover:bg-navy-700 text-amber-300 border-navy-600'
          }`}
        >
          {sirenActive ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>STOP SIREN</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>RESCUE SIREN</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Emergency Quick Templates */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            {t('quick_sms_templates')}
          </span>
          <span className="text-[10px] text-slate-400">1-tap attaches live GPS</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {presetMessages.map((item) => (
            <button
              key={item.id}
              onClick={() => onTriggerSOS(item.note)}
              className="w-full text-left p-3 rounded-xl bg-navy-800/80 hover:bg-navy-750 border border-navy-700/80 hover:border-red-500/40 text-slate-200 transition flex items-center justify-between group active:scale-[0.98]"
            >
              <div className="pr-2">
                <div className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.note}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-navy-700 text-slate-300 group-hover:bg-red-600 group-hover:text-white transition flex-shrink-0">
                Send
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
