import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC<{ variant?: 'header' | 'compact' }> = ({ variant = 'header' }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="inline-flex items-center gap-1 shrink-0" title="Choose Language / भाषा चुनें">
      <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold shrink-0">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap text-xs ${
            language === 'en'
              ? 'bg-white text-blue-600 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap text-xs ${
            language === 'hi'
              ? 'bg-white text-blue-600 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="हिंदी भाषा चुनें"
        >
          हिंदी
        </button>
      </div>
    </div>
  );
};
