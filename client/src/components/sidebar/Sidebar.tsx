import useCustomNavigate from '../../hooks/UseCustomNavigate'
import {
	AboutSvgIcon,
	AuthorsCommentsSvgIcon,
	AuthorsLikeSvgIcon,
	AuthorsSvgIcon,
	AwardSvgIcon,
	FeedbackSvgIcon,
	HomeSvgIcon,
	NinetySvgIcon,
	QuestionSvgIcon,
	RatingSvgIcon,
	RegisteredAuthorsSvgIcon,
	RelisesSvgIcon,
	ReviewsSvgIcon,
} from './SidebarIcons'
import { ISidebarItemProps } from './SidebarItem'
import SidebarSection from './SidebarSection'

const Sidebar = () => {
	const { navigateToMain, navigateToFeedback } = useCustomNavigate()

	const sidebarFirstGroup: ISidebarItemProps[] = [
		{
			id: 'side-home',
			onClick: navigateToMain,
			icon: <HomeSvgIcon className='size-5' />,
			label: 'Главная',
		},
		{
			id: 'side-questions',
			onClick: navigateToMain,
			icon: <QuestionSvgIcon className='size-5 fill-white' />,
			label: 'Часто задаваемые вопросы',
		},
		{
			id: 'side-about',
			onClick: navigateToMain,
			icon: <AboutSvgIcon className='size-6 fill-white' />,
			label: 'Главная',
		},
	]

	const sidebarSecondGroup: ISidebarItemProps[] = [
		{
			id: 'side-top-90',
			onClick: navigateToMain,
			icon: <NinetySvgIcon className='size-5 fill-white' />,
			label: 'ТОП-90 пользователей',
		},
		{
			id: 'side-rating',
			onClick: navigateToMain,
			icon: <RatingSvgIcon className='size-5' />,
			label: 'Рейтинг',
		},
		{
			id: 'side-awards',
			onClick: navigateToMain,
			icon: <AwardSvgIcon className='size-5' />,
			label: 'Премия',
		},
	]

	const sidebarThirdGroup: ISidebarItemProps[] = [
		{
			id: 'side-authors-likes',
			onClick: navigateToMain,
			icon: <AuthorsLikeSvgIcon className='size-5 fill-white' />,
			label: 'Авторские лайки',
		},
		{
			id: 'side-authors-comments',
			onClick: navigateToMain,
			icon: <AuthorsCommentsSvgIcon className='size-5 fill-white' />,
			label: 'Авторские комментарии',
		},
		{
			id: 'side-registered-authors',
			onClick: navigateToMain,
			icon: <RegisteredAuthorsSvgIcon className='size-5 fill-white' />,
			label: 'Зарегистрированные авторы',
		},
		{
			id: 'side-authors',
			onClick: navigateToMain,
			icon: <AuthorsSvgIcon className='size-5 fill-white' />,
			label: 'Авторы',
		},
		{
			id: 'side-reviews',
			onClick: navigateToMain,
			icon: <ReviewsSvgIcon className='size-5 fill-white' />,
			label: 'Рецензии',
		},
		{
			id: 'side-relises',
			onClick: navigateToMain,
			icon: <RelisesSvgIcon className='size-5' />,
			label: 'Релизы',
		},
	]

	const sidebarFourthGroup: ISidebarItemProps[] = [
		{
			id: 'side-feedback',
			onClick: navigateToFeedback,
			icon: <FeedbackSvgIcon className='size-3' />,
			label: 'Обратная связь',
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
			<aside className='fixed inset-y-0 hidden whitespace-nowrap left-0 w-14 hover:w-66 border-r bg-primary group overflow-hidden lg:flex flex-col border-white/15 transition-all duration-200'>
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
