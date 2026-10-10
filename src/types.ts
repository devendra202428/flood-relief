export type VulnerabilityType = 'infant' | 'pregnant' | 'elderly' | 'disabled' | 'single_parent';

export type DamageLevel = 'submerged' | 'severe' | 'partial' | 'inundated';

export interface Family {
  id: string; // e.g. FL-001
  name: string;
  phone: string;
  electricityBillNo?: string; // 10-digit electricity consumer / bill account number
  village: string;
  campName?: string;
  size: number;
  vulnerabilities: VulnerabilityType[];
  specialNotes?: string;
  registeredAt: string; // ISO string
  houseImage?: string; // Base64 data URL
  houseImageHash?: string; // 256-bit perceptual difference hash
  damageLevel?: DamageLevel;
}

export interface Distribution {
  id: string; // e.g. DIST-1712345678
  familyId: string;
  familyName: string;
  village: string;
  campName?: string;
  kitType: string;
  quantity: number;
  round: string;
  distributionDate: string; // YYYY-MM-DD
  officerName: string;
  isDuplicateOverride: boolean;
  overrideReason?: string;
  createdAt: string;
}

export interface KitTypeInfo {
  id: string;
  name: string;
  description: string;
  defaultUnit: string;
  totalStock: number;
}

export type ActiveTab = 'dashboard' | 'register' | 'distribute' | 'search' | 'records';
