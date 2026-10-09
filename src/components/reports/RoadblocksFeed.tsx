import React, { useState } from 'react';
import { AlertTriangle, Plus, ThumbsUp, Clock, MapPin, CheckCircle, Navigation, ShieldAlert, Waves } from 'lucide-react';
import { RoadHazard, HazardType } from '../../types/emergency';
import { useLanguage } from '../../context/LanguageContext';
import { confirmRoadHazard } from '../../services/communityRoadblockService';
import { ReportRoadblockModal } from './ReportRoadblockModal';

interface RoadblocksFeedProps {
  hazards: RoadHazard[];
  onRefreshHazards: () => void;
  onViewHazardOnMap: (hazard: RoadHazard) => void;
}

export const RoadblocksFeed: React.FC<RoadblocksFeedProps> = ({
  hazards,
  onRefreshHazards,
  onViewHazardOnMap,
}) => {
  const { t } = useLanguage();
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');

  const handleConfirm = (id: string) => {
    confirmRoadHazard(id);
    onRefreshHazards();
  };

  const getHazardIcon = (type: HazardType) => {
    switch (type) {
      case 'flooded_road': return '🌊';
      case 'waterlogged_underpass': return '🚇';
      case 'tree_fallen': return '🌳';
      case 'bridge_submerged': return '🌉';
      case 'landslide': return '🏔️';
      default: return '⚠️';
    }
  };

  const formatExpiresIn = (expiresAt: number): string => {
    const diffMs = expiresAt - Date.now();
    if (diffMs <= 0) return 'Expiring soon';
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${mins}m remaining`;
    return `${mins}m remaining`;
  };

  const filtered = hazards.filter((h) => {
    if (filterType === 'all') return true;
    return h.type === filterType;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{t('hazard_title')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Crowd-verified real-time road conditions
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Report Road</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'all'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          All Obstructions ({hazards.length})
        </button>
        <button
          onClick={() => setFilterType('flooded_road')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'flooded_road'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          🌊 Flooded
        </button>
        <button
          onClick={() => setFilterType('waterlogged_underpass')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'waterlogged_underpass'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          🚇 Underpasses
        </button>
        <button
          onClick={() => setFilterType('tree_fallen')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'tree_fallen'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          🌳 Debris / Trees
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-navy-900/50 border border-navy-800 space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
            <div className="font-bold text-white text-sm">No Reported Roadblocks</div>
            <p className="text-xs text-slate-400">Arterial roadways clear for this category.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-navy-900 border transition space-y-3 shadow-md ${
                item.severity === 'critical'
                  ? 'border-red-500/40 hover:border-red-500/70'
                  : 'border-amber-500/30 hover:border-amber-500/60'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl p-2 rounded-xl bg-navy-950 border border-navy-800">
                    {getHazardIcon(item.type)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          item.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.severity} Obstruction
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatExpiresIn(item.expiresAt)}</span>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-white pt-0.5 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed pl-1">
                {item.description}
              </p>

              {/* Location Badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-1">
                <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate">{item.location.address}</span>
              </div>

              {/* Footer Actions: Still Blocked? & View on Map */}
              <div className="pt-2 border-t border-navy-800 flex items-center justify-between gap-2">
                {/* Verification Vote Button */}
                <button
                  onClick={() => handleConfirm(item.id)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 ${
                    item.confirmedByMe
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-md'
                      : 'bg-navy-800 hover:bg-navy-750 text-slate-300 border-navy-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${item.confirmedByMe ? 'text-emerald-400 fill-emerald-400' : 'text-slate-400'}`} />
                  <span>
                    {item.confirmedByMe ? 'Confirmed Blocked' : t('confirm_blockage')} ({item.confirmations})
                  </span>
                </button>

                {/* View on Map */}
                <button
                  onClick={() => onViewHazardOnMap(item)}
                  className="py-2 px-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-blue-400 hover:text-blue-300 border border-navy-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Pin</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Modal */}
      <ReportRoadblockModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onReportCreated={onRefreshHazards}
      />
    </div>
  );
};
