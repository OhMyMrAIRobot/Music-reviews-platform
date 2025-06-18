import { useLocation } from 'react-router'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { ROUTES } from '../../routes/routes-enum'
import TextReviewSvg from '../review/svg/Text-review-svg'
import PencilSvg from '../svg/Pencil-svg'
import SidebarDelimiter from './Sidebar-delimiter'
import { ISidebarItemProps } from './Sidebar-item'
import SidebarSection from './Sidebar-section'
import AboutSvg from './svg/About-svg'
import AuthorSvg from './svg/Author-svg'
import HomeSvg from './svg/Home-svg'
import LeaderboardSvg from './svg/Leaderboard-svg'
import QuestionSvg from './svg/Question-svg'
import RatingsSvg from './svg/Ratings-svg'
import ReleaseSvg from './svg/Release-svg'

const Sidebar = () => {
	const location = useLocation()
	const {
		navigateToMain,
		navigateToFeedback,
		navigateToAuthors,
		navigateToReviews,
		navigateToReleases,
		navigateToLeaderboard,
		navigateToRatings,
	} = useCustomNavigate()

	const isActive = (path: string) => {
		return location.pathname === path
	}

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

	return (
		<div className='relative z-2000'>
			<aside className='fixed inset-y-0 hidden whitespace-nowrap left-0 w-13.5 hover:w-66 border-r bg-zinc-950 group overflow-hidden lg:flex flex-col border-white/10 transition-all duration-200'>
				<SidebarSection items={sidebarFirstGroup} />
				<SidebarDelimiter />

				<SidebarSection items={sidebarSecondGroup} />
				<SidebarDelimiter />

				<SidebarSection items={sidebarThirdGroup} />

				<div className='mt-auto pb-5'>
					<SidebarSection items={sidebarFourthGroup} />
				</div>
			</aside>
		</div>
	)
}

export default Sidebar
