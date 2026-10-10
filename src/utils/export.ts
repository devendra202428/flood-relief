import { Family, Distribution } from '../types';

export function exportFamiliesToCSV(families: Family[], distributions: Distribution[]): void {
  const getStatus = (familyId: string) => {
    const hasDist = distributions.some((d) => d.familyId === familyId);
    return hasDist ? 'Ration Dispatched' : 'Pending Allocation';
  };

  const getDistCount = (familyId: string) => {
    return distributions.filter((d) => d.familyId === familyId).length;
  };

  const headers = [
    'Household ID',
    'Family Head Name',
    'Primary Phone',
    'Electricity Bill No',
    'Village / Ward',
    'Assigned Camp / Sector',
    'Family Size',
    'Vulnerabilities',
    'Special Needs Notes',
    'Ration Status',
    'Total Distributions Received',
    'Registration Date',
  ];

  const rows = families.map((f) => [
    f.id,
    f.name,
    f.phone,
    f.electricityBillNo || 'N/A',
    f.village,
    f.campName || 'N/A',
    f.size,
    f.vulnerabilities.join('; ') || 'None',
    f.specialNotes || 'None',
    getStatus(f.id),
    getDistCount(f.id),
    new Date(f.registeredAt).toLocaleDateString(),
  ]);

  downloadCSV([headers, ...rows], `floodrelief_registered_families_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportDistributionsToCSV(distributions: Distribution[]): void {
  const headers = [
    'Distribution ID',
    'Date',
    'Household ID',
    'Family Head Name',
    'Village',
    'Relief Camp / Sector',
    'Ration Kit Type',
    'Quantity',
    'Relief Round',
    'Verifying Officer',
    'Duplicate Override Approved',
    'Override Justification',
  ];

  const rows = distributions.map((d) => [
    d.id,
    d.distributionDate,
    d.familyId,
    d.familyName,
    d.village,
    d.campName || 'N/A',
    d.kitType,
    d.quantity,
    d.round,
    d.officerName || 'Field Volunteer',
    d.isDuplicateOverride ? 'Yes' : 'No',
    d.overrideReason || 'N/A',
  ]);

  downloadCSV([headers, ...rows], `floodrelief_distribution_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
}

function downloadCSV(rows: (string | number)[][], filename: string): void {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell ?? '').replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
