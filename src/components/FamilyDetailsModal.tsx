import React from 'react';
import { Family, Distribution } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { X, PackageCheck, AlertCircle, Phone, MapPin, Users, Calendar, PlusCircle, Trash2, Zap } from 'lucide-react';

interface Props {
  family: Family;
  distributions: Distribution[];
  onClose: () => void;
  onQuickDistribute: (family: Family) => void;
  onPrintSlip: (family: Family, distribution?: Distribution) => void;
  onDeleteFamily?: (familyId: string) => void;
}

export const FamilyDetailsModal: React.FC<Props> = ({
  family,
  distributions,
  onClose,
  onQuickDistribute,
  onPrintSlip,
  onDeleteFamily,
}) => {
  const { t, language } = useTranslation();
  const familyDistributions = distributions.filter((d) => d.familyId === family.id);
  const totalKits = familyDistributions.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              {family.id}
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{family.name}</h2>
              <p className="text-xs text-slate-500">
                {t.registeredOn} {new Date(family.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>{t.familySize}</span>
              </div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{family.size} {t.persons}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'फ़ोन नंबर' : 'Phone'}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">{family.phone}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <PackageCheck className="w-3.5 h-3.5" />
                <span>{t.totalKitsReceived}</span>
              </div>
              <p className="text-lg font-bold text-blue-700 tabular-nums">{totalKits}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'वितरण चरण' : 'Rounds'}</span>
              </div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{familyDistributions.length}</p>
            </div>
          </div>

          {/* Location & Camp & Electricity Bill */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1">
                <div>
                  <span className="text-slate-500">{t.villageWard}: </span>
                  <span className="font-semibold text-slate-800">{family.village}</span>
                </div>
                {family.campName && (
                  <div>
                    <span className="text-slate-500">{t.assignedCamp}: </span>
                    <span className="font-semibold text-slate-800">{family.campName}</span>
                  </div>
                )}
              </div>
            </div>
            {family.electricityBillNo && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-slate-500">{t.electricityBillNo}:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {family.electricityBillNo}
                </span>
              </div>
            )}
          </div>

          {/* Dwelling / House Damage Photo */}
          {family.houseImage && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{language === 'hi' ? 'दस्तावेजीकृत मकान व बाढ़ क्षति फोटो' : 'Documented Dwelling & Damage Photo'}</span>
                </span>
                {family.damageLevel && (
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded capitalize">
                    {family.damageLevel} {t.damageAssessed}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 max-w-xs shadow-2xs">
                  <img
                    src={family.houseImage}
                    alt={`${family.name}'s dwelling`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-2 text-xs space-y-1.5 text-slate-600">
                  <p className="font-semibold text-slate-800">
                    {language === 'hi' ? 'विज़ुअल डिजिटल फिंगरप्रिंट (डुप्लीकेट धोखाधड़ी रोकथाम)' : 'Visual Biometric Fingerprint (Anti-Fraud Checked)'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi'
                      ? 'परसेप्टुअल हैश द्वारा सत्यापित ताकि इस मकान पर दोबारा कोई अनधिकृत दावा न कर सके।'
                      : 'Perceptual hash verified to protect this household from duplicate claims.'}
                  </p>
                  {family.houseImageHash && (
                    <div className="text-[10px] font-mono text-slate-400 bg-white p-2 rounded border border-slate-200 break-all tabular-nums">
                      dHash: {family.houseImageHash.slice(0, 32)}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vulnerability Badges */}
          {family.vulnerabilities.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                {t.vulnerabilityFlagsTitle}
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {family.vulnerabilities.map((v) => (
                  <span
                    key={v}
                    className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium capitalize"
                  >
                    {v.replace('_', ' ')}
                  </span>
                ))}
              </div>
              {family.specialNotes && (
                <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <strong className="text-slate-700">{language === 'hi' ? 'चिकित्सीय / सहायता टिप्पणी:' : 'Medical / Support Note:'}</strong> {family.specialNotes}
                </p>
              )}
            </div>
          )}

          {/* Distribution History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.distributionHistory} ({familyDistributions.length})
              </h4>
              <button
                onClick={() => onPrintSlip(family)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {t.printQueueToken}
              </button>
            </div>

            {familyDistributions.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">{t.noDistributionHistory}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'hi'
                    ? 'यह परिवार वर्तमान राहत चरण के आवंटन हेतु प्रतीक्षारत है।'
                    : 'This family is pending allocation for current round.'}
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                {familyDistributions.map((dist) => (
                  <div key={dist.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{dist.kitType}</span>
                        <span className="font-mono text-slate-500 tabular-nums">x{dist.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span>{dist.round}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{dist.distributionDate}</span>
                        <span>·</span>
                        <span>{dist.officerName}</span>
                      </div>
                      {dist.isDuplicateOverride && (
                        <p className="text-amber-700 font-medium mt-1">
                          Override: {dist.overrideReason || 'Approved extra distribution'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onPrintSlip(family, dist)}
                      className="px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-white hover:text-blue-600"
                    >
                      {t.printSlip}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              {t.closeBtn}
            </button>
            {onDeleteFamily && (
              <button
                onClick={() => {
                  onClose();
                  onDeleteFamily(family.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                title={t.deleteHousehold}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.deleteHousehold}</span>
              </button>
            )}
          </div>
          <button
            onClick={() => {
              onClose();
              onQuickDistribute(family);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.quickDistributeBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
