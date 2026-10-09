import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Family, Distribution, KitTypeInfo } from '../types';
import { INITIAL_FAMILIES, INITIAL_DISTRIBUTIONS, INITIAL_KITS } from '../data/initialData';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';

export async function seedInitialFirestoreDataIfEmpty() {
  const familiesRef = collection(db, 'families');
  try {
    const snap = await getDocs(query(familiesRef, limit(1)));
    if (snap.empty) {
      console.log('Seeding initial relief data to Firestore...');
      // Seed families
      for (const fam of INITIAL_FAMILIES) {
        await setDoc(doc(db, 'families', fam.id), fam);
      }
      // Seed distributions
      for (const dist of INITIAL_DISTRIBUTIONS) {
        await setDoc(doc(db, 'distributions', dist.id), dist);
      }
      // Seed kits
      for (const kit of INITIAL_KITS) {
        await setDoc(doc(db, 'kits', kit.id), kit);
      }
      console.log('Seeding complete.');
    }
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
      handleFirestoreError(error, OperationType.LIST, path);
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
      handleFirestoreError(error, OperationType.LIST, path);
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
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveFamilyToCloud(family: Family): Promise<void> {
  const path = `families/${family.id}`;
  try {
    await setDoc(doc(db, 'families', family.id), family);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function saveDistributionToCloud(dist: Distribution): Promise<void> {
  const path = `distributions/${dist.id}`;
  try {
    await setDoc(doc(db, 'distributions', dist.id), dist);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function saveKitStockToCloud(kitId: string, newStock: number): Promise<void> {
  const path = `kits/${kitId}`;
  try {
    await setDoc(doc(db, 'kits', kitId), { totalStock: newStock }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}
