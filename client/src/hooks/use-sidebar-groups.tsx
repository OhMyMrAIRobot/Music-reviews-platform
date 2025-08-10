import AuthorCommentSvg from '../components/author-comment/svg/Author-comment-svg'
import RegisteredAuthorSvg from '../components/registered-author/svg/Registered-author-svg'
import TextReviewSvg from '../components/review/svg/Text-review-svg'
import { ISidebarItemProps } from '../components/sidebar/Sidebar-item'
import AboutSvg from '../components/sidebar/svg/About-svg'
import AuthorSvg from '../components/sidebar/svg/Author-svg'
import HomeSvg from '../components/sidebar/svg/Home-svg'
import LeaderboardSvg from '../components/sidebar/svg/Leaderboard-svg'
import QuestionSvg from '../components/sidebar/svg/Question-svg'
import RatingsSvg from '../components/sidebar/svg/Ratings-svg'
import ReleaseSvg from '../components/sidebar/svg/Release-svg'
import ActivationSvg from '../components/svg/Activation-svg'
import MediaPlayerSvg from '../components/svg/Media-player-svg'
import PencilSvg from '../components/svg/Pencil-svg'
import { ROUTES } from '../routes/routes-enum'
import { useActivePath } from './use-active-path'
import useNavigationPath from './use-navigation-path'
import { useStore } from './use-store'

export const useSidebarGroups = () => {
	const { authStore } = useStore()

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
	} = useNavigationPath()

	const { isActive } = useActivePath()

	const sidebarFirstGroup: ISidebarItemProps[] = [
		{
			href: navigateToMain,
			icon: <HomeSvg className='size-5' />,
			label: 'Главная',
			active: isActive(ROUTES.MAIN),
		},
		{
			href: navigateToMain,
			icon: <QuestionSvg className='size-5 fill-white' />,
			label: 'Часто задаваемые вопросы',
			active: isActive('123'),
		},
		{
			href: navigateToMain,
			icon: <AboutSvg className='size-6 fill-white' />,
			label: 'О нас',
			active: isActive('456'),
		},
	]

	const sidebarSecondGroup: ISidebarItemProps[] = [
		{
			href: navigateToLeaderboard,
			icon: <LeaderboardSvg className='size-5 fill-white' />,
			label: 'ТОП-90 пользователей',
			active: isActive(`/${ROUTES.LEADERBOARD}`),
		},
		{
			href: navigateToRatings,
			icon: <RatingsSvg className='size-5' />,
			label: 'Рейтинг',
			active: isActive(`/${ROUTES.RATINGS}`),
		},
	]

	const sidebarThirdGroup: ISidebarItemProps[] = [
		{
			href: navigateToAuthorComments,
			icon: <AuthorCommentSvg className='size-5' />,
			label: 'Авторские комментарии',
			active: isActive(`/${ROUTES.AUTHOR_COMMENTS}`),
		},
		{
			href: navigateToRegisteredAuthors,
			icon: <RegisteredAuthorSvg className='size-5' />,
			label: 'Зарегистрированные авторы',
			active: isActive(`/${ROUTES.REGISTERED_AUTHORS}`),
		},
		{
			href: navigateToAuthors,
			icon: <AuthorSvg className='size-5 fill-white' />,
			label: 'Авторы',
			active: isActive(`/${ROUTES.AUTHORS}`),
		},
		{
			href: navigateToReleases,
			icon: <ReleaseSvg className='size-5' />,
			label: 'Релизы',
			active: isActive(`/${ROUTES.RELEASES}`),
		},
		{
			href: navigateToReviews,
			icon: <TextReviewSvg className='size-5 fill-white' />,
			label: 'Рецензии',
			active: isActive(`/${ROUTES.REVIEWS}`),
		},
		{
			href: navigateToMediaReviews,
			icon: <MediaPlayerSvg className='size-5' />,
			label: 'Медиарецензии',
			active: isActive(`/${ROUTES.MEDIA_REVIEWS}`),
		},
	]

	const sidebarFourthGroup: ISidebarItemProps[] = [
		{
			href: navigateToFeedback,
			icon: <PencilSvg className='size-3' />,
			label: 'Обратная связь',
			active: isActive(`/${ROUTES.FEEDBACK}`),
		},
	]

	if (authStore.isAuth && !authStore.user?.isActive) {
		sidebarFourthGroup.push({
			href: navigateToActivation,
			icon: <ActivationSvg className='size-5' />,
			label: 'Активация',
			active: isActive(`/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.ACTIVATE}`),
		})
	}

	return {
		sidebarFirstGroup,
		sidebarSecondGroup,
		sidebarThirdGroup,
		sidebarFourthGroup,
	}
}
