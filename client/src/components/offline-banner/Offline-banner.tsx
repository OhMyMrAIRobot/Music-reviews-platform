import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../../hooks/use-online-status';

const OfflineBanner = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed bottom-0 left-0 right-0 z-[4800] border-t border-white/15 bg-[var(--background-dark-secondary)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-sm text-white/90"
    >
      {t('app.offlineBanner')}
    </div>
  );
};

export default OfflineBanner;
