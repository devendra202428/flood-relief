import React, { useState, useEffect } from 'react';
import { Family, Distribution, KitTypeInfo } from '../types';
import { RELIEF_ROUNDS } from '../data/initialData';
import { useTranslation } from '../i18n/LanguageContext';
import { PackageCheck, Search, AlertTriangle, CheckCircle, Printer, ArrowRight, UserCheck } from 'lucide-react';

interface Props {
  families: Family[];
  distributions: Distribution[];
  kits: KitTypeInfo[];
  preselectedFamily?: Family | null;
  onRecordDistribution: (distribution: Distribution) => void;
  onPrintSlip: (family: Family, dist: Distribution) => void;
  onClearPreselectedFamily?: () => void;
}

export const DistributeView: React.FC<Props> = ({
  families,
  distributions,
  kits,
  preselectedFamily,
  onRecordDistribution,
  onPrintSlip,
  onClearPreselectedFamily,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(preselectedFamily || null);
  const [kitType, setKitType] = useState(kits[0]?.name || 'Food Ration Kit (7-day)');
  const [quantity, setQuantity] = useState<number>(1);
  const [round, setRound] = useState(RELIEF_ROUNDS[0]);
  const [distributionDate, setDistributionDate] = useState(new Date().toISOString().slice(0, 10));
  const [officerName, setOfficerName] = useState('Officer In-Charge');
  const [isDuplicateOverrideConfirmed, setIsDuplicateOverrideConfirmed] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [lastRecordedDist, setLastRecordedDist] = useState<Distribution | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (preselectedFamily) {
      setSelectedFamily(preselectedFamily);
      setSearchQuery(`${preselectedFamily.name} (${preselectedFamily.id})`);
    }
  }, [preselectedFamily]);

  // Autocomplete matching
  const query = searchQuery.trim().toLowerCase();
  const searchMatches = query
    ? families.filter(
        (f) =>
          f.id.toLowerCase().includes(query) ||
          f.name.toLowerCase().includes(query) ||
          f.phone.includes(query) ||
          (f.electricityBillNo && f.electricityBillNo.includes(query)) ||
          f.village.toLowerCase().includes(query)
      ).slice(0, 5)
    : [];

  // Check if selected family has already received in this round
  const existingRoundDistributions = selectedFamily
    ? distributions.filter(
        (d) =>
          d.familyId === selectedFamily.id &&
          d.round.trim().toLowerCase() === round.trim().toLowerCase()
      )
    : [];

  const isDuplicateInRound = existingRoundDistributions.length > 0;

  // Selected kit details
  const currentKitInfo = kits.find((k) => k.name === kitType);

  const handleSelectFamily = (family: Family) => {
    setSelectedFamily(family);
    setSearchQuery(`${family.name} (${family.id})`);
    setIsDuplicateOverrideConfirmed(false);
    setOverrideReason('');
    setFormError('');
  };

  const handleClearSelectedFamily = () => {
    setSelectedFamily(null);
    setSearchQuery('');
    setIsDuplicateOverrideConfirmed(false);
    setOverrideReason('');
    if (onClearPreselectedFamily) {
      onClearPreselectedFamily();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedFamily) {
      setFormError('Please select a registered household first.');
      return;
    }

    if (quantity < 1) {
      setFormError('Quantity must be at least 1.');
      return;
    }

    if (isDuplicateInRound && !isDuplicateOverrideConfirmed) {
      setFormError('This family has already received rations in this round. Please review the duplicate warning and check the confirmation box to proceed.');
      return;
    }

    const newDist: Distribution = {
      id: `DIST-${Date.now().toString().slice(-6)}`,
      familyId: selectedFamily.id,
      familyName: selectedFamily.name,
      village: selectedFamily.village,
      campName: selectedFamily.campName,
      kitType,
      quantity,
      round,
      distributionDate,
      officerName: officerName.trim() || 'Relief Team Member',
      isDuplicateOverride: isDuplicateInRound,
      overrideReason: isDuplicateInRound ? overrideReason.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    onRecordDistribution(newDist);
    setLastRecordedDist(newDist);

    // Keep family or reset for next entry
    setIsDuplicateOverrideConfirmed(false);
    setOverrideReason('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Handover Success Alert */}
      {lastRecordedDist && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Ration Distribution Recorded</h3>
                <p className="text-xs text-emerald-700">
                  Transaction ID: <span className="font-mono font-bold">{lastRecordedDist.id}</span> · Dispatched {lastRecordedDist.quantity}x {lastRecordedDist.kitType} to {lastRecordedDist.familyName} ({lastRecordedDist.familyId})
                </p>
              </div>
            </div>
            <button
              onClick={() => setLastRecordedDist(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline"
            >
              Dismiss
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {selectedFamily && (
              <button
                onClick={() => onPrintSlip(selectedFamily, lastRecordedDist)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printHandoverReceipt}</span>
              </button>
            )}
            <button
              onClick={() => {
                setLastRecordedDist(null);
                handleClearSelectedFamily();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100/50 rounded-lg transition-colors"
            >
              <span>{t.recordNextHousehold}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Distribute Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <PackageCheck className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">{t.distributeTitle}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.distributeSubtitle}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            {t.liveFieldCounter}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Household Finder */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.locateHousehold} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedFamily) setSelectedFamily(null);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-20 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {selectedFamily && (
                <button
                  type="button"
                  onClick={handleClearSelectedFamily}
                  className="absolute right-2 top-2 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  {t.changeFamily}
                </button>
              )}
            </div>

            {/* Dropdown Suggestions if not selected */}
            {!selectedFamily && searchMatches.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden divide-y divide-slate-100">
                {searchMatches.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectFamily(f)}
                    className="w-full p-2.5 text-left text-xs hover:bg-blue-50/70 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-600 mr-2 tabular-nums">{f.id}</span>
                      <strong className="text-slate-900">{f.name}</strong>
                      <span className="text-slate-500 ml-2">· {f.village} ({f.size} {t.persons})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-mono tabular-nums block">{f.phone}</span>
                      {f.electricityBillNo && (
                        <span className="text-[10px] text-amber-700 font-mono block">EB: {f.electricityBillNo}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Household Summary Card */}
          {selectedFamily && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    {selectedFamily.name}
                  </span>
                  <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 tabular-nums">
                    {selectedFamily.id}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {selectedFamily.size} {t.familyMembersCount}
                </span>
              </div>
              <div className="text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400">{t.villageCol}: </span>
                  <span className="font-medium text-slate-800">{selectedFamily.village}</span>
                </div>
                {selectedFamily.campName && (
                  <div>
                    <span className="text-slate-400">Camp: </span>
                    <span className="font-medium text-slate-800">{selectedFamily.campName}</span>
                  </div>
                )}
                {selectedFamily.electricityBillNo && (
                  <div>
                    <span className="text-slate-400">EB Bill No: </span>
                    <span className="font-mono font-semibold text-amber-900">{selectedFamily.electricityBillNo}</span>
                  </div>
                )}
              </div>

              {/* Priority flags if any */}
              {selectedFamily.vulnerabilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                  {selectedFamily.vulnerabilities.map((v) => (
                    <span key={v} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium capitalize">
                      {v.replace('_', ' ')}
                    </span>
                  ))}
                  {selectedFamily.specialNotes && (
                    <span className="text-slate-500 italic block w-full mt-0.5">
                      Note: {selectedFamily.specialNotes}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Allocation Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kit Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.rationKitType} <span className="text-red-500">*</span>
              </label>
              <select
                value={kitType}
                onChange={(e) => setKitType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {kits.map((kit) => (
                  <option key={kit.id} value={kit.name}>
                    {kit.name}
                  </option>
                ))}
              </select>
              {currentKitInfo && (
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  {currentKitInfo.description}
                </p>
              )}
            </div>

            {/* Relief Round */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.reliefRound} <span className="text-red-500">*</span>
              </label>
              <select
                value={round}
                onChange={(e) => {
                  setRound(e.target.value);
                  setIsDuplicateOverrideConfirmed(false);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {RELIEF_ROUNDS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                {t.roundHelp}
              </p>
            </div>

            {/* Distribution Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.handoverDate} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={distributionDate}
                onChange={(e) => setDistributionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tabular-nums"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.numberOfKits} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={10}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tabular-nums"
              />
              <p className="text-[10px] text-slate-400 mt-1">{t.standardQuotaHelp}</p>
            </div>

            {/* Officer Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.dispatchedByOfficer}
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder={t.officerPlaceholder}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* DUPLICATE WARNING BOX IF DUPLICATE IN ROUND */}
          {selectedFamily && isDuplicateInRound && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs space-y-3">
              <div className="flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm font-bold block text-amber-900">
                    {t.duplicateDistAlertTitle}
                  </strong>
                  <p className="mt-1 text-amber-800 leading-relaxed">
                    {t.duplicateDistAlertDesc} <strong>{round}</strong>:
                  </p>
                  <ul className="mt-1.5 list-disc list-inside text-amber-900 font-mono text-[11px] tabular-nums">
                    {existingRoundDistributions.map((d) => (
                      <li key={d.id}>
                        {d.kitType} ({d.quantity} kit) on {d.distributionDate} [Logged by {d.officerName}]
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-amber-800">
                    If this is a secondary nutritional requirement (e.g. infants/water tablets) or authorized replacement, check the confirmation below and record the supervisor reason.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/80 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-950">
                  <input
                    type="checkbox"
                    checked={isDuplicateOverrideConfirmed}
                    onChange={(e) => setIsDuplicateOverrideConfirmed(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>{t.duplicateOverrideCheck}</span>
                </label>

                {isDuplicateOverrideConfirmed && (
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      {t.overrideReasonLabel}
                    </label>
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder={t.overrideReasonPlaceholder}
                      className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Error */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {formError}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              All transactions are recorded in the immutable camp distribution ledger.
            </span>
            <button
              type="submit"
              disabled={!selectedFamily || (isDuplicateInRound && !isDuplicateOverrideConfirmed)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PackageCheck className="w-4 h-4" />
              <span>{t.recordDistributionBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
