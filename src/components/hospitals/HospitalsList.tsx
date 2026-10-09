import React, { useState, useEffect } from 'react';
import { Search, Building2, Phone, Navigation, ShieldCheck, HeartPulse, Tent, Filter, ExternalLink } from 'lucide-react';
import { Facility } from '../../types/emergency';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchHealthcareFacilities } from '../../services/overpassService';
import { formatDistance } from '../../utils/geoDistance';

interface HospitalsListProps {
  onSelectFacilityForDirections: (facility: Facility) => void;
}

export const HospitalsList: React.FC<HospitalsListProps> = ({ onSelectFacilityForDirections }) => {
  const { location } = useLocation();
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'hospital' | 'clinic' | 'shelter'>('all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchHealthcareFacilities(location.lat, location.lng)
      .then((data) => {
        if (mounted) {
          setFacilities(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Error fetching facilities:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [location.lat, location.lng]);

  const filtered = facilities.filter((f) => {
    const matchesType = filterType === 'all' || f.type === filterType;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.address.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>{t('nearby_facilities')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by nearest driving & walking distance
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          {filtered.length} Facilities Found
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hospital name, clinic or area..."
          className="w-full bg-navy-900 border border-navy-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'all'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          All Facilities ({facilities.length})
        </button>

        <button
          onClick={() => setFilterType('hospital')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'hospital'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          🏥 Hospitals (24x7)
        </button>

        <button
          onClick={() => setFilterType('clinic')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'clinic'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          🩺 Clinics & PHCs
        </button>

        <button
          onClick={() => setFilterType('shelter')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterType === 'shelter'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
          }`}
        >
          ⛺ Relief Camps
        </button>
      </div>

      {/* Facility Cards */}
      {loading ? (
        <div className="p-8 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Discovering healthcare facilities via Overpass...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-navy-900/50 border border-navy-800 space-y-2">
          <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">No medical facilities found for this query.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => {
            const isHospital = item.type === 'hospital';
            const isClinic = item.type === 'clinic';

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-700/80 hover:border-cyan-500/40 transition space-y-2.5 shadow-md"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          isHospital
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isClinic
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isHospital ? '24x7 Hospital' : isClinic ? 'Clinic / PHC' : 'Disaster Relief Shelter'}
                      </span>
                      {item.traumaCenter && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/60">
                          Trauma Care
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm text-white pt-0.5 leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-1 rounded-lg block font-mono">
                      {formatDistance(item.distanceKm)}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <p className="text-[11px] text-slate-400 leading-snug">
                  {item.address}
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-navy-800">
                  <a
                    href={`tel:${item.phone || '108'}`}
                    className="py-2.5 px-3 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    <span>{t('call_now')}</span>
                  </a>

                  <button
                    onClick={() => onSelectFacilityForDirections(item)}
                    className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-900/40 active:scale-95 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t('get_directions')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
