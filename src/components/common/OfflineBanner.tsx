import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { effectiveOnline, isSimulatedOffline, toggleSimulatedOffline } = useOffline();
  const { t } = useLanguage();

  if (effectiveOnline) return null;

  return (
    <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-200 px-3 py-2 text-xs flex items-center justify-between backdrop-blur-md sticky top-14 z-40 transition-all">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
        <span className="font-medium">
          {t('offline_banner')}
          {isSimulatedOffline && ' (Demo Simulated)'}
        </span>
      </div>
      {isSimulatedOffline && (
        <button
          onClick={toggleSimulatedOffline}
          className="ml-2 px-2 py-0.5 rounded bg-amber-500/30 hover:bg-amber-500/50 text-[10px] font-bold text-amber-100 uppercase"
        >
          Exit Demo
        </button>
      )}
    </div>
  );
};
