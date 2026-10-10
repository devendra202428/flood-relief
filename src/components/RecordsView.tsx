import React, { useState } from 'react';
import { Family, Distribution, KitTypeInfo } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { FileSpreadsheet, Package, Users, Layers, AlertCircle, Plus, Eye, Printer, Trash2 } from 'lucide-react';

interface Props {
  families: Family[];
  distributions: Distribution[];
  kits: KitTypeInfo[];
  onSelectFamily: (family: Family) => void;
  onPrintSlip: (family: Family, dist?: Distribution) => void;
  onExportFamiliesCSV: () => void;
  onExportDistributionsCSV: () => void;
  onDeleteFamily: (familyId: string) => void;
  onDeleteDistribution: (distId: string) => void;
  onUpdateKitStock: (kitId: string, newStock: number) => void;
}

export const RecordsView: React.FC<Props> = ({
  families,
  distributions,
  kits,
  onSelectFamily,
  onPrintSlip,
  onExportFamiliesCSV,
  onExportDistributionsCSV,
  onDeleteFamily,
  onDeleteDistribution,
  onUpdateKitStock,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'families' | 'distributions' | 'inventory'>('families');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);

  const distributedFamilyIds = new Set(distributions.map((d) => d.familyId));

  const handleStartEditStock = (kit: KitTypeInfo) => {
    setEditingStockId(kit.id);
    setNewStockVal(kit.totalStock);
  };

  const handleSaveStock = (kitId: string) => {
    onUpdateKitStock(kitId, Math.max(0, newStockVal));
    setEditingStockId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t.recordsTitle}</h2>
          <p className="text-xs text-slate-500">{t.recordsSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportFamiliesCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.exportFamiliesCsv}</span>
          </button>
          <button
            onClick={onExportDistributionsCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.exportDistributionsCsv}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('families')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'families'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.tabHouseholds} ({families.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('distributions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'distributions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.tabLedger} ({distributions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.tabInventory} ({kits.length})</span>
        </button>
      </div>

      {/* Tab 1: Families Registry */}
      {activeTab === 'families' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Household ID</th>
                  <th className="py-3 px-4">Dwelling</th>
                  <th className="py-3 px-4">Family Head</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Village / Camp</th>
                  <th className="py-3 px-4 text-center">Size</th>
                  <th className="py-3 px-4">Vulnerability Flags</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...families].reverse().map((f) => {
                  const isGiven = distributedFamilyIds.has(f.id);
                  const count = distributions.filter((d) => d.familyId === f.id).length;
                  return (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 tabular-nums">
                        {f.id}
                      </td>
                      <td className="py-3 px-4">
                        {f.houseImage ? (
                          <button
                            onClick={() => onSelectFamily(f)}
                            className="w-10 h-8 rounded overflow-hidden bg-slate-900 border border-slate-200 block hover:ring-2 hover:ring-blue-500 transition-all"
                            title="View Verified Dwelling Photo"
                          >
                            <img
                              src={f.houseImage}
                              alt="Dwelling"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {f.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                        <div>{f.phone}</div>
                        {f.electricityBillNo && (
                          <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5 inline-block font-mono">
                            EB: {f.electricityBillNo}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800">{f.village}</div>
                        <div className="text-[10px] text-slate-400">{f.campName}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                        {f.size}
                      </td>
                      <td className="py-3 px-4">
                        {f.vulnerabilities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {f.vulnerabilities.map((v) => (
                              <span
                                key={v}
                                className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-medium"
                              >
                                {v.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            isGiven ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isGiven ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          />
                          <span>{isGiven ? `Given (${count})` : 'Pending'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectFamily(f)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteFamily(f.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title={t.deleteHousehold}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Distribution Ledger */}
      {activeTab === 'distributions' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {distributions.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No distributions logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ledger ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Household</th>
                    <th className="py-3 px-4">Kit Type</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4">Relief Round</th>
                    <th className="py-3 px-4">Officer In-Charge</th>
                    <th className="py-3 px-4">Status / Override</th>
                    <th className="py-3 px-4 text-right">Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...distributions].reverse().map((dist) => {
                    const family = families.find((f) => f.id === dist.familyId);
                    return (
                      <tr key={dist.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700 tabular-nums">
                          {dist.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                          {dist.distributionDate}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{dist.familyName}</div>
                          <div className="font-mono text-[11px] text-blue-600 tabular-nums">
                            {dist.familyId}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {dist.kitType}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 tabular-nums">
                          {dist.quantity}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{dist.round}</td>
                        <td className="py-3 px-4 text-slate-600">{dist.officerName}</td>
                        <td className="py-3 px-4">
                          {dist.isDuplicateOverride ? (
                            <span
                              className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]"
                              title={dist.overrideReason || 'Authorized secondary allocation'}
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Override Approved</span>
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium text-[11px]">
                              Standard Quota
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {family && (
                              <button
                                onClick={() => onPrintSlip(family, dist)}
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                title={t.printSlip}
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteDistribution(dist.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title={t.deleteLedgerEntry}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Kit Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Relief Kit Inventory & Stock Reserves</h3>
              <p className="text-xs text-slate-500">
                Track total intake, units dispatched to field camps, and buffer stock.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {kits.map((kit) => {
              const issued = distributions
                .filter((d) => d.kitType.toLowerCase().includes(kit.name.toLowerCase().slice(0, 10)))
                .reduce((sum, d) => sum + d.quantity, 0);
              const remaining = Math.max(0, kit.totalStock - issued);
              const isEditing = editingStockId === kit.id;

              return (
                <div key={kit.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{kit.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {kit.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 max-w-xl">{kit.description}</p>
                  </div>

                  <div className="flex items-center gap-6 text-xs shrink-0">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        {t.dispatched}
                      </span>
                      <span className="font-mono font-bold text-slate-800 tabular-nums text-sm">
                        {issued}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        {t.remainingBuffer}
                      </span>
                      <span
                        className={`font-mono font-bold tabular-nums text-sm ${
                          remaining < 25 ? 'text-red-600' : 'text-emerald-700'
                        }`}
                      >
                        {remaining}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        {t.totalStock}
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <input
                            type="number"
                            min={0}
                            value={newStockVal}
                            onChange={(e) => setNewStockVal(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-xs border border-blue-500 rounded font-mono tabular-nums"
                          />
                          <button
                            onClick={() => handleSaveStock(kit.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-blue-600 rounded"
                          >
                            {t.save}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEditStock(kit)}
                          className="font-mono font-bold text-slate-900 tabular-nums text-sm hover:underline"
                          title="Click to adjust total stock intake"
                        >
                          {kit.totalStock}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
