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
	const sidebarFirstGroup: ISidebarItemProps[] = [
		{
			id: 'side-home',
			href: '/',
			icon: <HomeSvgIcon className='size-5' />,
			label: 'Главная',
		},
		{
			id: 'side-questions',
			href: '/',
			icon: <QuestionSvgIcon className='size-5 fill-white' />,
			label: 'Часто задаваемые вопросы',
		},
		{
			id: 'side-about',
			href: '/',
			icon: <AboutSvgIcon className='size-6 fill-white' />,
			label: 'Главная',
		},
	]

	const sidebarSecondGroup: ISidebarItemProps[] = [
		{
			id: 'side-top-90',
			href: '/',
			icon: <NinetySvgIcon className='size-5 fill-white' />,
			label: 'ТОП-90 пользователей',
		},
		{
			id: 'side-rating',
			href: '/',
			icon: <RatingSvgIcon className='size-5' />,
			label: 'Рейтинг',
		},
		{
			id: 'side-awards',
			href: '/',
			icon: <AwardSvgIcon className='size-5' />,
			label: 'Премия',
		},
	]

	const sidebarThirdGroup: ISidebarItemProps[] = [
		{
			id: 'side-authors-likes',
			href: '/',
			icon: <AuthorsLikeSvgIcon className='size-5 fill-white' />,
			label: 'Авторские лайки',
		},
		{
			id: 'side-authors-comments',
			href: '/',
			icon: <AuthorsCommentsSvgIcon className='size-5 fill-white' />,
			label: 'Авторские комментарии',
		},
		{
			id: 'side-registered-authors',
			href: '/',
			icon: <RegisteredAuthorsSvgIcon className='size-5 fill-white' />,
			label: 'Зарегистрированные авторы',
		},
		{
			id: 'side-authors',
			href: '/',
			icon: <AuthorsSvgIcon className='size-5 fill-white' />,
			label: 'Авторы',
		},
		{
			id: 'side-reviews',
			href: '/',
			icon: <ReviewsSvgIcon className='size-5 fill-white' />,
			label: 'Рецензии',
		},
		{
			id: 'side-relises',
			href: '/',
			icon: <RelisesSvgIcon className='size-5' />,
			label: 'Релизы',
		},
	]

	const sidebarFourthGroup: ISidebarItemProps[] = [
		{
			id: 'side-feedback',
			href: '/',
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
