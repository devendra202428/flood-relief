import { Family, Distribution, KitTypeInfo } from '../types';
import { INITIAL_FAMILIES, INITIAL_DISTRIBUTIONS, INITIAL_KITS } from '../data/initialData';
import { processAndHashImage } from './imageHash';

const STORAGE_KEY = 'floodrelief_data_v3';

export interface StorageData {
  families: Family[];
  distributions: Distribution[];
  kits: KitTypeInfo[];
  nextIdNumber: number;
}

export function loadStoredData(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.families) && Array.isArray(parsed.distributions)) {
        return {
          families: parsed.families,
          distributions: parsed.distributions,
          kits: parsed.kits && Array.isArray(parsed.kits) ? parsed.kits : INITIAL_KITS,
          nextIdNumber: typeof parsed.nextIdNumber === 'number' ? parsed.nextIdNumber : parsed.families.length + 1,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored FloodRelief data, loading defaults', err);
  }

  return {
    families: INITIAL_FAMILIES,
    distributions: INITIAL_DISTRIBUTIONS,
    kits: INITIAL_KITS,
    nextIdNumber: INITIAL_FAMILIES.length + 1,
  };
}

export async function computeMissingHashes(families: Family[]): Promise<Family[]> {
  let changed = false;
  const updated = await Promise.all(
    families.map(async (fam) => {
      if (fam.houseImage && !fam.houseImageHash) {
        try {
          const { hash } = await processAndHashImage(fam.houseImage);
          changed = true;
          return { ...fam, houseImageHash: hash };
        } catch (e) {
          console.warn(`Failed to hash image for ${fam.id}`, e);
          return fam;
        }
      }
      return fam;
    })
  );

  return changed ? updated : families;
}

export function saveStoredData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save FloodRelief data to localStorage', err);
  }
}

export function generateFamilyId(num: number): string {
  return `FL-${String(num).padStart(3, '0')}`;
}
