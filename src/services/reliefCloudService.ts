import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc,
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
    // 1. If local flag or settings indicate already initialized or cleared, NEVER re-seed
    if (typeof window !== 'undefined') {
      if (
        localStorage.getItem('floodrelief_demo_cleared') === 'true' ||
        localStorage.getItem('floodrelief_initialized') === 'true'
      ) {
        return;
      }
    }

    const settingRef = doc(db, 'settings', 'system');
    try {
      const settingSnap = await getDoc(settingRef);
      if (settingSnap.exists()) {
        // System settings already exist. Never re-seed deleted data!
        if (typeof window !== 'undefined') {
          localStorage.setItem('floodrelief_initialized', 'true');
        }
        return;
      }
    } catch {
      // Offline or error reading settings
    }

    // 2. Check if families already has documents in Firestore
    const famSnap = await getDocs(query(collection(db, 'families'), limit(1)));
    if (!famSnap.empty) {
      // Database already has records, mark initialized and exit
      if (typeof window !== 'undefined') {
        localStorage.setItem('floodrelief_initialized', 'true');
      }
      try {
        await setDoc(settingRef, { initialized: true, initializedAt: new Date().toISOString() }, { merge: true });
      } catch {
        // ignore
      }
      return;
    }

    // 3. Only if it is a brand-new pristine database on very first launch:
    console.log('First-time setup: Seeding initial data to Firestore...');
    for (const fam of INITIAL_FAMILIES) {
      await setDoc(doc(db, 'families', fam.id), cleanDocData(fam));
    }
    for (const dist of INITIAL_DISTRIBUTIONS) {
      await setDoc(doc(db, 'distributions', dist.id), cleanDocData(dist));
    }
    for (const kit of INITIAL_KITS) {
      await setDoc(doc(db, 'kits', kit.id), cleanDocData(kit));
    }

    try {
      await setDoc(settingRef, {
        initialized: true,
        demoDataCleared: false,
        seededAt: new Date().toISOString(),
      });
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('floodrelief_initialized', 'true');
    }
    console.log('First-time initialization complete.');
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

export async function deleteFamilyFromCloud(familyId: string): Promise<void> {
  const path = `families/${familyId}`;
  try {
    await deleteDoc(doc(db, 'families', familyId));
    console.log(`[Cloud Sync] Family ${familyId} deleted from Firestore`);
  } catch (err) {
    console.error(`[Cloud Sync] Failed to delete family ${familyId}:`, err);
    handleFirestoreError(err, OperationType.DELETE, path);
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

export async function deleteDistributionFromCloud(distributionId: string): Promise<void> {
  const path = `distributions/${distributionId}`;
  try {
    await deleteDoc(doc(db, 'distributions', distributionId));
    console.log(`[Cloud Sync] Distribution ${distributionId} deleted from Firestore`);
  } catch (err) {
    console.error(`[Cloud Sync] Failed to delete distribution ${distributionId}:`, err);
    handleFirestoreError(err, OperationType.DELETE, path);
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

/**
 * Wipes all demo families and distributions from Firestore, marking the system as cleared
 * so auto-seeding is stopped and real field operations can begin cleanly.
 */
export async function clearAllRecordsAndDemoData(): Promise<void> {
  try {
    // 1. Delete all families in Firestore
    const famSnap = await getDocs(collection(db, 'families'));
    for (const d of famSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 2. Delete all distributions in Firestore
    const distSnap = await getDocs(collection(db, 'distributions'));
    for (const d of distSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 3. Flag in settings that demo data is intentionally cleared
    await setDoc(doc(db, 'settings', 'system'), {
      demoDataCleared: true,
      clearedAt: new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('floodrelief_demo_cleared', 'true');
      localStorage.setItem('floodrelief_initialized', 'true');
    }

    console.log('[Cloud Sync] All demo records cleared from Cloud Firestore.');
  } catch (err) {
    console.error('[Cloud Sync] Error during clearAllRecordsAndDemoData:', err);
    throw err;
  }
}

/**
 * Restores initial demo sample families and distributions for testing/demonstration purposes.
 */
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

    // 4. Remove cleared flag so demo data is maintained
    await setDoc(doc(db, 'settings', 'system'), {
      demoDataCleared: false,
      restoredAt: new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('floodrelief_demo_cleared');
    }

    console.log('[Cloud Sync] Database reset to initial sample state completed.');
  } catch (err) {
    console.error('[Cloud Sync] Error during cloud database reset:', err);
    throw err;
  }
}
