import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { OfflineProvider } from './context/OfflineContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { CitySelectorModal } from './components/common/CitySelectorModal';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { SOSButton } from './components/sos/SOSButton';
import { SOSCountdownModal } from './components/sos/SOSCountdownModal';
import { HelplinesList } from './components/sos/HelplinesList';
import { ClimateRiskCard } from './components/climate/ClimateRiskCard';
import { EmergencyMap } from './components/map/EmergencyMap';
import { HospitalsList } from './components/hospitals/HospitalsList';
import { RoadblocksFeed } from './components/reports/RoadblocksFeed';
import { MedicalCardView } from './components/profile/MedicalCardView';
import { getStoredRoadHazards } from './services/communityRoadblockService';
import { NavigationTab, Facility, RoadHazard } from './types/emergency';

const MainShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [selectedPresetNote, setSelectedPresetNote] = useState<string | undefined>(undefined);
  const [selectedFacilityForRoute, setSelectedFacilityForRoute] = useState<Facility | null>(null);
  const [roadHazards, setRoadHazards] = useState<RoadHazard[]>(() => getStoredRoadHazards());

  const handleRefreshHazards = () => {
    setRoadHazards(getStoredRoadHazards());
  };

  const handleTriggerSOS = (note?: string) => {
    setSelectedPresetNote(note);
    setShowSOSModal(true);
  };

  const handleSelectFacilityForDirections = (facility: Facility) => {
    setSelectedFacilityForRoute(facility);
    setCurrentTab('map');
  };

  const handleViewHazardOnMap = (hazard: RoadHazard) => {
    setCurrentTab('map');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Navbar onOpenLocationModal={() => setShowLocationModal(true)} />
      
      {/* Sticky Offline Banner */}
      <OfflineBanner />

      {/* Main Content Area - Mobile-First Constraint */}
      <main className="flex-1 max-w-md w-full mx-auto pb-24 px-3 pt-3">
        {/* TAB 1: SOS & Helplines (Home) */}
        {currentTab === 'home' && (
          <div className="space-y-4">
            <ClimateRiskCard />
            <SOSButton onTriggerSOS={handleTriggerSOS} />
            <HelplinesList />
          </div>
        )}

        {/* TAB 2: Live Map */}
        {currentTab === 'map' && (
          <EmergencyMap
            roadHazards={roadHazards}
            selectedFacilityForRoute={selectedFacilityForRoute}
            onClearSelectedFacility={() => setSelectedFacilityForRoute(null)}
          />
        )}

        {/* TAB 3: Hospitals */}
        {currentTab === 'hospitals' && (
          <HospitalsList
            onSelectFacilityForDirections={handleSelectFacilityForDirections}
          />
        )}

        {/* TAB 4: Roadblocks */}
        {currentTab === 'reports' && (
          <RoadblocksFeed
            hazards={roadHazards}
            onRefreshHazards={handleRefreshHazards}
            onViewHazardOnMap={handleViewHazardOnMap}
          />
        )}

        {/* TAB 5: Medical Card Profile */}
        {currentTab === 'profile' && (
          <MedicalCardView />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* PWA Home Screen Install Prompt */}
      <PWAInstallPrompt />

      {/* Location Picker Modal */}
      <CitySelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      {/* SOS 5-Second Cancel Countdown Modal */}
      <SOSCountdownModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        presetNote={selectedPresetNote}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <LocationProvider>
        <OfflineProvider>
          <MainShell />
        </OfflineProvider>
      </LocationProvider>
    </LanguageProvider>
  );
};

export default App;
