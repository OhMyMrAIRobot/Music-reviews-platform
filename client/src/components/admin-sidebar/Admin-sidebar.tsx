import { useActivePath } from '../../hooks/use-active-path'
import useNavigationPath from '../../hooks/use-navigation-path'
import { ROUTES } from '../../routes/routes-enum'
import AuthorCommentSvg from '../author-comment/svg/Author-comment-svg'
import LogoutSvg from '../header/svg/Logout-svg'
import ProfileSvg from '../header/svg/Profile-svg'
import TextReviewSvg from '../review/svg/Text-review-svg'
import AuthorSvg from '../sidebar/svg/Author-svg'
import ReleaseSvg from '../sidebar/svg/Release-svg'
import LogoFullSvg from '../svg/Logo-full-svg'
import LogoSmallSvg from '../svg/Logo-small-svg'
import MediaPlayerSvg from '../svg/Media-player-svg'
import PencilSvg from '../svg/Pencil-svg'
import AdminSidebarItem, { IAdminSidebarItemProps } from './Admin-sidebar-item'

const AdminSidebar = () => {
	const {
		navigateToMain,
		navigateToAdminUsers,
		navigateToAdminAuthors,
		navigateToAdminReleases,
		navigateToAdminReviews,
		navigateToAdminFeedback,
		navigateToAdminMedia,
		navigateToAdminAuthorComments,
	} = useNavigationPath()

	const { isActive } = useActivePath()

	const adminSidebarItems: IAdminSidebarItemProps[] = [
		{
			title: 'Релизы',
			isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.RELEASES}`),
			href: navigateToAdminReleases,
			svgIcon: <ReleaseSvg className={'size-5'} />,
		},
		{
			title: 'Пользователи',
			isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.USERS}`),
			href: navigateToAdminUsers,
			svgIcon: <ProfileSvg className={'size-5'} />,
		},
		{
			title: 'Авторы',
			isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHORS}`),
			href: navigateToAdminAuthors,
			svgIcon: <AuthorSvg className={'size-5'} />,
		},
		{
			title: 'Рецензии',
			isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.REVIEWS}`),
			href: navigateToAdminReviews,
			svgIcon: <TextReviewSvg className={'size-5'} />,
		},
		{
			title: 'Медиа',
			isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.MEDIA}`),
			href: navigateToAdminMedia,
			svgIcon: <MediaPlayerSvg className={'size-5'} />,
		},
		{
			title: 'Комментарии авторов',
			isActive: isActive(
				`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHOR_COMMENTS}`
			),
			href: navigateToAdminAuthorComments,
			svgIcon: <AuthorCommentSvg className={'size-5'} />,
		},
		{
			title: 'Сообщения',
			isActive: isActive(`/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.FEEDBACK}`),
			href: navigateToAdminFeedback,
			svgIcon: <PencilSvg className={'size-3.5'} />,
		},
	]

	return (
		<div className='fixed flex flex-col px-2 gap-1.5 inset-0 w-14 lg:w-55 border-r border-white/15 bg-zinc-950 pt-3 pb-5'>
			<span className='w-full pb-2 lg:pb-4 flex justify-center'>
				<LogoFullSvg className={'w-4/5 hidden lg:block'} />
				<LogoSmallSvg className={'w-4/5 lg:hidden'} />
			</span>

			{adminSidebarItems.map(item => (
				<AdminSidebarItem key={item.title} {...item} />
			))}

			<div className='mt-auto'>
				<AdminSidebarItem
					title={'Выйти из панели'}
					isActive={false}
					href={navigateToMain}
					svgIcon={<LogoutSvg className={'size-4'} />}
				/>
			</div>
		</div>
	)
}

export default AdminSidebar
