import React, { useState } from 'react';
import { Family, Distribution, ActiveTab } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { Search, X, PackagePlus, Eye, Printer, UserPlus } from 'lucide-react';

interface Props {
  families: Family[];
  distributions: Distribution[];
  onSelectFamily: (family: Family) => void;
  onGoToDistribute: (family: Family) => void;
  onPrintSlip: (family: Family) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const SearchView: React.FC<Props> = ({
  families,
  distributions,
  onSelectFamily,
  onGoToDistribute,
  onPrintSlip,
  onNavigate,
}) => {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'distributed' | 'vulnerable'>('all');

  const distributedFamilyIds = new Set(distributions.map((d) => d.familyId));

  const filteredFamilies = families.filter((f) => {
    // Search query
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      f.id.toLowerCase().includes(term) ||
      f.name.toLowerCase().includes(term) ||
      f.phone.includes(term) ||
      f.village.toLowerCase().includes(term) ||
      f.campName.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // Status filter
    const isDistributed = distributedFamilyIds.has(f.id);
    if (statusFilter === 'pending') return !isDistributed;
    if (statusFilter === 'distributed') return isDistributed;
    if (statusFilter === 'vulnerable') return f.vulnerabilities.length > 0;

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Search Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.searchHeaderTitle}</h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? `आईडी, नाम, मोबाइल या गाँव द्वारा कुल ${families.length} पंजीकृत परिवारों में लाइव खोज।`
                : `Live search across ${families.length} registered households by ID, name, mobile, or village.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('register')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.registerHouseholdBtn}</span>
            </button>
          </div>
        </div>

        {/* Search Input and Filter Segmented Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchBarPlaceholder}
              className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter segment */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs self-start md:self-auto shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterAll} ({families.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterPending} ({families.filter((f) => !distributedFamilyIds.has(f.id)).length})
            </button>
            <button
              onClick={() => setStatusFilter('distributed')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'distributed'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterDistributed} ({distributedFamilyIds.size})
            </button>
            <button
              onClick={() => setStatusFilter('vulnerable')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'vulnerable'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterVulnerable}
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredFamilies.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-3">
            <p className="font-semibold text-slate-700 text-sm">{t.noMatchingFound}</p>
            <p className="text-slate-400">
              {language === 'hi'
                ? 'कृपया अपने खोज शब्द बदलें या नया परिवार पंजीकृत करें।'
                : 'Try adjusting your search criteria or register a new family.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">{t.assignedId}</th>
                  <th className="py-3 px-4">{t.dwellingCol}</th>
                  <th className="py-3 px-4">{t.familyHeadName}</th>
                  <th className="py-3 px-4">{t.mobileNumber}</th>
                  <th className="py-3 px-4">{t.villageCol}</th>
                  <th className="py-3 px-4 text-center">{t.familySize}</th>
                  <th className="py-3 px-4">{t.statusCol}</th>
                  <th className="py-3 px-4 text-right">{t.actionsCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFamilies.map((f) => {
                  const isGiven = distributedFamilyIds.has(f.id);
                  const familyDistCount = distributions.filter((d) => d.familyId === f.id).length;

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectFamily(f)}
                          className="font-mono font-bold text-blue-600 hover:text-blue-800 tabular-nums text-left"
                        >
                          {f.id}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{f.name}</div>
                        {f.vulnerabilities.length > 0 && (
                          <div className="flex gap-1 mt-0.5 text-[10px] text-amber-700 font-medium">
                            {f.vulnerabilities.map((v) => v.replace('_', ' ')).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums">
                        {f.phone}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800">{f.village}</div>
                        <div className="text-[11px] text-slate-400">{f.campName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                        {f.size}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isGiven ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              isGiven ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {isGiven ? `${t.statusGiven} (${familyDistCount})` : t.statusPending}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectFamily(f)}
                            title="View Household Details"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPrintSlip(f)}
                            title="Print Queue Token"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onGoToDistribute(f)}
                            title="Distribute Ration"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors ml-1"
                          >
                            <PackagePlus className="w-3.5 h-3.5" />
                            <span>{t.distribute}</span>
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

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span className="font-mono tabular-nums">
            {language === 'hi'
              ? `${families.length} में से ${filteredFamilies.length} परिवार प्रदर्शित`
              : `Showing ${filteredFamilies.length} of ${families.length} registered households`}
          </span>
          <span className="text-[11px] text-slate-400">
            {language === 'hi'
              ? 'विवरण देखने के लिए किसी भी आईडी पर क्लिक करें'
              : 'Click any household ID to view complete history'}
          </span>
        </div>
      </div>
    </div>
  );
};
