import { useTranslation } from 'react-i18next';
import AlbumValueSvg from '../components/album-value/svg/Album-value-svg';
import AuthorCommentSvg from '../components/author/author-comment/svg/Author-comment-svg';
import AuthorLikeSvg from '../components/author/author-like/svg/Author-like-svg';
import RegisteredAuthorSvg from '../components/author/registered-author/svg/Registered-author-svg';
import { ISidebarItemProps } from '../components/layout/sidebar/Sidebar-item';
import AboutSvg from '../components/layout/sidebar/svg/About-svg';
import AuthorSvg from '../components/layout/sidebar/svg/Author-svg';
import HomeSvg from '../components/layout/sidebar/svg/Home-svg';
import LeaderboardSvg from '../components/layout/sidebar/svg/Leaderboard-svg';
import QuestionSvg from '../components/layout/sidebar/svg/Question-svg';
import RatingsSvg from '../components/layout/sidebar/svg/Ratings-svg';
import ReleaseSvg from '../components/layout/sidebar/svg/Release-svg';
import TextReviewSvg from '../components/review/svg/Text-review-svg';
import ActivationSvg from '../components/svg/Activation-svg';
import AwardSvg from '../components/svg/Award-svg';
import MediaPlayerSvg from '../components/svg/Media-player-svg';
import PencilSvg from '../components/svg/Pencil-svg';
import { ROUTES } from '../routes/routes-enum';
import { useActivePath } from './use-active-path';
import useNavigationPath from './use-navigation-path';
import { useStore } from './use-store';

/**
 * Custom hook to generate sidebar navigation groups based on user authentication status and active path.
 * This hook dynamically builds arrays of sidebar items for different sections of the application,
 * including conditional items based on whether the user is authenticated and account activation status.
 *
 * @returns An object containing sidebar item groups:
 * - `sidebarFirstGroup`: Array of primary navigation items (e.g., Home, FAQ, About, Become Author if authenticated).
 * - `sidebarSecondGroup`: Array of leaderboard and awards related items (e.g., Leaderboard, Album Values, Ratings, Awards).
 * - `sidebarThirdGroup`: Array of content-related items (e.g., Author Likes, Comments, Authors, Releases, Reviews).
 * - `sidebarFourthGroup`: Array of utility items (e.g., Feedback, Activation if not active).
 */
export const useSidebarGroups = () => {
  const { t } = useTranslation();
  const { authStore } = useStore();

  const {
    navigateToMain,
    navigateToFeedback,
    navigateToAuthors,
    navigateToReviews,
    navigateToReleases,
    navigateToLeaderboard,
    navigateToRatings,
    navigateToActivation,
    navigateToMediaReviews,
    navigateToAuthorComments,
    navigateToRegisteredAuthors,
    navigateToAuthorConfirmation,
    navigateToAuthorLikes,
    navigateToAwards,
    navigateToAlbumValues,
  } = useNavigationPath();

  const { isActive } = useActivePath();

  const sidebarFirstGroup: ISidebarItemProps[] = [
    {
      id: 'nav-home',
      href: navigateToMain,
      icon: <HomeSvg className="size-5" />,
      label: t('layout.sidebar.nav.home'),
      active: isActive(ROUTES.MAIN),
    },
    {
      id: 'nav-faq',
      href: navigateToMain,
      icon: <QuestionSvg className="size-5 fill-white" />,
      label: t('layout.sidebar.nav.faq'),
      active: isActive('123'),
    },
    {
      id: 'nav-about',
      href: navigateToMain,
      icon: <AboutSvg className="size-6 fill-white" />,
      label: t('layout.sidebar.nav.about'),
      active: isActive('456'),
    },
  ];

  if (authStore.isAuth) {
    sidebarFirstGroup.push({
      id: 'nav-become-author',
      href: navigateToAuthorConfirmation,
      icon: <ActivationSvg className="size-5.5" />,
      label: t('layout.sidebar.nav.becomeAuthor'),
      active: isActive(`/${ROUTES.AUTHOR_CONFIRMATION}`),
    });
  }

  const sidebarSecondGroup: ISidebarItemProps[] = [
    {
      id: 'nav-leaderboard',
      href: navigateToLeaderboard,
      icon: <LeaderboardSvg className="size-5 fill-white" />,
      label: t('layout.sidebar.nav.leaderboardTop90'),
      active: isActive(`/${ROUTES.LEADERBOARD}`),
    },
    {
      id: 'nav-album-values',
      href: navigateToAlbumValues,
      icon: <AlbumValueSvg className="size-5" />,
      label: t('layout.sidebar.nav.albumValues'),
      active: isActive(`/${ROUTES.ALBUM_VALUES}`),
    },
    {
      id: 'nav-ratings',
      href: navigateToRatings,
      icon: <RatingsSvg className="size-5" />,
      label: t('layout.sidebar.nav.ratings'),
      active: isActive(`/${ROUTES.RATINGS}`),
    },
    {
      id: 'nav-awards',
      href: navigateToAwards,
      icon: <AwardSvg className="size-5" />,
      label: t('layout.sidebar.nav.awards'),
      active: isActive(`/${ROUTES.AWARDS}`),
    },
  ];

  const sidebarThirdGroup: ISidebarItemProps[] = [
    {
      id: 'nav-author-likes',
      href: navigateToAuthorLikes,
      icon: <AuthorLikeSvg className="size-5" />,
      label: t('layout.sidebar.nav.authorLikes'),
      active: isActive(`/${ROUTES.AUTHOR_LIKES}`),
    },
    {
      id: 'nav-author-comments',
      href: navigateToAuthorComments,
      icon: <AuthorCommentSvg className="size-5" />,
      label: t('layout.sidebar.nav.authorComments'),
      active: isActive(`/${ROUTES.AUTHOR_COMMENTS}`),
    },
    {
      id: 'nav-registered-authors',
      href: navigateToRegisteredAuthors,
      icon: <RegisteredAuthorSvg className="size-5" />,
      label: t('layout.sidebar.nav.registeredAuthors'),
      active: isActive(`/${ROUTES.REGISTERED_AUTHORS}`),
    },
    {
      id: 'nav-authors',
      href: navigateToAuthors,
      icon: <AuthorSvg className="size-5 fill-white" />,
      label: t('layout.sidebar.nav.authors'),
      active: isActive(`/${ROUTES.AUTHORS}`),
    },
    {
      id: 'nav-releases',
      href: navigateToReleases,
      icon: <ReleaseSvg className="size-5" />,
      label: t('layout.sidebar.nav.releases'),
      active: isActive(`/${ROUTES.RELEASES}`),
    },
    {
      id: 'nav-reviews',
      href: navigateToReviews,
      icon: <TextReviewSvg className="size-5 fill-white" />,
      label: t('layout.sidebar.nav.reviews'),
      active: isActive(`/${ROUTES.REVIEWS}`),
    },
    {
      id: 'nav-media-reviews',
      href: navigateToMediaReviews,
      icon: <MediaPlayerSvg className="size-5" />,
      label: t('layout.sidebar.nav.mediaReviews'),
      active: isActive(`/${ROUTES.MEDIA_REVIEWS}`),
    },
  ];

  const sidebarFourthGroup: ISidebarItemProps[] = [
    {
      id: 'nav-feedback',
      href: navigateToFeedback,
      icon: <PencilSvg className="size-3" />,
      label: t('layout.sidebar.nav.feedback'),
      active: isActive(`/${ROUTES.FEEDBACK}`),
    },
  ];

  if (authStore.isAuth && !authStore.user?.isActive) {
    sidebarFourthGroup.push({
      id: 'nav-activation',
      href: navigateToActivation,
      icon: <ActivationSvg className="size-5.5" />,
      label: t('layout.sidebar.nav.activation'),
      active: isActive(`/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.ACTIVATE}`),
    });
  }

  return {
    sidebarFirstGroup,
    sidebarSecondGroup,
    sidebarThirdGroup,
    sidebarFourthGroup,
  };
};
