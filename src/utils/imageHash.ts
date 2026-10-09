import { Family } from '../types';

/**
 * Compresses an image element, video stream, or dataUrl to an optimized storage size
 * and generates a 256-bit perceptual difference hash (dHash) for duplicate detection.
 */
export async function processAndHashImage(
  source: HTMLVideoElement | HTMLImageElement | string
): Promise<{ dataUrl: string; hash: string }> {
  return new Promise((resolve, reject) => {
    const handleElement = (imgOrVideo: HTMLVideoElement | HTMLImageElement) => {
      try {
        // 1. Create storage canvas (max 480x360 for crisp thumbnail & slip printing without blowing storage)
        const storageCanvas = document.createElement('canvas');
        const targetWidth = 480;
        const aspect =
          imgOrVideo instanceof HTMLVideoElement
            ? (imgOrVideo.videoHeight || 3) / (imgOrVideo.videoWidth || 4)
            : (imgOrVideo.naturalHeight || 3) / (imgOrVideo.naturalWidth || 4);
        const targetHeight = Math.round(targetWidth * aspect) || 360;

        storageCanvas.width = targetWidth;
        storageCanvas.height = targetHeight;
        const ctx = storageCanvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2d context');

        ctx.drawImage(imgOrVideo, 0, 0, targetWidth, targetHeight);
        const dataUrl = storageCanvas.toDataURL('image/jpeg', 0.72);

        // 2. Create small 17x16 grayscale canvas for perceptual difference hash (dHash)
        // 17 columns x 16 rows => 16 horizontal gradient comparisons per row = 256 bits
        const hashCanvas = document.createElement('canvas');
        hashCanvas.width = 17;
        hashCanvas.height = 16;
        const hashCtx = hashCanvas.getContext('2d');
        if (!hashCtx) throw new Error('Could not get hash context');

        // Draw downsampled image
        hashCtx.drawImage(storageCanvas, 0, 0, 17, 16);
        const imageData = hashCtx.getImageData(0, 0, 17, 16);
        const pixels = imageData.data;

        // Convert to grayscale values
        const grayMatrix: number[][] = [];
        for (let y = 0; y < 16; y++) {
          const row: number[] = [];
          for (let x = 0; x < 17; x++) {
            const idx = (y * 17 + x) * 4;
            // standard luminosity: 0.299 R + 0.587 G + 0.114 B
            const gray = Math.round(
              pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114
            );
            row.push(gray);
          }
          grayMatrix.push(row);
        }

        // Compute adjacent pixel differences (1 if left < right, 0 otherwise)
        let binaryHash = '';
        for (let y = 0; y < 16; y++) {
          for (let x = 0; x < 16; x++) {
            const left = grayMatrix[y][x];
            const right = grayMatrix[y][x + 1];
            binaryHash += left < right ? '1' : '0';
          }
        }

        resolve({ dataUrl, hash: binaryHash });
      } catch (err) {
        reject(err);
      }
    };

    if (typeof source === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => handleElement(img);
      img.onerror = (e) => reject(e);
      img.src = source;
    } else {
      handleElement(source);
    }
  });
}

/**
 * Calculates similarity between two 256-bit binary perceptual hashes using normalized Hamming distance.
 * Returns a score between 0 and 100 (percentage).
 */
export function calculateHashSimilarity(hashA?: string, hashB?: string): number {
  if (!hashA || !hashB || hashA.length !== hashB.length) return 0;

  let matchingBits = 0;
  const totalBits = hashA.length;

  for (let i = 0; i < totalBits; i++) {
    if (hashA[i] === hashB[i]) {
      matchingBits++;
    }
  }

  return Math.round((matchingBits / totalBits) * 100);
}

export interface DuplicateHouseMatch {
  family: Family;
  similarity: number;
}

/**
 * Searches across all registered families to find existing houses with visual similarity >= threshold (default 75%)
 */
export function findDuplicateHouses(
  newHash: string,
  existingFamilies: Family[],
  threshold = 75
): DuplicateHouseMatch[] {
  if (!newHash) return [];

  const matches: DuplicateHouseMatch[] = [];

  for (const family of existingFamilies) {
    if (!family.houseImageHash) continue;
    const similarity = calculateHashSimilarity(newHash, family.houseImageHash);
    if (similarity >= threshold) {
      matches.push({ family, similarity });
    }
  }

  // Sort highest similarity first
  return matches.sort((a, b) => b.similarity - a.similarity);
}
