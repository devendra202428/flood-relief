import React from 'react';
import { Family, Distribution } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  family: Family;
  distribution?: Distribution;
  onClose: () => void;
}

export const ReliefSlipModal: React.FC<Props> = ({ family, distribution, onClose }) => {
  const { t } = useTranslation();
  const handlePrint = () => {
    window.print();
  };

  const voucherNumber = distribution ? distribution.id : `TOKEN-${family.id}`;
  const dateStr = distribution
    ? distribution.distributionDate
    : new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-base">{t.slipHeaderTitle}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printSlip}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Content */}
        <div className="p-6 space-y-6 text-slate-900 print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 text-center">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-700">
              {t.slipHeaderOrg}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              {t.slipHeaderTitle}
            </h2>
            <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-mono tabular-nums">
              <span>{t.slipId}: {voucherNumber}</span>
              <span>{t.dateLabel}: {dateStr}</span>
            </div>
          </div>

          {/* Barcode and Dwelling Photo Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Barcode */}
            <div className={`flex flex-col items-center justify-center py-2 bg-slate-50 border border-slate-200 rounded-lg ${family.houseImage ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
              <div className="flex items-center gap-0.5 h-10 px-4">
                {[4, 2, 6, 3, 5, 2, 7, 3, 4, 2, 8, 3, 5, 2, 6, 4, 3, 7, 2, 5, 3, 6, 2, 4, 5, 3].map((height, i) => (
                  <div
                    key={i}
                    className="bg-slate-900"
                    style={{
                      width: i % 3 === 0 ? '3px' : '2px',
                      height: `${height * 4 + 8}px`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono tracking-widest text-slate-600 mt-1 tabular-nums">
                *{family.id}-{distribution ? distribution.round.slice(0, 7).replace(/\s/g, '') : 'REG'}*
              </span>
            </div>

            {/* Dwelling Photo on Slip */}
            {family.houseImage && (
              <div className="border border-slate-200 rounded-lg p-1.5 bg-slate-50 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-16 rounded overflow-hidden bg-slate-900 border border-slate-300">
                  <img
                    src={family.houseImage}
                    alt="Verified Dwelling"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 mt-1">
                  {t.verifiedDwellingBadge}
                </span>
              </div>
            )}
          </div>

          {/* Household Details */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">{t.familyHeadName}</span>
              <strong className="text-base text-slate-900">{family.name}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t.assignedId}</span>
              <strong className="text-base text-blue-600 font-mono tabular-nums">{family.id}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t.mobileNumber}</span>
              <span className="font-mono tabular-nums">{family.phone}</span>
            </div>
            {family.electricityBillNo && (
              <div>
                <span className="text-xs text-slate-500 block">{t.electricityBillNo}</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">{family.electricityBillNo}</span>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-500 block">{t.familySize}</span>
              <span className="font-semibold">{family.size} {t.persons}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t.villageWard}</span>
              <span>{family.village}</span>
            </div>
            {family.campName && (
              <div>
                <span className="text-xs text-slate-500 block">{t.assignedCamp}</span>
                <span>{family.campName}</span>
              </div>
            )}
          </div>

          {/* Vulnerability notice if any */}
          {family.vulnerabilities.length > 0 && (
            <div className="text-xs border border-amber-200 bg-amber-50/60 p-3 rounded-lg text-amber-900">
              <strong className="block font-semibold mb-1">{t.vulnerabilityFlagsTitle}:</strong>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {family.vulnerabilities.map((v) => (
                  <span key={v} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-medium">
                    {v.replace('_', ' ')}
                  </span>
                ))}
              </div>
              {family.specialNotes && (
                <p className="mt-1 text-slate-600 italic">Notes: {family.specialNotes}</p>
              )}
            </div>
          )}

          {/* Allocation Specifics */}
          {distribution ? (
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>{t.verifiedHandoverRecord}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm pt-1">
                <div>
                  <span className="text-xs text-slate-500 block">{t.kitAllocated}</span>
                  <span className="font-semibold text-slate-900">{distribution.kitType}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.qtyCol}</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums">{distribution.quantity}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.reliefRound}</span>
                  <span>{distribution.round}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.dispatchedBy}</span>
                  <span>{distribution.officerName || 'Camp Officer In-Charge'}</span>
                </div>
              </div>
              {distribution.isDuplicateOverride && (
                <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>Special Override Authorized:</strong> {distribution.overrideReason || 'Emergency re-allocation approved by Camp Command.'}
                </div>
              )}
            </div>
          ) : (
            <div className="border border-slate-200 border-dashed rounded-lg p-4 text-center text-xs text-slate-600">
              <p className="font-semibold text-slate-800 mb-1">{t.queueTokenNoticeTitle}</p>
              <p>{t.queueTokenNoticeDesc}</p>
            </div>
          )}

          {/* Verification Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-slate-600 border-t border-slate-200">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300"></div>
              <p className="mt-1">{t.recipientSignature}</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300"></div>
              <p className="mt-1">{t.officerSeal}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            {t.closeBtn}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printReceiptBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

