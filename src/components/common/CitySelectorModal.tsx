import React from 'react';
import { X, Navigation, MapPin } from 'lucide-react';
import { useLocation, PRESET_CITIES } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({ isOpen, onClose }) => {
  const { location, setManualLocation, requestCurrentLocation, loadingLocation, permissionStatus } = useLocation();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-navy-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-white text-base">Select Emergency Region</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* GPS Auto Detect */}
          <button
            onClick={() => {
              requestCurrentLocation();
              onClose();
            }}
            disabled={loadingLocation}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-600/30 to-red-500/10 border border-red-500/40 text-red-200 hover:bg-red-600/40 transition group"
          >
            <div className="flex items-center gap-3">
              <Navigation className={`w-5 h-5 text-red-400 ${loadingLocation ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
              <div className="text-left">
                <div className="font-bold text-sm text-white">Use My Live GPS Location</div>
                <div className="text-[11px] text-slate-300">
                  {permissionStatus === 'denied' ? 'Permission denied (click to retry)' : 'High-precision browser geolocation'}
                </div>
              </div>
            </div>
            <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded font-mono font-bold text-red-300">
              LIVE
            </span>
          </button>

          {/* Regional Flood & Disaster Hubs */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Indian Disaster Hubs & Metro Centers
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {PRESET_CITIES.map((city) => {
                const isSelected = location.cityName.includes(city.name.split(' ')[0]);

                return (
                  <button
                    key={city.name}
                    onClick={() => {
                      setManualLocation(city.lat, city.lng, city.name);
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition text-xs ${
                      isSelected
                        ? 'bg-navy-700 border border-red-500/50 text-white font-bold'
                        : 'bg-navy-800/70 hover:bg-navy-800 text-slate-300 border border-navy-700/60'
                    }`}
                  >
                    <span>{city.name}</span>
                    {isSelected && <span className="text-red-400 text-xs">● Active</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
