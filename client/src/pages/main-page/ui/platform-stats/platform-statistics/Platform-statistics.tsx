import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GlobalAppAPI } from '../../../../../api/global-app-api.ts';
import AuthorCommentSvg from '../../../../../components/author/author-comment/svg/Author-comment-svg';
import AuthorLikeSvg from '../../../../../components/author/author-like/svg/Author-like-svg';
import RegisteredAuthorSvg from '../../../../../components/author/registered-author/svg/Registered-author-svg';
import AlbumSvg from '../../../../../components/release/svg/Album-svg';
import SingleSvg from '../../../../../components/release/svg/Single-svg';
import NoTextReviewSvg from '../../../../../components/review/svg/No-text-review-svg';
import TextReviewSvg from '../../../../../components/review/svg/Text-review-svg';
import MediaPlayerSvg from '../../../../../components/svg/Media-player-svg';
import UserSvg from '../../../../../components/svg/User-svg';
import useNavigationPath from '../../../../../hooks/use-navigation-path';
import { platformStatsKeys } from '../../../../../query-keys/platform-stats-keys.ts';
import PlatformStatisticsRow from './Platform-statistics-row';

const PlatformStatistics = () => {
  const { t } = useTranslation();
  const {
    navigateToRegisteredAuthors,
    navigateToAuthorLikes,
    navigateToAuthorComments,
    navigateToReleases,
    navigateToReviews,
    navigateToMediaReviews,
  } = useNavigationPath();

  const { data: stats, isPending } = useQuery({
    queryKey: platformStatsKeys.all,
    queryFn: () => GlobalAppAPI.fetchPlatformStats(),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-1.5 lg:mb-3 mt-1.5">
        <h2 className="text-lg xl:text-xl font-semibold ">
          {t('pages.main.statistics.title')}
        </h2>
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-zinc-900 text-white hover:bg-zinc-900">
          {t('pages.main.statistics.allTime')}
        </div>
      </div>

      <div className="grid gap-0.5 lg:gap-1.5 grid-cols-1">
        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.users')}
          value={stats?.totalUsers ?? 0}
          svg={<UserSvg className="size-5" />}
        />

        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.authors')}
          value={stats?.registeredAuthors ?? 0}
          svg={<RegisteredAuthorSvg className="size-5" />}
          link={navigateToRegisteredAuthors}
        />

        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.authorLikes')}
          value={stats?.authorLikes ?? 0}
          svg={<AuthorLikeSvg className="size-5" />}
          link={navigateToAuthorLikes}
        />

        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.authorComments')}
          value={stats?.authorComments ?? 0}
          svg={<AuthorCommentSvg className="size-5" />}
          link={navigateToAuthorComments}
        />
      </div>

      <div
        data-orientation="horizontal"
        role="none"
        className="shrink-0 h-[1px] w-full border border-white/10 border-dashed my-3 bg-transparent"
      />

      <div className="grid gap-0.5 lg:gap-1.5 grid-cols-1">
        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.singles')}
          value={stats?.totalTracks ?? 0}
          svg={<SingleSvg className="size-5" />}
          link={navigateToReleases}
        />

        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.albums')}
          value={stats?.totalAlbums ?? 0}
          svg={<AlbumSvg className="size-5" />}
          link={navigateToReleases}
        />
      </div>

      <div
        data-orientation="horizontal"
        role="none"
        className="shrink-0 h-[1px] w-full border border-white/10 border-dashed my-3 bg-transparent"
      />

      <div className="grid gap-0.5 lg:gap-1.5 grid-cols-1">
        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.reviews')}
          value={stats?.reviews ?? 0}
          svg={<TextReviewSvg className="size-5" />}
          link={navigateToReviews}
        />

        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.marksNoReview')}
          value={stats?.withoutTextRatings ?? 0}
          svg={<NoTextReviewSvg className="size-5" />}
        />

        <PlatformStatisticsRow
          isLoading={isPending}
          title={t('pages.main.statistics.mediaReviews')}
          value={stats?.mediaReviews ?? 0}
          svg={<MediaPlayerSvg className="size-5" />}
          link={navigateToMediaReviews}
        />
      </div>
    </div>
  );
};

export default PlatformStatistics;
