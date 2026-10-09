import React, { useState } from 'react';
import { X, AlertTriangle, Send, MapPin, Waves, Trees, CableCar, ShieldAlert } from 'lucide-react';
import { HazardType } from '../../types/emergency';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { addCommunityRoadHazard } from '../../services/communityRoadblockService';

interface ReportRoadblockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: () => void;
}

export const ReportRoadblockModal: React.FC<ReportRoadblockModalProps> = ({
  isOpen,
  onClose,
  onReportCreated,
}) => {
  const { location } = useLocation();
  const { t } = useLanguage();

  const [type, setType] = useState<HazardType>('flooded_road');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>(location.cityName || 'Current Road / Area');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'critical'>('critical');

  if (!isOpen) return null;

  const hazardOptions: { id: HazardType; label: string; icon: string }[] = [
    { id: 'flooded_road', label: 'Flooded / Waterlogged Road', icon: '🌊' },
    { id: 'waterlogged_underpass', label: 'Submerged Subway / Underpass', icon: '🚇' },
    { id: 'tree_fallen', label: 'Fallen Tree / Power Pole', icon: '🌳' },
    { id: 'bridge_submerged', label: 'Submerged Bridge / River Margin', icon: '🌉' },
    { id: 'landslide', label: 'Mudslide / Debris Blockage', icon: '🏔️' },
    { id: 'gridlock', label: 'Emergency Vehicle Gridlock', icon: '🛑' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCommunityRoadHazard(
      type,
      title,
      description,
      location.lat,
      location.lng,
      address,
      severity
    );

    onReportCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">
              {t('report_hazard')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto">
          {/* Hazard Type Picker */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Select Hazard Type
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {hazardOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    setType(opt.id);
                    if (!title) setTitle(opt.label);
                  }}
                  className={`p-2 rounded-xl text-left font-medium border transition flex items-center gap-1.5 ${
                    type === opt.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                      : 'bg-navy-950 text-slate-300 border-navy-700 hover:border-navy-600'
                  }`}
                >
                  <span className="text-sm">{opt.icon}</span>
                  <span className="text-[11px] leading-tight truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hazard Title */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Location / Roadway Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Milan Subway Submerged"
              className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Severity Toggle */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Obstruction Severity
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['low', 'moderate', 'critical'] as const).map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition ${
                    severity === sev
                      ? sev === 'critical'
                        ? 'bg-red-600 text-white border-red-500 shadow-md'
                        : sev === 'moderate'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-blue-600 text-white border-blue-500'
                      : 'bg-navy-950 text-slate-400 border-navy-700'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Obstruction Details (Water depth, stranded vehicles)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Over 2 feet water, cars turning back, avoid right lane..."
              rows={2}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Location / Street Address */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Landmark / Road Name
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-red-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Exact road or nearest landmark"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Auto-pinned to GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
          </div>

          {/* Auto Expiration Note */}
          <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-amber-400 font-bold">⏱️ Auto-Expiry:</span>
            <span>Reports expire automatically in 4 hours unless re-confirmed by other citizens.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{t('submit_report')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
