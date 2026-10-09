import React, { useState } from 'react';
import { Phone, Search, Shield, Flame, Ambulance, HeartHandshake, LifeBuoy } from 'lucide-react';
import { INDIA_HELPLINES } from '../../data/helplines';
import { Helpline } from '../../types/emergency';
import { useLanguage } from '../../context/LanguageContext';

export const HelplinesList: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'national', label: 'National (112)' },
    { id: 'medical', label: 'Medical (108)' },
    { id: 'fire', label: 'Fire & Rescue (101)' },
    { id: 'disaster', label: 'NDRF Disaster' },
    { id: 'women', label: 'Women Helplines' },
  ];

  const getCategoryIcon = (category: Helpline['category']) => {
    switch (category) {
      case 'national': return <Shield className="w-4 h-4 text-red-400" />;
      case 'fire': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'medical': return <Ambulance className="w-4 h-4 text-cyan-400" />;
      case 'women': return <HeartHandshake className="w-4 h-4 text-pink-400" />;
      case 'disaster': return <LifeBuoy className="w-4 h-4 text-amber-400" />;
      default: return <Phone className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredHelplines = INDIA_HELPLINES.filter((h) => {
    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesSearch =
      h.number.includes(search) ||
      h.defaultName.toLowerCase().includes(search.toLowerCase()) ||
      h.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-3 pt-4 border-t border-navy-800">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-2">
          <Phone className="w-4 h-4 text-red-400" />
          <span>India Emergency Helplines (Offline 24x7)</span>
        </h3>
        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          No Net Required
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search helpline or dial number (112, 108, NDRF)..."
          className="w-full bg-navy-900 border border-navy-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
              selectedCategory === c.id
                ? 'bg-red-600 text-white font-bold shadow'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-700/80'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Helplines List */}
      <div className="space-y-2">
        {filteredHelplines.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border flex items-center justify-between transition ${
              item.primary
                ? 'bg-navy-800/90 border-red-500/30 hover:border-red-500/60'
                : 'bg-navy-900/80 border-navy-700/70 hover:border-navy-600'
            }`}
          >
            <div className="flex items-start gap-2.5 pr-2">
              <div className="mt-0.5 p-1.5 rounded-lg bg-navy-950 border border-navy-700">
                {getCategoryIcon(item.category)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{item.defaultName}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-navy-700 text-slate-300 font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {item.description}
                </div>
              </div>
            </div>

            <a
              href={`tel:${item.number}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-md shadow-red-900/30 transition flex-shrink-0 active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{item.number}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
