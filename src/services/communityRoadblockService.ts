import { RoadHazard, HazardType } from '../types/emergency';

const HAZARDS_STORAGE_KEY = 'resqnet_community_hazards_v1';

// Initial realistic community reports for demonstration
const INITIAL_HAZARDS: RoadHazard[] = [
  {
    id: 'rh-1',
    type: 'waterlogged_underpass',
    title: 'Submerged Milan Subway Underpass',
    description: 'Over 3.5 feet standing water. Small cars and bikes stalling. Traffic diverted.',
    location: {
      lat: 19.0830,
      lng: 72.8420,
      address: 'Milan Subway, Santacruz West, Mumbai',
    },
    reportedAt: Date.now() - 3600000 * 1.5,
    expiresAt: Date.now() + 3600000 * 2.5,
    confirmations: 18,
    confirmedByMe: false,
    severity: 'critical',
  },
  {
    id: 'rh-2',
    type: 'tree_fallen',
    title: 'Uprooted Gulmohar Tree on Western Expressway',
    description: 'Two lanes blocked near domestic airport flyover. Fire brigade on scene.',
    location: {
      lat: 19.0910,
      lng: 72.8530,
      address: 'WEH Near Vile Parle, Mumbai',
    },
    reportedAt: Date.now() - 3600000 * 2,
    expiresAt: Date.now() + 3600000 * 2,
    confirmations: 9,
    confirmedByMe: false,
    severity: 'moderate',
  },
  {
    id: 'rh-3',
    type: 'bridge_submerged',
    title: 'Mithi River Basin Spillover at LBS Marg',
    description: 'River water touching road level. Heavy current. Avoid crossing on foot.',
    location: {
      lat: 19.0650,
      lng: 72.8790,
      address: 'LBS Marg, Kurla West, Mumbai',
    },
    reportedAt: Date.now() - 1800000,
    expiresAt: Date.now() + 3600000 * 3.5,
    confirmations: 24,
    confirmedByMe: true,
    severity: 'critical',
  },
];

export const getStoredRoadHazards = (): RoadHazard[] => {
  try {
    const raw = localStorage.getItem(HAZARDS_STORAGE_KEY);
    if (raw) {
      const parsed: RoadHazard[] = JSON.parse(raw);
      const now = Date.now();
      // Filter out hazards that have naturally expired (4-hour window)
      const valid = parsed.filter((h) => h.expiresAt > now);
      if (valid.length > 0) return valid;
    }
  } catch (e) {
    console.warn('Error reading stored hazards:', e);
  }

  // Store initial defaults if none exist
  saveStoredRoadHazards(INITIAL_HAZARDS);
  return INITIAL_HAZARDS;
};

export const saveStoredRoadHazards = (hazards: RoadHazard[]): void => {
  try {
    localStorage.setItem(HAZARDS_STORAGE_KEY, JSON.stringify(hazards));
  } catch (e) {
    console.error('Error saving hazards:', e);
  }
};

export const addCommunityRoadHazard = (
  type: HazardType,
  title: string,
  description: string,
  lat: number,
  lng: number,
  address: string,
  severity: 'low' | 'moderate' | 'critical'
): RoadHazard => {
  const current = getStoredRoadHazards();
  const now = Date.now();

  const newHazard: RoadHazard = {
    id: `hazard-${now}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    title,
    description,
    location: {
      lat,
      lng,
      address,
    },
    reportedAt: now,
    expiresAt: now + 3600000 * 4, // 4-hour automatic expiration
    confirmations: 1,
    confirmedByMe: true,
    severity,
  };

  const updated = [newHazard, ...current];
  saveStoredRoadHazards(updated);
  return newHazard;
};

export const confirmRoadHazard = (id: string): RoadHazard[] => {
  const current = getStoredRoadHazards();
  const updated = current.map((h) => {
    if (h.id === id) {
      const alreadyConfirmed = h.confirmedByMe;
      return {
        ...h,
        confirmations: alreadyConfirmed ? h.confirmations - 1 : h.confirmations + 1,
        confirmedByMe: !alreadyConfirmed,
        // Extend expiration by 1 hour on positive verification
        expiresAt: !alreadyConfirmed ? h.expiresAt + 3600000 : h.expiresAt,
      };
    }
    return h;
  });

  saveStoredRoadHazards(updated);
  return updated;
};
