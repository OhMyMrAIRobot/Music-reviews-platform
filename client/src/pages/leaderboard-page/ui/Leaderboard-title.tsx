import { useTranslation } from 'react-i18next';

const LeaderboardTitle = () => {
  const { t } = useTranslation();
  return (
    <div className="relative py-5 lg:py-12 rounded-2xl overflow-hidden border flex justify-center items-center border-white/10 select-none">
      <div className="z-10 relative text-center max-w-140">
        <h1 className="lg:text-4xl font-bold">
          {t('pages.leaderboard.title')}
        </h1>

        <div className="text-xs lg:text-base mt-1 lg:mt-4 px-2">
          {t('pages.leaderboard.subtitle')}
        </div>
      </div>
      <img
        loading="lazy"
        decoding="async"
        src={`${import.meta.env.VITE_SERVER_URL}/public/assets/leaderboard.png`}
        className="absolute inset-0 size-full"
      />
    </div>
  );
};

export default LeaderboardTitle;
