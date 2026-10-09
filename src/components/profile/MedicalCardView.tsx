import React, { useState } from 'react';
import { User, Heart, Shield, Plus, Trash2, Save, QrCode, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { MedicalCard, BloodGroup, EmergencyContact } from '../../types/emergency';
import { getStoredMedicalCard, saveStoredMedicalCard } from '../../services/storageService';
import { useLanguage } from '../../context/LanguageContext';

export const MedicalCardView: React.FC = () => {
  const { t } = useLanguage();
  const [card, setCard] = useState<MedicalCard>(() => getStoredMedicalCard());
  const [showQR, setShowQR] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredMedicalCard(card);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addContact = () => {
    setCard((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', relation: '', phone: '' }],
    }));
  };

  const removeContact = (index: number) => {
    setCard((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const updateContact = (index: number, field: keyof EmergencyContact, val: string) => {
    setCard((prev) => {
      const updated = [...prev.contacts];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, contacts: updated };
    });
  };

  // Compile paramedic QR Data String
  const qrString = `RESQNET_ICE|NAME:${card.fullName}|BLOOD:${card.bloodGroup}|AGE:${card.age}|ALLERGIES:${card.allergies}|MEDS:${card.medications}|COND:${card.chronicConditions}|ICE1:${card.contacts[0]?.name || ''}:${card.contacts[0]?.phone || ''}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrString)}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-900 border border-navy-700 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span>{t('medical_card_title')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('medical_card_note')}
          </p>
        </div>

        <button
          onClick={() => setShowQR(!showQR)}
          className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition ${
            showQR
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-navy-800 text-slate-200 border-navy-600 hover:bg-navy-750'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{showQR ? 'Edit Card' : 'Show QR'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Medical ID card updated securely on this device!</span>
        </div>
      )}

      {showQR ? (
        /* Paramedic Emergency QR Mode */
        <div className="p-6 rounded-3xl bg-navy-900 border-2 border-red-500/40 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Paramedic / First Responder Scan</span>
          </div>

          <div className="bg-white p-4 rounded-2xl w-60 h-60 mx-auto flex items-center justify-center shadow-lg border-4 border-slate-200">
            <img
              src={qrCodeUrl}
              alt="Medical Card QR"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-1 text-slate-300 text-xs">
            <div className="font-extrabold text-base text-white">{card.fullName} ({card.age} yrs)</div>
            <div className="text-red-400 font-bold text-sm">Blood Group: {card.bloodGroup}</div>
            {card.allergies && <div>Allergies: {card.allergies}</div>}
          </div>

          <div className="pt-2 border-t border-navy-700/60">
            <div className="text-xs text-slate-400 mb-2">Emergency Contacts (ICE):</div>
            <div className="space-y-2">
              {card.contacts.map((contact, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-between text-xs">
                  <div className="text-left">
                    <span className="font-bold text-white">{contact.name}</span>
                    <span className="text-slate-400 text-[11px] block">{contact.relation}</span>
                  </div>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold flex items-center gap-1 text-xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <form onSubmit={handleSave} className="space-y-4">
          {/* Identity & Blood */}
          <div className="p-4 rounded-2xl bg-navy-900 border border-navy-700 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={card.fullName}
                  onChange={(e) => setCard({ ...card, fullName: e.target.value })}
                  placeholder="Citizen Name"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  value={card.age}
                  onChange={(e) => setCard({ ...card, age: Number(e.target.value) || '' })}
                  placeholder="e.g. 28"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Blood Group Select */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t('blood_group')}
              </label>
              <div className="grid grid-cols-5 gap-1.5 text-xs">
                {bloodGroups.map((bg) => (
                  <button
                    type="button"
                    key={bg}
                    onClick={() => setCard({ ...card, bloodGroup: bg })}
                    className={`py-2 rounded-xl font-bold border transition ${
                      card.bloodGroup === bg
                        ? 'bg-red-600 text-white border-red-500 shadow-md'
                        : 'bg-navy-950 text-slate-400 border-navy-700 hover:border-navy-600'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Medical Notes */}
          <div className="p-4 rounded-2xl bg-navy-900 border border-navy-700 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t('allergies')}</label>
              <input
                type="text"
                value={card.allergies}
                onChange={(e) => setCard({ ...card, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t('medications')}</label>
              <input
                type="text"
                value={card.medications}
                onChange={(e) => setCard({ ...card, medications: e.target.value })}
                placeholder="e.g. Insulin, Blood Pressure pills, Inhaler"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t('chronic_conditions')}</label>
              <textarea
                value={card.chronicConditions}
                onChange={(e) => setCard({ ...card, chronicConditions: e.target.value })}
                placeholder="e.g. Diabetes Type 2, Asthma, Pacemaker implant..."
                rows={2}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Emergency Contacts (In Case of Emergency) */}
          <div className="p-4 rounded-2xl bg-navy-900 border border-navy-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                {t('emergency_contacts')}
              </label>
              <button
                type="button"
                onClick={addContact}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {card.contacts.map((contact, index) => (
                <div key={index} className="p-3 rounded-xl bg-navy-950 border border-navy-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Contact #{index + 1}</span>
                    {card.contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      placeholder="Contact Name"
                      className="bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                    <input
                      type="text"
                      value={contact.relation}
                      onChange={(e) => updateContact(index, 'relation', e.target.value)}
                      placeholder="Relation (e.g. Spouse)"
                      className="bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                    placeholder="+91 Phone Number"
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{t('save_medical_card')}</span>
          </button>
        </form>
      )}
    </div>
  );
};
