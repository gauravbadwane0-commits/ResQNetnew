import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MessageSquare, Send, X, CheckCircle2, Share2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { generateEmergencySOSMessage } from '../../services/storageService';

interface SOSCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetNote?: string;
}

export const SOSCountdownModal: React.FC<SOSCountdownModalProps> = ({ isOpen, onClose, presetNote }) => {
  const { location } = useLocation();
  const { t } = useLanguage();
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [dispatched, setDispatched] = useState<boolean>(false);
  const [sosText, setSosText] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setDispatched(false);
      return;
    }

    const message = generateEmergencySOSMessage(
      location.lat,
      location.lng,
      location.cityName,
      presetNote
    );
    setSosText(message);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleExecuteDispatch(message);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, location, presetNote]);

  const handleExecuteDispatch = (customMessage?: string) => {
    const textToSend = customMessage || sosText;
    setDispatched(true);

    // Attempt Web Share first if available on mobile
    if (navigator.share) {
      navigator.share({
        title: 'EMERGENCY SOS - RESQNET',
        text: textToSend,
      }).catch(() => {
        // user dismissed share dialog or unsupported, fallback below
      });
    }

    // Auto open WhatsApp intent
    const encoded = encodeURIComponent(textToSend);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handleManualSMS = () => {
    const encoded = encodeURIComponent(sosText);
    window.location.href = `sms:?body=${encoded}`;
  };

  const handleManualWhatsApp = () => {
    const encoded = encodeURIComponent(sosText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  if (!isOpen) return null;

  const progressPct = ((5 - secondsLeft) / 5) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 border-2 border-red-500/80 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.5)]">
        {/* Header */}
        <div className="bg-red-600/20 border-b border-red-500/30 p-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/40 text-red-100 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/50">
            <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
            <span>Emergency Alert Protocol</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            {dispatched ? 'DISPATCH COMPLETED' : t('sos_countdown_title')}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-6">
          {!dispatched ? (
            <>
              {/* Circular Countdown Progress */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#1E293B"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#EF4444"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * progressPct) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{secondsLeft}</span>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
                    Seconds
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed px-2">
                {t('sos_countdown_desc')}
              </p>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => handleExecuteDispatch()}
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('sos_dispatch_now')}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 font-bold text-xs border border-navy-600 flex items-center justify-center gap-2 transition"
                >
                  <X className="w-4 h-4 text-slate-400" />
                  <span>{t('sos_cancel_button')}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Emergency Message Dispatched</h3>
                <p className="text-xs text-slate-300 mt-1">
                  GPS coordinates and medical ID shared. You can also re-trigger via SMS or WhatsApp below:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleManualWhatsApp}
                  className="py-3 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleManualSMS}
                  className="py-3 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span>Default SMS</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold"
              >
                Close Dialog
              </button>
            </div>
          )}

          {/* Constant 112 Safety Net */}
          <div className="pt-2 border-t border-navy-700/60">
            <a
              href="tel:112"
              className="w-full py-2.5 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4 text-red-400" />
              <span>Call 112 Immediately</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
