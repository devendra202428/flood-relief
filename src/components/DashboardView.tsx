import React from 'react';
import { Family, Distribution, KitTypeInfo, ActiveTab } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { Users, CheckCircle2, Clock, Package, AlertTriangle, ArrowRight, FileSpreadsheet, Building2, ShieldAlert } from 'lucide-react';

interface Props {
  families: Family[];
  distributions: Distribution[];
  kits: KitTypeInfo[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectFamily: (family: Family) => void;
  onPrintSlip: (family: Family, dist?: Distribution) => void;
  onExportCSV: () => void;
}

export const DashboardView: React.FC<Props> = ({
  families,
  distributions,
  kits,
  onNavigate,
  onSelectFamily,
  onPrintSlip,
  onExportCSV,
}) => {
  const { t } = useTranslation();
  const distributedFamilyIds = new Set(distributions.map((d) => d.familyId));
  const totalFamiliesCount = families.length;
  const distributedCount = distributedFamilyIds.size;
  const pendingCount = Math.max(0, totalFamiliesCount - distributedCount);
  const totalKitsDispatched = distributions.reduce((sum, d) => sum + d.quantity, 0);

  // Vulnerable families count
  const vulnerableFamiliesCount = families.filter((f) => f.vulnerabilities.length > 0).length;

  // Recent 6 distributions
  const recentDistributions = [...distributions].reverse().slice(0, 6);

  // Village summary
  const villageCounts = families.reduce<Record<string, { total: number; served: number }>>((acc, f) => {
    if (!acc[f.village]) {
      acc[f.village] = { total: 0, served: 0 };
    }
    acc[f.village].total += 1;
    if (distributedFamilyIds.has(f.id)) {
      acc[f.village].served += 1;
    }
    return acc;
  }, {});

  const topVillages = Object.entries(villageCounts)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Families */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.registeredHouseholds}
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {totalFamiliesCount}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>{vulnerableFamiliesCount} {t.priorityVulnerable}</span>
          </div>
        </div>

        {/* Distributed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.householdsReached}
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            {distributedCount}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>
              {totalFamiliesCount > 0
                ? `${Math.round((distributedCount / totalFamiliesCount) * 100)}% ${t.coverageAchieved}`
                : t.noHouseholdsAdded}
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.pendingHouseholds}
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-amber-700 font-mono tabular-nums">
            {pendingCount}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>{t.awaitingAllocation}</span>
          </div>
        </div>

        {/* Total Kits Handed Out */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.kitsDispatched}
            </span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {totalKitsDispatched}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>{t.acrossAllRounds}</span>
          </div>
        </div>
      </div>

      {/* Operations Quick Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base">{t.bannerTitle}</h3>
          </div>
          <p className="text-xs text-blue-200 max-w-xl">
            {t.bannerDesc}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigate('register')}
            className="px-3.5 py-2 text-xs font-semibold bg-white text-blue-900 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
          >
            {t.registerHouseholdBtn}
          </button>
          <button
            onClick={() => onNavigate('distribute')}
            className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            {t.recordDispatchBtn}
          </button>
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 text-xs font-semibold bg-blue-800/80 hover:bg-blue-700 text-white rounded-lg border border-blue-600/40 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.exportCsvBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Distributions & Village/Camp Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Distribution Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{t.recentDistributionsTitle}</h3>
                <p className="text-xs text-slate-500">{t.recentDistributionsSubtitle}</p>
              </div>
              <button
                onClick={() => onNavigate('records')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <span>{t.viewFullLedger}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentDistributions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {t.noDistributionsYet}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-2">{t.householdCol}</th>
                      <th className="py-3 px-2">{t.kitTypeCol}</th>
                      <th className="py-3 px-2">{t.villageCol}</th>
                      <th className="py-3 px-2 text-right">{t.qtyCol}</th>
                      <th className="py-3 px-2 text-right">{t.actionsCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentDistributions.map((dist) => {
                      const family = families.find((f) => f.id === dist.familyId);
                      return (
                        <tr key={dist.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-2">
                            <div className="font-semibold text-slate-900">{dist.familyName}</div>
                            <div className="text-[11px] font-mono text-slate-500 tabular-nums">{dist.familyId}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-medium text-slate-800">{dist.kitType}</span>
                            <div className="text-[11px] text-slate-400">{dist.round}</div>
                          </td>
                          <td className="py-3 px-2 text-slate-600">{dist.village}</td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                            {dist.quantity}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {family && (
                              <button
                                onClick={() => onPrintSlip(family, dist)}
                                className="px-2 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              >
                                {t.printSlip}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Cloud Database syncs across all registered relief devices</span>
            <span className="font-mono tabular-nums">{distributions.length} total dispatches recorded</span>
          </div>
        </div>

        {/* Right Col: Village Progress & Critical Stocks */}
        <div className="space-y-6">
          {/* Sector / Village Coverage */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-sm text-slate-900">{t.areaCoverageProgress}</h3>
            </div>
            <div className="space-y-3">
              {topVillages.map(([village, stats]) => {
                const percent = stats.total > 0 ? Math.round((stats.served / stats.total) * 100) : 0;
                return (
                  <div key={village} className="text-xs space-y-1">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-medium truncate max-w-[170px]" title={village}>
                        {village}
                      </span>
                      <span className="text-slate-500 font-mono tabular-nums">
                        {stats.served}/{stats.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kit Inventory Stock Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">{t.campStockStatus}</h3>
              <button
                onClick={() => onNavigate('records')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              >
                {t.manage}
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              {kits.slice(0, 4).map((kit) => {
                const issuedCount = distributions
                  .filter((d) => d.kitType.toLowerCase().includes(kit.name.toLowerCase().slice(0, 10)))
                  .reduce((sum, d) => sum + d.quantity, 0);
                const remaining = Math.max(0, kit.totalStock - issuedCount);
                const isLow = remaining < 20;

                return (
                  <div key={kit.id} className="flex items-center justify-between py-1 border-b border-slate-50">
                    <div>
                      <div className="font-medium text-slate-800 truncate max-w-[160px]" title={kit.name}>
                        {kit.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {t.issued}: {issuedCount}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold tabular-nums ${
                          isLow ? 'text-amber-600' : 'text-slate-800'
                        }`}
                      >
                        {remaining}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{t.left}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Field Note */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold block">{t.duplicateProtocolTitle}</strong>
              <p className="text-amber-800 leading-relaxed">
                {t.duplicateProtocolDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
