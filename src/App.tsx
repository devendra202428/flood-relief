/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Family, Distribution, KitTypeInfo, ActiveTab } from './types';
import { loadStoredData, saveStoredData, generateFamilyId, computeMissingHashes, StorageData } from './utils/storage';
import { exportFamiliesToCSV, exportDistributionsToCSV } from './utils/export';
import { INITIAL_FAMILIES, INITIAL_DISTRIBUTIONS, INITIAL_KITS } from './data/initialData';
import {
  seedInitialFirestoreDataIfEmpty,
  subscribeToFamilies,
  subscribeToDistributions,
  subscribeToKits,
  saveFamilyToCloud,
  deleteFamilyFromCloud,
  saveDistributionToCloud,
  deleteDistributionFromCloud,
  saveKitStockToCloud,
  resetCloudDataToSample,
  clearAllRecordsAndDemoData,
} from './services/reliefCloudService';

function getNextIdNumber(families: Family[]): number {
  let maxNum = 0;
  for (const fam of families) {
    const match = fam.id.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return maxNum + 1;
}

import { DashboardView } from './components/DashboardView';
import { RegisterView } from './components/RegisterView';
import { DistributeView } from './components/DistributeView';
import { SearchView } from './components/SearchView';
import { RecordsView } from './components/RecordsView';
import { FamilyDetailsModal } from './components/FamilyDetailsModal';
import { ReliefSlipModal } from './components/ReliefSlipModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useTranslation } from './i18n/LanguageContext';

import {
  LayoutDashboard,
  UserPlus,
  PackageCheck,
  Search,
  FileSpreadsheet,
  HeartHandshake,
  Check,
  Cloud,
  Languages,
} from 'lucide-react';

export default function App() {
  const { language, setLanguage, t } = useTranslation();
  const [data, setData] = useState<StorageData>(() => loadStoredData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(true);

  // Pre-selected family when navigating from search or register to distribute
  const [distributeTargetFamily, setDistributeTargetFamily] = useState<Family | null>(null);

  // Modals state
  const [selectedFamilyForModal, setSelectedFamilyForModal] = useState<Family | null>(null);
  const [slipModalTarget, setSlipModalTarget] = useState<{
    family: Family;
    distribution?: Distribution;
  } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Compute perceptual hashes for initial seed houses if missing
  useEffect(() => {
    const hasMissingHashes = data.families.some(
      (f) => f.houseImage && !f.houseImageHash
    );
    if (hasMissingHashes) {
      computeMissingHashes(data.families).then((updatedFamilies) => {
        setData((prev) => ({
          ...prev,
          families: updatedFamilies,
        }));
      });
    }
  }, []);

  // Connect real-time Firestore listeners for 50k+ cloud scale
  useEffect(() => {
    seedInitialFirestoreDataIfEmpty();

    const unsubFamilies = subscribeToFamilies((cloudFamilies) => {
      setData((prev) => {
        const nextId = cloudFamilies.length > 0 ? Math.max(prev.nextIdNumber, getNextIdNumber(cloudFamilies)) : 1;
        const updated = {
          ...prev,
          families: cloudFamilies,
          nextIdNumber: nextId,
        };
        saveStoredData(updated);
        return updated;
      });
      setIsCloudSyncing(false);
    });

    const unsubDists = subscribeToDistributions((cloudDists) => {
      setData((prev) => {
        const updated = {
          ...prev,
          distributions: cloudDists,
        };
        saveStoredData(updated);
        return updated;
      });
    });

    const unsubKits = subscribeToKits((cloudKits) => {
      if (cloudKits.length > 0) {
        setData((prev) => {
          const updated = {
            ...prev,
            kits: cloudKits,
          };
          saveStoredData(updated);
          return updated;
        });
      }
    });

    return () => {
      unsubFamilies();
      unsubDists();
      unsubKits();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Register family handler - saves to Cloud so all connected screens update instantly
  const handleRegisterFamily = async (family: Family) => {
    // 1. Optimistic local update
    setData((prev) => {
      const updatedFamilies = [family, ...prev.families.filter((f) => f.id !== family.id)];
      return {
        ...prev,
        families: updatedFamilies,
        nextIdNumber: Math.max(prev.nextIdNumber, getNextIdNumber(updatedFamilies)),
      };
    });

    // 2. Real-time Cloud Save
    try {
      await saveFamilyToCloud(family);
      showToast(`Household ${family.id} registered & synced live across all screens.`);
    } catch (err: any) {
      console.error('Failed to sync family to cloud:', err);
      showToast(`Warning: Cloud sync error (${err.message || 'offline'}). Data saved locally.`);
    }
  };

  // Record distribution handler - saves to Cloud so all screens update stock & ledger
  const handleRecordDistribution = async (distribution: Distribution) => {
    // 1. Optimistic local update
    setData((prev) => {
      const updatedDistributions = [distribution, ...prev.distributions.filter((d) => d.id !== distribution.id)];
      return {
        ...prev,
        distributions: updatedDistributions,
      };
    });

    // 2. Real-time Cloud Save
    try {
      await saveDistributionToCloud(distribution);
      showToast(`Ration handover logged for ${distribution.familyName} & synced live.`);
    } catch (err: any) {
      console.error('Failed to sync distribution to cloud:', err);
      showToast(`Warning: Cloud sync error (${err.message || 'offline'}). Handover saved locally.`);
    }
  };

  // Stock update handler
  const handleUpdateKitStock = async (kitId: string, newStock: number) => {
    setData((prev) => ({
      ...prev,
      kits: prev.kits.map((k) => (k.id === kitId ? { ...k, totalStock: newStock } : k)),
    }));
    try {
      await saveKitStockToCloud(kitId, newStock);
      showToast('Inventory stock updated & synced live across screens.');
    } catch (err: any) {
      console.error('Failed to update stock in cloud:', err);
      showToast('Warning: Cloud stock sync issue. Saved locally.');
    }
  };

  // Reset data handler - resets Firestore so both screens sync back together
  const handleResetData = async () => {
    const isHi = language === 'hi';
    const msg = isHi
      ? 'क्या आप परीक्षण व डेमो के लिए प्रारंभिक 5 नमूना परिवार व वितरण डेटा दोबारा लोड करना चाहते हैं?'
      : 'Reset all FloodRelief records and reload initial sample field data? This will sync across all connected screens.';
    if (window.confirm(msg)) {
      try {
        setIsCloudSyncing(true);
        await resetCloudDataToSample();
        const resetState: StorageData = {
          families: INITIAL_FAMILIES,
          distributions: INITIAL_DISTRIBUTIONS,
          kits: INITIAL_KITS,
          nextIdNumber: getNextIdNumber(INITIAL_FAMILIES),
        };
        setData(resetState);
        saveStoredData(resetState);
        showToast(
          isHi
            ? 'प्रारंभिक 5 डेमो परिवार सफलतापूर्वक रीस्टोर कर दिए गए।'
            : 'Sample emergency relief database restored & synced across all screens.'
        );
      } catch (err: any) {
        console.error('Reset error:', err);
        showToast('Failed to reset cloud database: ' + (err.message || 'Network error'));
      } finally {
        setIsCloudSyncing(false);
      }
    }
  };

  // Clear all demo data handler - wipes sample data for fresh real-world operations
  const handleClearAllData = async () => {
    const isHi = language === 'hi';
    const confirmMsg = isHi
      ? 'क्या आप सभी डेमो परिवार (FL-001 से FL-005) और वितरण रिकॉर्ड हटाकर शून्य से वास्तविक राहत कार्य शुरू करना चाहते हैं? यह क्लाउड और दोनों स्क्रीनों से डेटा हटा देगा।'
      : 'Remove all demo sample households and mock distributions from Cloud Firestore & local cache? This will start fresh with 0 records starting at FL-001.';

    if (window.confirm(confirmMsg)) {
      try {
        setIsCloudSyncing(true);
        await clearAllRecordsAndDemoData();
        const emptyState: StorageData = {
          families: [],
          distributions: [],
          kits: data.kits.length > 0 ? data.kits : INITIAL_KITS,
          nextIdNumber: 1,
        };
        setData(emptyState);
        saveStoredData(emptyState);
        showToast(
          isHi
            ? 'सभी डेमो रिकॉर्ड हटा दिए गए। FL-001 से वास्तविक पंजीकरण के लिए तैयार।'
            : 'All demo records removed. Ready for live operations starting from FL-001.'
        );
      } catch (err: any) {
        console.error('Clear demo data error:', err);
        showToast('Failed to clear records: ' + (err.message || 'Error'));
      } finally {
        setIsCloudSyncing(false);
      }
    }
  };

  // Delete individual household handler
  const handleDeleteFamily = async (familyId: string) => {
    const isHi = language === 'hi';
    const target = data.families.find((f) => f.id === familyId);
    const name = target ? target.name : familyId;
    const confirmMsg = isHi
      ? `क्या आप परिवार ${familyId} (${name}) का रिकॉर्ड हटाना चाहते हैं?`
      : `Delete household ${familyId} (${name})? This will remove them from the cloud database.`;

    if (window.confirm(confirmMsg)) {
      try {
        setIsCloudSyncing(true);
        setData((prev) => {
          const updatedFamilies = prev.families.filter((f) => f.id !== familyId);
          const updatedDistributions = prev.distributions.filter((d) => d.familyId !== familyId);
          const updated = {
            ...prev,
            families: updatedFamilies,
            distributions: updatedDistributions,
          };
          saveStoredData(updated);
          return updated;
        });
        await deleteFamilyFromCloud(familyId);
        showToast(isHi ? `परिवार ${familyId} हटा दिया गया।` : `Household ${familyId} deleted & synced.`);
      } catch (err: any) {
        console.error('Failed to delete family:', err);
        showToast('Error deleting family: ' + (err.message || 'Cloud error'));
      } finally {
        setIsCloudSyncing(false);
      }
    }
  };

  // Delete individual distribution ledger entry handler
  const handleDeleteDistribution = async (distId: string) => {
    const isHi = language === 'hi';
    const confirmMsg = isHi
      ? `क्या आप वितरण रिकॉर्ड ${distId} को हटाना चाहते हैं?`
      : `Delete distribution record ${distId}?`;

    if (window.confirm(confirmMsg)) {
      try {
        setIsCloudSyncing(true);
        setData((prev) => {
          const updated = {
            ...prev,
            distributions: prev.distributions.filter((d) => d.id !== distId),
          };
          saveStoredData(updated);
          return updated;
        });
        await deleteDistributionFromCloud(distId);
        showToast(isHi ? `वितरण रिकॉर्ड ${distId} हटा दिया गया।` : `Distribution ${distId} deleted.`);
      } catch (err: any) {
        console.error('Failed to delete distribution:', err);
        showToast('Error deleting distribution: ' + (err.message || 'Cloud error'));
      } finally {
        setIsCloudSyncing(false);
      }
    }
  };

  // Navigation shortcuts
  const handleGoToDistribute = (family: Family) => {
    setDistributeTargetFamily(family);
    setActiveTab('distribute');
  };

  const handlePrintSlip = (family: Family, dist?: Distribution) => {
    setSlipModalTarget({ family, distribution: dist });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: Single text element wordmark
        Zone 2: 4-5 concise single-line text nav links
        Zone 3: 1 primary action button
      */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 md:gap-8 no-print">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
            FL
          </span>
          <span>{t.appTitle}</span>
        </button>

        {/* Zone 2: Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              activeTab === 'dashboard' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            {t.dashboard}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              activeTab === 'register' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            {t.register}
          </button>
          <button
            onClick={() => setActiveTab('distribute')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              activeTab === 'distribute' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            {t.distribute}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              activeTab === 'search' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            {t.search}
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              activeTab === 'records' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            {t.records}
          </button>
        </nav>

        {/* Zone 3: Language Selector + Status + Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Language Switcher Button (English / हिन्दी) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              <span>EN</span>
              <span className="hidden xl:inline text-[11px] font-normal">English</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                language === 'hi'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिन्दी में बदलें"
            >
              <span>हिन्दी</span>
            </button>
          </div>

          {/* PWA Install on Phone Button */}
          <PWAInstallButton />

          {/* Live Cloud Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-medium shrink-0">
            <span className={`w-2 h-2 rounded-full ${isCloudSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
            <Cloud className={`w-3.5 h-3.5 ${isCloudSyncing ? 'text-amber-600' : 'text-emerald-600'}`} />
            <span className="text-[11px] font-sans font-semibold">
              {isCloudSyncing ? t.cloudSyncing : t.cloudLive}
            </span>
          </div>

          <button
            onClick={() => {
              setDistributeTargetFamily(null);
              setActiveTab('distribute');
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            {t.quickDispatch}
          </button>
        </div>
      </header>

      {/* Secondary Mobile Nav Tabs */}
      <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-around text-xs font-medium text-slate-600 no-print overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md ${
            activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : ''
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>{t.dashboard}</span>
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md ${
            activeTab === 'register' ? 'bg-blue-50 text-blue-600 font-bold' : ''
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{t.register}</span>
        </button>
        <button
          onClick={() => setActiveTab('distribute')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md ${
            activeTab === 'distribute' ? 'bg-blue-50 text-blue-600 font-bold' : ''
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5" />
          <span>{t.distribute}</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md ${
            activeTab === 'search' ? 'bg-blue-50 text-blue-600 font-bold' : ''
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>{t.search}</span>
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md ${
            activeTab === 'records' ? 'bg-blue-50 text-blue-600 font-bold' : ''
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>{t.records}</span>
        </button>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            families={data.families}
            distributions={data.distributions}
            kits={data.kits}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectFamily={(f) => setSelectedFamilyForModal(f)}
            onPrintSlip={(f, dist) => handlePrintSlip(f, dist)}
            onExportCSV={() => exportFamiliesToCSV(data.families, data.distributions)}
          />
        )}

        {activeTab === 'register' && (
          <RegisterView
            nextId={generateFamilyId(data.nextIdNumber)}
            existingFamilies={data.families}
            onRegister={handleRegisterFamily}
            onGoToDistribute={handleGoToDistribute}
            onPrintSlip={(f) => handlePrintSlip(f)}
          />
        )}

        {activeTab === 'distribute' && (
          <DistributeView
            families={data.families}
            distributions={data.distributions}
            kits={data.kits}
            preselectedFamily={distributeTargetFamily}
            onRecordDistribution={handleRecordDistribution}
            onPrintSlip={(f, dist) => handlePrintSlip(f, dist)}
            onClearPreselectedFamily={() => setDistributeTargetFamily(null)}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            families={data.families}
            distributions={data.distributions}
            onSelectFamily={(f) => setSelectedFamilyForModal(f)}
            onGoToDistribute={handleGoToDistribute}
            onPrintSlip={(f) => handlePrintSlip(f)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'records' && (
          <RecordsView
            families={data.families}
            distributions={data.distributions}
            kits={data.kits}
            onSelectFamily={(f) => setSelectedFamilyForModal(f)}
            onPrintSlip={(f, dist) => handlePrintSlip(f, dist)}
            onExportFamiliesCSV={() => exportFamiliesToCSV(data.families, data.distributions)}
            onExportDistributionsCSV={() => exportDistributionsToCSV(data.distributions)}
            onDeleteFamily={handleDeleteFamily}
            onDeleteDistribution={handleDeleteDistribution}
            onUpdateKitStock={handleUpdateKitStock}
          />
        )}
      </main>

      {/* Modals */}
      {selectedFamilyForModal && (
        <FamilyDetailsModal
          family={selectedFamilyForModal}
          distributions={data.distributions}
          onClose={() => setSelectedFamilyForModal(null)}
          onQuickDistribute={handleGoToDistribute}
          onPrintSlip={handlePrintSlip}
          onDeleteFamily={handleDeleteFamily}
        />
      )}

      {slipModalTarget && (
        <ReliefSlipModal
          family={slipModalTarget.family}
          distribution={slipModalTarget.distribution}
          onClose={() => setSlipModalTarget(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in no-print">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">{t.footerHub}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'hi' ? 'आपदा राहत एवं राशन वितरण' : 'Disaster Relief & Aid Management'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {t.footerLocalNotice}
          </p>
        </div>
      </footer>
    </div>
  );
}
