import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Family, Distribution, KitTypeInfo } from '../types';
import { INITIAL_FAMILIES, INITIAL_DISTRIBUTIONS, INITIAL_KITS } from '../data/initialData';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';

/**
 * Strips all undefined properties from an object so Firestore setDoc / updateDoc never fails.
 */
export function cleanDocData<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

export async function seedInitialFirestoreDataIfEmpty() {
  try {
    // 1. Check families
    const famSnap = await getDocs(query(collection(db, 'families'), limit(1)));
    if (famSnap.empty) {
      console.log('Seeding initial families to Firestore...');
      for (const fam of INITIAL_FAMILIES) {
        await setDoc(doc(db, 'families', fam.id), cleanDocData(fam));
      }
    }

    // 2. Check distributions
    const distSnap = await getDocs(query(collection(db, 'distributions'), limit(1)));
    if (distSnap.empty) {
      console.log('Seeding initial distributions to Firestore...');
      for (const dist of INITIAL_DISTRIBUTIONS) {
        await setDoc(doc(db, 'distributions', dist.id), cleanDocData(dist));
      }
    }

    // 3. Check kits
    const kitSnap = await getDocs(query(collection(db, 'kits'), limit(1)));
    if (kitSnap.empty) {
      console.log('Seeding initial kits to Firestore...');
      for (const kit of INITIAL_KITS) {
        await setDoc(doc(db, 'kits', kit.id), cleanDocData(kit));
      }
    }
    console.log('Firestore seed verification finished.');
  } catch (err) {
    console.warn('Initial seeding check skipped or offline:', err);
  }
}

export function subscribeToFamilies(
  onUpdate: (families: Family[]) => void,
  onError?: (err: any) => void
) {
  const path = 'families';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Family[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Family);
      });
      // Sort newest registration first
      list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to families:', error);
      if (onError) onError(error);
    }
  );
}

export function subscribeToDistributions(
  onUpdate: (dists: Distribution[]) => void,
  onError?: (err: any) => void
) {
  const path = 'distributions';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Distribution[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Distribution);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to distributions:', error);
      if (onError) onError(error);
    }
  );
}

export function subscribeToKits(
  onUpdate: (kits: KitTypeInfo[]) => void,
  onError?: (err: any) => void
) {
  const path = 'kits';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: KitTypeInfo[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as KitTypeInfo);
      });
      if (list.length > 0) {
        onUpdate(list);
      }
    },
    (error) => {
      console.error('Error listening to kits:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveFamilyToCloud(family: Family): Promise<void> {
  const path = `families/${family.id}`;
  try {
    const cleaned = cleanDocData(family);
    await setDoc(doc(db, 'families', family.id), cleaned);
    console.log(`[Cloud Sync] Family ${family.id} saved to Firestore successfully`);
  } catch (err) {
    console.error(`[Cloud Sync] Failed to save family ${family.id}:`, err);
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function saveDistributionToCloud(dist: Distribution): Promise<void> {
  const path = `distributions/${dist.id}`;
  try {
    const cleaned = cleanDocData(dist);
    await setDoc(doc(db, 'distributions', dist.id), cleaned);
    console.log(`[Cloud Sync] Distribution ${dist.id} saved to Firestore successfully`);
  } catch (err) {
    console.error(`[Cloud Sync] Failed to save distribution ${dist.id}:`, err);
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function saveKitStockToCloud(kitId: string, newStock: number): Promise<void> {
  const path = `kits/${kitId}`;
  try {
    await setDoc(doc(db, 'kits', kitId), { totalStock: newStock }, { merge: true });
    console.log(`[Cloud Sync] Kit ${kitId} stock updated to ${newStock}`);
  } catch (err) {
    console.error(`[Cloud Sync] Failed to update kit ${kitId}:`, err);
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function resetCloudDataToSample(): Promise<void> {
  try {
    // 1. Delete all families and replace with INITIAL_FAMILIES
    const famSnap = await getDocs(collection(db, 'families'));
    for (const d of famSnap.docs) {
      await deleteDoc(d.ref);
    }
    for (const fam of INITIAL_FAMILIES) {
      await setDoc(doc(db, 'families', fam.id), cleanDocData(fam));
    }

    // 2. Delete all distributions and replace with INITIAL_DISTRIBUTIONS
    const distSnap = await getDocs(collection(db, 'distributions'));
    for (const d of distSnap.docs) {
      await deleteDoc(d.ref);
    }
    for (const dist of INITIAL_DISTRIBUTIONS) {
      await setDoc(doc(db, 'distributions', dist.id), cleanDocData(dist));
    }

    // 3. Reset kits
    const kitSnap = await getDocs(collection(db, 'kits'));
    for (const d of kitSnap.docs) {
      await deleteDoc(d.ref);
    }
    for (const kit of INITIAL_KITS) {
      await setDoc(doc(db, 'kits', kit.id), cleanDocData(kit));
    }
    console.log('[Cloud Sync] Database reset to initial state completed.');
  } catch (err) {
    console.error('[Cloud Sync] Error during cloud database reset:', err);
    throw err;
  }
}
