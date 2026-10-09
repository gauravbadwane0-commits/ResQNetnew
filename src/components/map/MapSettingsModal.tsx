import React, { useState } from 'react';
import { X, Key, Layers, Check, ExternalLink, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import {
  MapConfig,
  MapProviderId,
  MAP_PROVIDERS,
  getMapConfig,
  saveMapConfig,
} from '../../services/mapConfigService';

interface MapSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: (config: MapConfig) => void;
}

export const MapSettingsModal: React.FC<MapSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [config, setConfig] = useState<MapConfig>(() => getMapConfig());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedProvider = MAP_PROVIDERS.find((p) => p.id === config.provider) || MAP_PROVIDERS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMapConfig(config);
    onConfigChanged(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const handleSelectProvider = (id: MapProviderId) => {
    // If switching to Google or Mapbox, grab from env if current key is empty
    let newKey = config.apiKey;
    if (id === 'google') {
      newKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || config.apiKey;
    } else if (id === 'mapbox') {
      newKey = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string) || config.apiKey;
    }
    setConfig({ ...config, provider: id, apiKey: newKey });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 border-2 border-blue-500/50 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-blue-600/15 border-b border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-white text-base">
              Map API & Provider Settings
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
        <form onSubmit={handleSave} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Map configuration updated and active!</span>
            </div>
          )}

          {/* Provider Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Select Mapping Provider
            </label>
            <div className="space-y-1.5">
              {MAP_PROVIDERS.map((provider) => {
                const isSelected = config.provider === provider.id;

                return (
                  <button
                    type="button"
                    key={provider.id}
                    onClick={() => handleSelectProvider(provider.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md'
                        : 'bg-navy-950 text-slate-300 border-navy-800 hover:border-navy-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{provider.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            provider.requiresKey
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {provider.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {provider.description}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key Input */}
          {selectedProvider.requiresKey ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedProvider.name} API Key</span>
                </label>
                <a
                  href={selectedProvider.keyHelpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value.trim() })}
                placeholder={selectedProvider.keyPlaceholder}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required={selectedProvider.requiresKey}
              />
              <p className="text-[10px] text-slate-400 leading-snug">
                You can also define this in your <code className="text-amber-300 font-mono">.env</code> file as <code className="text-amber-300 font-mono">{selectedProvider.envVar}</code>.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>100% Free Fallback:</strong> OpenStreetMap and CartoDB dark tiles require zero API keys and work out of the box with offline tile caching.
              </span>
            </div>
          )}

          {/* Visual Style Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Tile Visual Theme
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(
                [
                  { id: 'dark', label: 'Dark Navy' },
                  { id: 'satellite', label: 'Satellite' },
                  { id: 'streets', label: 'Roadmap' },
                ] as const
              ).map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setConfig({ ...config, style: st.id })}
                  className={`py-2 rounded-xl font-bold uppercase text-[10px] border transition ${
                    config.style === st.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-navy-950 text-slate-400 border-navy-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/40 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
