import TextReviewSvg from '../components/review/svg/Text-review-svg'
import { ISidebarItemProps } from '../components/sidebar/Sidebar-item'
import AboutSvg from '../components/sidebar/svg/About-svg'
import AuthorSvg from '../components/sidebar/svg/Author-svg'
import HomeSvg from '../components/sidebar/svg/Home-svg'
import LeaderboardSvg from '../components/sidebar/svg/Leaderboard-svg'
import QuestionSvg from '../components/sidebar/svg/Question-svg'
import RatingsSvg from '../components/sidebar/svg/Ratings-svg'
import ReleaseSvg from '../components/sidebar/svg/Release-svg'
import PencilSvg from '../components/svg/Pencil-svg'
import { ROUTES } from '../routes/routes-enum'
import { useActivePath } from './use-active-path'
import useCustomNavigate from './use-custom-navigate'

export const useSidebarGroups = () => {
	const {
		navigateToMain,
		navigateToFeedback,
		navigateToAuthors,
		navigateToReviews,
		navigateToReleases,
		navigateToLeaderboard,
		navigateToRatings,
	} = useCustomNavigate()

	const { isActive } = useActivePath()

	const sidebarFirstGroup: ISidebarItemProps[] = [
		{
			onClick: navigateToMain,
			icon: <HomeSvg className='size-5' />,
			label: 'Главная',
			active: isActive(ROUTES.MAIN),
		},
		{
			onClick: navigateToMain,
			icon: <QuestionSvg className='size-5 fill-white' />,
			label: 'Часто задаваемые вопросы',
			active: isActive('/main'),
		},
		{
			onClick: navigateToMain,
			icon: <AboutSvg className='size-6 fill-white' />,
			label: 'О нас',
			active: isActive('/main'),
		},
	]

	const sidebarSecondGroup: ISidebarItemProps[] = [
		{
			onClick: navigateToLeaderboard,
			icon: <LeaderboardSvg className='size-5 fill-white' />,
			label: 'ТОП-90 пользователей',
			active: isActive(ROUTES.LEADERBOARD),
		},
		{
			onClick: navigateToRatings,
			icon: <RatingsSvg className='size-5' />,
			label: 'Рейтинг',
			active: isActive(ROUTES.RATINGS),
		},
	]

	const sidebarThirdGroup: ISidebarItemProps[] = [
		{
			onClick: navigateToAuthors,
			icon: <AuthorSvg className='size-5 fill-white' />,
			label: 'Авторы',
			active: isActive(ROUTES.AUTHORS),
		},
		{
			onClick: navigateToReviews,
			icon: <TextReviewSvg className='size-5 fill-white' />,
			label: 'Рецензии',
			active: isActive(ROUTES.REVIEWS),
		},
		{
			onClick: navigateToReleases,
			icon: <ReleaseSvg className='size-5' />,
			label: 'Релизы',
			active: isActive(ROUTES.RELEASES),
		},
	]

	const sidebarFourthGroup: ISidebarItemProps[] = [
		{
			onClick: navigateToFeedback,
			icon: <PencilSvg className='size-3' />,
			label: 'Обратная связь',
			active: isActive(ROUTES.FEEDBACK),
		},
	]

	return {
		sidebarFirstGroup,
		sidebarSecondGroup,
		sidebarThirdGroup,
		sidebarFourthGroup,
	}
}
