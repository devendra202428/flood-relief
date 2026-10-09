import React, { useState, useRef, useEffect } from 'react';
import { Family, DamageLevel } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { processAndHashImage, findDuplicateHouses, DuplicateHouseMatch } from '../utils/imageHash';
import { SAMPLE_HOUSE_PHOTOS } from '../data/sampleHousePhotos';
import {
  Camera,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  FlipHorizontal,
  Image as ImageIcon,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  existingFamilies: Family[];
  currentPhoto?: string;
  currentHash?: string;
  currentDamageLevel?: DamageLevel;
  onPhotoAccepted: (data: {
    photoUrl: string;
    hash: string;
    damageLevel: DamageLevel;
    duplicateMatches: DuplicateHouseMatch[];
    isOverruled: boolean;
  }) => void;
  onPhotoCleared: () => void;
}

export const HousePhotoCapture: React.FC<Props> = ({
  existingFamilies,
  currentPhoto,
  currentDamageLevel = 'severe',
  onPhotoAccepted,
  onPhotoCleared,
}) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(currentPhoto || null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [damageLevel, setDamageLevel] = useState<DamageLevel>(currentDamageLevel);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateHouseMatch[]>([]);
  const [isDuplicateOverruled, setIsDuplicateOverruled] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting or switching tabs
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start live webcam / mobile camera stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access failed, falling back to upload:', err);
      setCameraError(
        'Could not access camera (device permission denied or no camera available). Please use file upload below.'
      );
      setIsCameraActive(false);
      setActiveMode('upload');
    }
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Analyze newly captured or uploaded image
  const analyzeImage = async (imageSource: HTMLVideoElement | HTMLImageElement | string) => {
    setIsProcessing(true);
    try {
      const { dataUrl, hash } = await processAndHashImage(imageSource);
      setPreviewPhoto(dataUrl);
      setComputedHash(hash);

      // Perform duplicate comparison against existing family records
      const matches = findDuplicateHouses(hash, existingFamilies, 72);
      setDuplicateMatches(matches);
      setIsDuplicateOverruled(false);

      onPhotoAccepted({
        photoUrl: dataUrl,
        hash,
        damageLevel,
        duplicateMatches: matches,
        isOverruled: false,
      });

      stopCamera();
    } catch (err) {
      console.error('Error analyzing house photo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Capture frame from video stream
  const handleSnapCamera = () => {
    if (!videoRef.current) return;
    analyzeImage(videoRef.current);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        analyzeImage(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Sample photo selection for testing duplicate detection
  const handleSelectSample = (sampleDataUrl: string, sampleDamage: DamageLevel) => {
    setDamageLevel(sampleDamage);
    analyzeImage(sampleDataUrl);
  };

  const handleRetake = () => {
    stopCamera();
    setPreviewPhoto(null);
    setComputedHash(null);
    setDuplicateMatches([]);
    setIsDuplicateOverruled(false);
    onPhotoCleared();
  };

  const handleOverruleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsDuplicateOverruled(checked);
    if (previewPhoto && computedHash) {
      onPhotoAccepted({
        photoUrl: previewPhoto,
        hash: computedHash,
        damageLevel,
        duplicateMatches,
        isOverruled: checked,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* If Photo is ALREADY captured/selected -> Show Preview & Duplicate Diagnostics */}
      {previewPhoto ? (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>{t.capturedDwellingPhoto}</span>
              </span>
              <button
                type="button"
                onClick={handleRetake}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
              >
                {t.retakeReplace}
              </button>
            </div>

            {/* Photo preview + Damage level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 max-w-xs">
                <img
                  src={previewPhoto}
                  alt="Captured flood damaged house"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {computedHash ? `dHash: ${computedHash.slice(0, 12)}...` : t.analyzing}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.damageLevelLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={damageLevel}
                    onChange={(e) => {
                      const newLevel = e.target.value as DamageLevel;
                      setDamageLevel(newLevel);
                      if (previewPhoto && computedHash) {
                        onPhotoAccepted({
                          photoUrl: previewPhoto,
                          hash: computedHash,
                          damageLevel: newLevel,
                          duplicateMatches,
                          isOverruled: isDuplicateOverruled,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="submerged">{t.damageSubmerged}</option>
                    <option value="severe">{t.damageSevere}</option>
                    <option value="partial">{t.damagePartial}</option>
                    <option value="inundated">{t.damageInundated}</option>
                  </select>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {t.biometricVerificationTitle}
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {t.biometricVerificationDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DUPLICATE DETECTION RESULTS */}
          {duplicateMatches.length > 0 ? (
            <div className="p-4 bg-red-50 border border-red-300 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5 text-red-900">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm font-bold block text-red-950">
                    {t.duplicateRiskAlert}
                  </strong>
                  <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                    {t.duplicateRiskDesc}{' '}
                    <strong className="font-mono tabular-nums text-red-950 font-bold">
                      {duplicateMatches[0].similarity}% {t.matchScore}
                    </strong>{' '}
                    ({duplicateMatches[0].family.id} - {duplicateMatches[0].family.name})
                  </p>
                </div>
              </div>

              {/* Side-by-side visual comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Captured Photo */}
                <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span>{t.newCapturedPhoto}</span>
                    <span className="text-red-700 font-mono">Input</span>
                  </div>
                  <div className="aspect-4/3 rounded overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={previewPhoto}
                      alt="Current capture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Existing Matched Photo */}
                <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span>{t.matchedExistingRecord}</span>
                    <span className="font-mono font-bold text-red-700 tabular-nums">
                      {duplicateMatches[0].similarity}% {t.matchScore}
                    </span>
                  </div>
                  <div className="aspect-4/3 rounded overflow-hidden bg-slate-100 border border-slate-200">
                    {duplicateMatches[0].family.houseImage ? (
                      <img
                        src={duplicateMatches[0].family.houseImage}
                        alt="Existing matched dwelling"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-700 pt-1 border-t border-slate-100">
                    <div>
                      Household:{' '}
                      <strong className="font-mono text-blue-700">
                        {duplicateMatches[0].family.id}
                      </strong>{' '}
                      — {duplicateMatches[0].family.name}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      {duplicateMatches[0].family.village} · Registered{' '}
                      {new Date(duplicateMatches[0].family.registeredAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supervisor Override Option */}
              <div className="pt-2 border-t border-red-200 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-xs font-semibold text-red-950">
                  <input
                    type="checkbox"
                    checked={isDuplicateOverruled}
                    onChange={handleOverruleToggle}
                    className="rounded text-red-600 focus:ring-red-500 mt-0.5"
                  />
                  <span>
                    {t.supervisorOverrideCheck}
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {t.uniqueDwellingVerified}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Capture / Upload Interface */
        <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {t.photoSectionTitle}
              </span>
              <span className="text-[11px] text-slate-500">
                {t.photoSectionSubtitle}
              </span>
            </div>
            {/* Mode selector */}
            <div className="flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('camera');
                  startCamera();
                }}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeMode === 'camera' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.modeCamera}
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveMode('upload');
                }}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeMode === 'upload' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.modeUpload}
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveMode('samples');
                }}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeMode === 'samples' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.modeSamples}
              </button>
            </div>
          </div>

          {/* Mode 1: Live Camera View */}
          {activeMode === 'camera' && (
            <div className="space-y-3">
              {isCameraActive ? (
                <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-4/3 max-w-md mx-auto border border-slate-800">
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder crosshairs */}
                  <div className="absolute inset-4 border border-white/40 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                    <span className="text-[10px] text-white/80 bg-black/50 px-2 py-0.5 rounded self-start">
                      {t.alignDwellingGuide}
                    </span>
                    <span className="text-[10px] text-white/80 bg-black/50 px-2 py-0.5 rounded self-end">
                      {t.autoHashNotice}
                    </span>
                  </div>

                  {/* Camera Controls Overlay */}
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleFlipCamera}
                      title="Flip Camera"
                      className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-xs"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSnapCamera}
                      disabled={isProcessing}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isProcessing ? t.analyzing : t.snapAndVerify}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      title="Cancel Camera"
                      className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {t.photoSectionTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t.photoSectionSubtitle}
                    </p>
                  </div>
                  {cameraError && (
                    <p className="text-xs text-red-600 max-w-sm mx-auto px-4 font-medium">
                      {t.cameraAccessError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t.launchCamera}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Upload File / Gallery */}
          {activeMode === 'upload' && (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="py-10 text-center border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg bg-slate-50/70 hover:bg-blue-50/30 transition-colors cursor-pointer space-y-2.5"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {t.browsePhotoClick}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t.browsePhotoSupport}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-2xs pointer-events-none"
                >
                  {t.selectPhotoFile}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Mode 3: Test Samples (Crucial for instant testing without camera) */}
          {activeMode === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                {t.trySamplePhotos}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_HOUSE_PHOTOS.map((sample) => {
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample.dataUrl, sample.damageLevel)}
                      className="group p-2 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all space-y-1.5 bg-white"
                    >
                      <div className="aspect-4/3 rounded overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={sample.dataUrl}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <strong className="block text-[11px] text-slate-800 line-clamp-1">
                        {sample.name}
                      </strong>
                      <span className="text-[10px] text-blue-600 font-mono block">
                        {t.trySamplePhotoLink}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
