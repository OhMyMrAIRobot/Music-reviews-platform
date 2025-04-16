import { useLocation } from 'react-router'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { ROUTES } from '../../routes/Routes'
import {
	AboutSvgIcon,
	AuthorsSvgIcon,
	FeedbackSvgIcon,
	HomeSvgIcon,
	NinetySvgIcon,
	QuestionSvgIcon,
	RatingSvgIcon,
	RelisesSvgIcon,
	ReviewsSvgIcon,
} from './SidebarIcons'
import { ISidebarItemProps } from './SidebarItem'
import SidebarSection from './SidebarSection'

const Sidebar = () => {
	const location = useLocation()
	const {
		navigateToMain,
		navigateToFeedback,
		navigateToAuthors,
		navigateToReviews,
	} = useCustomNavigate()

	const isActive = (path: string) => {
		return location.pathname === path
	}

	const sidebarFirstGroup: ISidebarItemProps[] = [
		{
			id: 'side-home',
			onClick: navigateToMain,
			icon: <HomeSvgIcon className='size-5' />,
			label: 'Главная',
			active: isActive(ROUTES.MAIN),
		},
		{
			id: 'side-questions',
			onClick: navigateToMain,
			icon: <QuestionSvgIcon className='size-5 fill-white' />,
			label: 'Часто задаваемые вопросы',
			active: isActive('/main'),
		},
		{
			id: 'side-about',
			onClick: navigateToMain,
			icon: <AboutSvgIcon className='size-6 fill-white' />,
			label: 'О нас',
			active: isActive('/main'),
		},
	]

	const sidebarSecondGroup: ISidebarItemProps[] = [
		{
			id: 'side-top-90',
			onClick: navigateToMain,
			icon: <NinetySvgIcon className='size-5 fill-white' />,
			label: 'ТОП-90 пользователей',
			active: isActive('/main'),
		},
		{
			id: 'side-rating',
			onClick: navigateToMain,
			icon: <RatingSvgIcon className='size-5' />,
			label: 'Рейтинг',
			active: isActive('/main'),
		},
		// {
		// 	id: 'side-awards',
		// 	onClick: navigateToMain,
		// 	icon: <AwardSvgIcon className='size-5' />,
		// 	label: 'Премия',
		// 	active: isActive('/main'),
		// },
	]

	const sidebarThirdGroup: ISidebarItemProps[] = [
		// {
		// 	id: 'side-authors-likes',
		// 	onClick: navigateToMain,
		// 	icon: <AuthorsLikeSvgIcon className='size-5 fill-white' />,
		// 	label: 'Авторские лайки',
		// 	active: isActive('/main'),
		// },
		// {
		// 	id: 'side-authors-comments',
		// 	onClick: navigateToMain,
		// 	icon: <AuthorsCommentsSvgIcon className='size-5 fill-white' />,
		// 	label: 'Авторские комментарии',
		// 	active: isActive('/main'),
		// },
		// {
		// 	id: 'side-registered-authors',
		// 	onClick: navigateToMain,
		// 	icon: <RegisteredAuthorsSvgIcon className='size-5 fill-white' />,
		// 	label: 'Зарегистрированные авторы',
		// 	active: isActive('/main'),
		// },
		{
			id: 'side-authors',
			onClick: navigateToAuthors,
			icon: <AuthorsSvgIcon className='size-5 fill-white' />,
			label: 'Авторы',
			active: isActive(ROUTES.AUTHORS),
		},
		{
			id: 'side-reviews',
			onClick: navigateToReviews,
			icon: <ReviewsSvgIcon className='size-5 fill-white' />,
			label: 'Рецензии',
			active: isActive(ROUTES.REVIEWS),
		},
		{
			id: 'side-relises',
			onClick: navigateToMain,
			icon: <RelisesSvgIcon className='size-5' />,
			label: 'Релизы',
			active: isActive('/main'),
		},
	]

	const sidebarFourthGroup: ISidebarItemProps[] = [
		{
			id: 'side-feedback',
			onClick: navigateToFeedback,
			icon: <FeedbackSvgIcon className='size-3' />,
			label: 'Обратная связь',
			active: isActive(ROUTES.FEEDBACK),
		},
	]

	const Delimiter = () => {
		return (
			<div className='px-2'>
				<div className='w-full border-b border-white/15' />
			</div>
		)
	}

	return (
		<div className='relative z-200'>
			<aside className='fixed inset-y-0 hidden whitespace-nowrap left-0 w-13 hover:w-66 border-r bg-primary group overflow-hidden lg:flex flex-col border-white/15 transition-all duration-200'>
				<SidebarSection items={sidebarFirstGroup} />
				<Delimiter />
				<SidebarSection items={sidebarSecondGroup} />
				<Delimiter />
				<SidebarSection items={sidebarThirdGroup} />
				<div className='mt-auto pb-5'>
					<SidebarSection items={sidebarFourthGroup} />
				</div>
			</aside>
		</div>
	)
}

export default Sidebar
