import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Smartphone,
  Download,
  Share2,
  MoreVertical,
  PlusSquare,
  Check,
  Copy,
  X,
  ExternalLink,
} from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const { t } = useTranslation();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [copiedLink, setCopiedLink] = useState(false);

  // If already installed and launched from home screen in standalone mode
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer shadow-xs"
        title={t.installAppTitle}
      >
        <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="hidden sm:inline">{t.installAppBtn}</span>
        <span className="sm:hidden">{t.installAppBtn.split(' ')[0]}</span>
      </button>

      {/* Guided Modal for Android & iPhone Installation */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold leading-tight">
                    {t.installAppTitle}
                  </h3>
                </div>
                <p className="text-[11px] text-blue-100 leading-snug">
                  {t.installAppSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If direct native install prompt is available, show 1-click install banner */}
            {isInstallable && (
              <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between gap-2">
                <div className="text-xs text-blue-900 font-medium">
                  {isAndroid ? 'Android Prompt Ready' : 'Instant Install Ready'}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const accepted = await install();
                    if (accepted) setShowGuideModal(false);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>1-Click Install</span>
                </button>
              </div>
            )}

            {/* Operating System Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveGuideTab('android')}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
                  activeGuideTab === 'android'
                    ? 'border-blue-600 text-blue-600 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.installAndroidTitle}
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('ios')}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
                  activeGuideTab === 'ios'
                    ? 'border-blue-600 text-blue-600 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.installIOSTitle}
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="p-5 space-y-4">
              {activeGuideTab === 'android' ? (
                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <span>Chrome Menu</span>
                        <MoreVertical className="w-3.5 h-3.5 text-slate-500 inline" />
                      </div>
                      <p className="mt-0.5 text-slate-600 leading-relaxed">
                        {t.installAndroidStep1}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <span>Install App</span>
                        <Download className="w-3.5 h-3.5 text-slate-500 inline" />
                      </div>
                      <p className="mt-0.5 text-slate-600 leading-relaxed">
                        {t.installAndroidStep2}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <span>Done!</span>
                        <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </div>
                      <p className="mt-0.5 text-slate-600 leading-relaxed">
                        {t.installAndroidStep3}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <span>Safari Share Button</span>
                        <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                      </div>
                      <p className="mt-0.5 text-slate-600 leading-relaxed">
                        {t.installIOSStep1}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <span>Add to Home Screen</span>
                        <PlusSquare className="w-3.5 h-3.5 text-slate-500 inline" />
                      </div>
                      <p className="mt-0.5 text-slate-600 leading-relaxed">
                        {t.installIOSStep2}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <span>Tap "Add"</span>
                        <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </div>
                      <p className="mt-0.5 text-slate-600 leading-relaxed">
                        {t.installIOSStep3}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Share / Copy Link Helper */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  Open link on mobile:
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy App Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Close */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
