import { useTranslation } from 'react-i18next';
import { useActivePath } from '../../../hooks/use-active-path';
import useNavigationPath from '../../../hooks/use-navigation-path';
import { ROUTES } from '../../../routes/routes-enum';
import AuthorCommentSvg from '../../author/author-comment/svg/Author-comment-svg';
import RegisteredAuthorSvg from '../../author/registered-author/svg/Registered-author-svg';
import TextReviewSvg from '../../review/svg/Text-review-svg';
import MediaPlayerSvg from '../../svg/Media-player-svg';
import PencilSvg from '../../svg/Pencil-svg';
import LogoutSvg from '../header/svg/Logout-svg';
import ProfileSvg from '../header/svg/Profile-svg';
import AuthorSvg from '../sidebar/svg/Author-svg';
import ReleaseSvg from '../sidebar/svg/Release-svg';
import AdminSidebarItem, { IAdminSidebarItemProps } from './Admin-sidebar-item';

const AdminSidebar = () => {
  const { t } = useTranslation();

  const {
    navigateToMain,
    navigateToAdminUsers,
    navigateToAdminAuthors,
    navigateToAdminReleases,
    navigateToAdminReviews,
    navigateToAdminFeedback,
    navigateToAdminMedia,
    navigateToAdminAuthorComments,
    navigateToAdminAuthorConfirmation,
  } = useNavigationPath();

  const { isActive } = useActivePath();

  const adminSidebarItems: IAdminSidebarItemProps[] = [
    {
      title: t('layout.admin.sidebar.releases'),
      isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.RELEASES}`),
      href: navigateToAdminReleases,
      svgIcon: <ReleaseSvg className={'size-4 lg:size-5'} />,
    },
    {
      title: t('layout.admin.sidebar.users'),
      isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.USERS}`),
      href: navigateToAdminUsers,
      svgIcon: <ProfileSvg className={'size-4 lg:size-5'} />,
    },
    {
      title: t('layout.admin.sidebar.authors'),
      isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHORS}`),
      href: navigateToAdminAuthors,
      svgIcon: <AuthorSvg className={'size-4 lg:size-5'} />,
    },
    {
      title: t('layout.admin.sidebar.reviews'),
      isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.REVIEWS}`),
      href: navigateToAdminReviews,
      svgIcon: <TextReviewSvg className={'size-4 lg:size-5'} />,
    },
    {
      title: t('layout.admin.sidebar.media'),
      isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.MEDIA}`),
      href: navigateToAdminMedia,
      svgIcon: <MediaPlayerSvg className={'size-4 lg:size-5'} />,
    },
    {
      title: t('layout.admin.sidebar.authorComments'),
      isActive: isActive(
        `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHOR_COMMENTS}`
      ),
      href: navigateToAdminAuthorComments,
      svgIcon: <AuthorCommentSvg className={'size-4 lg:size-5'} />,
    },
    {
      title: t('layout.admin.sidebar.authorVerification'),
      isActive: isActive(
        `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHOR_CONFIRMATION}`
      ),
      href: navigateToAdminAuthorConfirmation,
      svgIcon: <RegisteredAuthorSvg className={'size-4 lg:size-5'} />,
    },
    {
      title: t('layout.admin.sidebar.messages'),
      isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.FEEDBACK}`),
      href: navigateToAdminFeedback,
      svgIcon: <PencilSvg className={'size-2.5 lg:size-3.5'} />,
    },
  ];

  return (
    <div className="fixed flex flex-col px-2 gap-1.5 inset-0 w-12 lg:w-55 border-r border-white/15 bg-zinc-950 pt-3 pb-5">
      {adminSidebarItems.map((item) => (
        <AdminSidebarItem key={item.href} {...item} />
      ))}

      <div className="mt-auto">
        <AdminSidebarItem
          title={t('layout.admin.logoutPanel')}
          isActive={false}
          href={navigateToMain}
          svgIcon={<LogoutSvg className={'size-3 lg:size-4'} />}
        />
      </div>
    </div>
  );
};

export default AdminSidebar;
