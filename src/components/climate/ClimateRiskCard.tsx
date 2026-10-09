import React, { useState, useEffect } from 'react';
import { CloudRain, AlertTriangle, ShieldCheck, Volume2, VolumeX, RefreshCw, Droplets, Thermometer, Info } from 'lucide-react';
import { ClimateRiskData } from '../../types/emergency';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchClimateRiskData } from '../../services/openMeteoService';
import { voiceSynthesizer } from '../../utils/voiceSynthesis';

export const ClimateRiskCard: React.FC = () => {
  const { location } = useLocation();
  const { language, t } = useLanguage();
  const [climate, setClimate] = useState<ClimateRiskData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const loadData = () => {
    setLoading(true);
    fetchClimateRiskData(location.lat, location.lng)
      .then((data) => {
        setClimate(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [location.lat, location.lng]);

  const toggleSpeak = () => {
    if (isSpeaking) {
      voiceSynthesizer.stop();
      setIsSpeaking(false);
    } else {
      if (!climate) return;
      const textToRead = `${climate.advisoryTitle}. ${climate.advisoryText}. 24-hour rainfall expected: ${climate.accumulatedRain24h} millimeters.`;
      setIsSpeaking(true);
      voiceSynthesizer.speak(textToRead, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  if (!climate && loading) {
    return (
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-700 animate-pulse text-center space-y-2">
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Querying Open-Meteo flood & rainfall sensors...</p>
      </div>
    );
  }

  if (!climate) return null;

  const isHigh = climate.level === 'HIGH';
  const isMed = climate.level === 'MEDIUM';

  const badgeColor = isHigh
    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
    : isMed
    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40'
    : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40';

  const cardBorder = isHigh
    ? 'border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
    : isMed
    ? 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
    : 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]';

  return (
    <div className={`p-4 rounded-3xl bg-navy-900/95 border-2 ${cardBorder} space-y-4 backdrop-blur-md`}>
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-blue-400" />
          <h3 className="font-extrabold text-sm text-white tracking-wide">
            {t('climate_title')}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Read Aloud Button */}
          <button
            onClick={toggleSpeak}
            title={isSpeaking ? "Stop Voice Alert" : "Read Voice Alert (Text to Speech)"}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              isSpeaking
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[10px]">Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px]">{t('read_aloud')}</span>
              </>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={loadData}
            disabled={loading}
            className="p-1.5 rounded-xl bg-navy-800 text-slate-400 hover:text-white border border-navy-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Flood Risk Status Badge */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950 border border-navy-800">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Hydro-meteorological Triage
          </span>
          <div className="text-base font-black text-white mt-0.5">
            {isHigh ? t('risk_high') : isMed ? t('risk_medium') : t('risk_low')}
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${badgeColor}`}>
          {isHigh ? (
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          ) : isMed ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          <span>{climate.level}</span>
        </div>
      </div>

      {/* Rainfall Metrics Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>{t('rain_next_24h')}</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">
            {climate.accumulatedRain24h} <span className="text-xs text-slate-400 font-normal">mm</span>
          </div>
          <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isHigh ? 'bg-red-500' : isMed ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (climate.accumulatedRain24h / 80) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>{t('rain_next_72h')}</span>
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">
            {climate.accumulatedRain72h} <span className="text-xs text-slate-400 font-normal">mm</span>
          </div>
          <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isHigh ? 'bg-red-500' : isMed ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (climate.accumulatedRain72h / 140) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hourly Rainfall Mini Bar Chart */}
      {climate.forecast && climate.forecast.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Precipitation Intensity Timeline (Next 16 Hours)
          </div>
          <div className="flex items-end justify-between gap-1.5 h-16 pt-3 px-1 bg-navy-950/60 rounded-xl border border-navy-800/80">
            {climate.forecast.map((item, idx) => {
              const maxRain = 10;
              const barHeightPct = Math.min(100, Math.max(12, (item.precipitationMm / maxRain) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-end justify-center h-9">
                    <div
                      className={`w-full max-w-[14px] rounded-t transition-all ${
                        item.precipitationMm > 4
                          ? 'bg-red-500 group-hover:bg-red-400'
                          : item.precipitationMm > 1.5
                          ? 'bg-cyan-500 group-hover:bg-cyan-400'
                          : 'bg-slate-600 group-hover:bg-slate-500'
                      }`}
                      style={{ height: `${barHeightPct}%` }}
                      title={`${item.precipitationMm} mm at ${item.time}`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono truncate">
                    {item.time.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actionable Civil Safety Advisory */}
      <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 flex items-start gap-2.5 text-xs">
        <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}`} />
        <div>
          <div className="font-extrabold text-white text-[11px] leading-snug">
            {climate.advisoryTitle}
          </div>
          <div className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
            {climate.advisoryText}
          </div>
        </div>
      </div>
    </div>
  );
};
