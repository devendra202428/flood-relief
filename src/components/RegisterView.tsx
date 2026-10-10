import React, { useState } from 'react';
import { Family, VulnerabilityType, DamageLevel } from '../types';
import { HousePhotoCapture } from './HousePhotoCapture';
import { DuplicateHouseMatch } from '../utils/imageHash';
import { useTranslation } from '../i18n/LanguageContext';
import { UserPlus, AlertCircle, CheckCircle, Printer, ArrowRight, Zap } from 'lucide-react';

interface Props {
  nextId: string;
  existingFamilies: Family[];
  onRegister: (family: Family) => void;
  onGoToDistribute: (family: Family) => void;
  onPrintSlip: (family: Family) => void;
}

export const RegisterView: React.FC<Props> = ({
  nextId,
  existingFamilies,
  onRegister,
  onGoToDistribute,
  onPrintSlip,
}) => {
  const { t, language } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [electricityBillNo, setElectricityBillNo] = useState('');
  const [village, setVillage] = useState('');
  const [size, setSize] = useState<number>(4);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityType[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  // House photo capture & duplicate detection state
  const [housePhotoData, setHousePhotoData] = useState<{
    photoUrl: string;
    hash: string;
    damageLevel: DamageLevel;
    duplicateMatches: DuplicateHouseMatch[];
    isOverruled: boolean;
  } | null>(null);

  const [registeredFamily, setRegisteredFamily] = useState<Family | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Check phone duplicate dynamically
  const cleanedPhone = phone.trim();
  const phoneDuplicate = cleanedPhone.length === 10
    ? existingFamilies.find((f) => f.phone === cleanedPhone)
    : null;

  // Check electricity bill duplicate dynamically
  const cleanedElectricityBill = electricityBillNo.trim();
  const electricityDuplicate = cleanedElectricityBill.length === 10
    ? existingFamilies.find((f) => f.electricityBillNo === cleanedElectricityBill)
    : null;

  const handleVulnerabilityToggle = (type: VulnerabilityType) => {
    setVulnerabilities((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(t.familyHeadName + ' required');
      return;
    }

    if (!/^[0-9]{10}$/.test(cleanedPhone)) {
      setErrorMessage(t.mobilePlaceholder);
      return;
    }

    if (phoneDuplicate) {
      setErrorMessage(
        `${t.alreadyRegisteredUnder} ${phoneDuplicate.name} (${phoneDuplicate.id}, ${phoneDuplicate.village}).`
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(cleanedElectricityBill)) {
      setErrorMessage(
        language === 'hi'
          ? 'बिजली बिल नंबर 10 अंकों का होना आवश्यक है (केवल अंक)।'
          : 'Electricity Bill No. must be exactly 10 digits.'
      );
      return;
    }

    if (electricityDuplicate) {
      setErrorMessage(
        `${t.duplicateElectricityBillAlert} ${electricityDuplicate.name} (${electricityDuplicate.id}, ${electricityDuplicate.village}).`
      );
      return;
    }

    if (!village.trim()) {
      setErrorMessage(t.villageWard + ' required');
      return;
    }

    // Check if duplicate house photo detected without override
    if (
      housePhotoData &&
      housePhotoData.duplicateMatches.length > 0 &&
      !housePhotoData.isOverruled
    ) {
      setErrorMessage(
        `${t.duplicateRiskAlert} (${housePhotoData.duplicateMatches[0].similarity}% - ${housePhotoData.duplicateMatches[0].family.id}).`
      );
      return;
    }

    const newFamily: Family = {
      id: nextId,
      name: name.trim(),
      phone: cleanedPhone,
      electricityBillNo: cleanedElectricityBill,
      village: village.trim(),
      size,
      vulnerabilities,
      specialNotes: specialNotes.trim() || undefined,
      registeredAt: new Date().toISOString(),
      houseImage: housePhotoData?.photoUrl,
      houseImageHash: housePhotoData?.hash,
      damageLevel: housePhotoData?.damageLevel,
    };

    onRegister(newFamily);
    setRegisteredFamily(newFamily);

    // Reset form fields
    setName('');
    setPhone('');
    setElectricityBillNo('');
    setVillage('');
    setSpecialNotes('');
    setVulnerabilities([]);
    setHousePhotoData(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Registration Confirmation Card if just submitted */}
      {registeredFamily && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">{t.regSuccessTitle}</h3>
                <p className="text-xs text-emerald-700">
                  {t.assignedId}: <strong className="font-mono text-emerald-900">{registeredFamily.id}</strong> · {registeredFamily.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setRegisteredFamily(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline"
            >
              Dismiss
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onGoToDistribute(registeredFamily)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
            >
              <span>{t.proceedToDistribute}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPrintSlip(registeredFamily)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100/50 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printQueueToken}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Registration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <UserPlus className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">{t.registerTitle}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.registerSubtitle}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
              {t.assignedId}
            </span>
            <span className="text-sm font-mono font-bold text-blue-600 tabular-nums">
              {nextId}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Family Head Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.familyHeadName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.familyHeadPlaceholder}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.mobileNumber} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder={t.mobilePlaceholder}
                className={`w-full px-3 py-2 text-xs border rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 ${
                  phoneDuplicate
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {phoneDuplicate ? (
                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {t.alreadyRegisteredUnder} {phoneDuplicate.name} ({phoneDuplicate.id})
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">{t.mobileHelp}</p>
              )}
            </div>

            {/* Electricity Bill Number (10 digits) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{t.electricityBillNo}</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={electricityBillNo}
                onChange={(e) => setElectricityBillNo(e.target.value.replace(/\D/g, ''))}
                placeholder={t.electricityBillPlaceholder}
                className={`w-full px-3 py-2 text-xs border rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 ${
                  electricityDuplicate
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {electricityDuplicate ? (
                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {t.duplicateElectricityBillAlert} {electricityDuplicate.name} ({electricityDuplicate.id})
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">{t.electricityBillHelp}</p>
              )}
            </div>

            {/* Village / Ward */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.villageWard} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={t.villagePlaceholder}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Family Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.familySize} <span className="text-red-500">*</span>
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-mono tabular-nums"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                  <option key={n} value={n}>
                    {n} {t.persons} {n >= 7 ? t.extendedFamilyEligible : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Needs Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.specialNeedsNotes}
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder={t.specialNotesPlaceholder}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Vulnerability Checklist */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t.vulnerabilityFlagsTitle}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'infant', label: t.flagInfant },
                { id: 'pregnant', label: t.flagPregnant },
                { id: 'elderly', label: t.flagElderly },
                { id: 'disabled', label: t.flagDisabled },
                { id: 'single_parent', label: t.flagSingleParent },
              ].map(({ id, label }) => {
                const isSelected = vulnerabilities.includes(id as VulnerabilityType);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleVulnerabilityToggle(id as VulnerabilityType)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded text-blue-600 pointer-events-none"
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* House Photo Capture & Perceptual Duplicate Detection */}
          <div className="pt-2 border-t border-slate-100">
            <HousePhotoCapture
              existingFamilies={existingFamilies}
              currentPhoto={housePhotoData?.photoUrl}
              currentHash={housePhotoData?.hash}
              currentDamageLevel={housePhotoData?.damageLevel || 'severe'}
              onPhotoAccepted={(data) => setHousePhotoData(data)}
              onPhotoCleared={() => setHousePhotoData(null)}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              {t.autoIdNotice}
            </p>
            <div className="flex gap-2">
              <button
                type="reset"
                onClick={() => {
                  setName('');
                  setPhone('');
                  setElectricityBillNo('');
                  setVillage('');
                  setSpecialNotes('');
                  setVulnerabilities([]);
                  setHousePhotoData(null);
                  setErrorMessage('');
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {t.clearForm}
              </button>
              <button
                type="submit"
                disabled={Boolean(phoneDuplicate) || Boolean(electricityDuplicate) || Boolean(housePhotoData && housePhotoData.duplicateMatches.length > 0 && !housePhotoData.isOverruled)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
              >
                {t.submitRegister}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
