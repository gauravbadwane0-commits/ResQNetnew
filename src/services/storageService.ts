import { MedicalCard } from '../types/emergency';

const MEDICAL_CARD_KEY = 'resqnet_medical_card_v1';

export const DEFAULT_MEDICAL_CARD: MedicalCard = {
  fullName: 'Aarav Sharma',
  age: 28,
  bloodGroup: 'O+',
  allergies: 'Penicillin, Dust Asthmatic',
  medications: 'Inhaler (Salbutamol) as needed',
  chronicConditions: 'Mild Asthma',
  organDonor: true,
  contacts: [
    { name: 'Priya Sharma (Spouse)', relation: 'Spouse', phone: '+91 98765 43210' },
    { name: 'Dr. R. K. Mehta', relation: 'Family Physician', phone: '+91 98220 12345' },
  ],
};

export const getStoredMedicalCard = (): MedicalCard => {
  try {
    const raw = localStorage.getItem(MEDICAL_CARD_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse stored medical card:', e);
  }
  return DEFAULT_MEDICAL_CARD;
};

export const saveStoredMedicalCard = (card: MedicalCard): void => {
  try {
    localStorage.setItem(MEDICAL_CARD_KEY, JSON.stringify(card));
  } catch (e) {
    console.error('Failed to save medical card:', e);
  }
};

export const generateEmergencySOSMessage = (
  lat: number,
  lng: number,
  address: string,
  customNote?: string
): string => {
  const card = getStoredMedicalCard();
  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const lines = [
    `🚨 *EMERGENCY SOS - RESQNET NETWORK* 🚨`,
    `⚠️ URGENT ASSISTANCE REQUIRED!`,
    ``,
    `📍 *Live GPS Pin:* ${mapsUrl}`,
    `📌 *Coordinates:* ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    `🗺️ *Area:* ${address || 'India Disaster Sector'}`,
    `🕒 *Time:* ${timestamp} IST`,
    ``,
    customNote ? `📝 *Situation:* ${customNote}\n` : '',
    `🩸 *Medical ID Card:*`,
    `• Name: ${card.fullName || 'Citizen'} (${card.age ? `${card.age} yrs` : 'Adult'})`,
    `• Blood Group: ${card.bloodGroup}`,
    card.allergies ? `• Allergies: ${card.allergies}` : '',
    card.medications ? `• Critical Meds: ${card.medications}` : '',
    card.chronicConditions ? `• Medical Condition: ${card.chronicConditions}` : '',
    ``,
    `📞 *Primary ICE Contact:* ${card.contacts[0]?.name || 'Relative'} (${card.contacts[0]?.phone || 'None'})`,
    ``,
    `Sent via RESQNET Climate Aware Emergency Network (HC-05)`,
  ];

  return lines.filter(Boolean).join('\n');
};
