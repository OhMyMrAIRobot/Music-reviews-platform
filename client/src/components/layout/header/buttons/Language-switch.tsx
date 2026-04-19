import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const LOCALES = ['en', 'ru'] as const;

const LanguageSwitch: FC = () => {
  const { i18n, t } = useTranslation();
  const resolved = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];

  return (
    <div
      className="flex h-10 shrink-0 rounded-md border border-white/15 overflow-hidden select-none"
      role="group"
      aria-label={t('header.language')}
    >
      {LOCALES.map((lng, index) => {
        const isActive = resolved === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            aria-pressed={isActive}
            className={`min-w-10 px-3 text-xs font-semibold uppercase transition-colors duration-200 cursor-pointer ${
              index === 0 ? 'border-r border-white/10' : ''
            } ${
              isActive
                ? 'bg-white/15 text-white'
                : 'text-white/55 hover:text-white hover:bg-white/10'
            }`}
          >
            {lng}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
