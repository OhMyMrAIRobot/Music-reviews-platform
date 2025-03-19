import BurgerMenuButton from './buttons/BurgerMenuButton'
import FeedbackButton from './buttons/FeedbackButton'
import LoginButton from './buttons/LoginButton'
import LoginIconButton from './buttons/LoginIconButton'
import RegisterButton from './buttons/RegisterButton'
import SearchBar from './SearchBar'

const Header = () => {
	return (
		<header className='sticky top-0 z-100 w-full bg-dark border-b border-[#27272A]/40'>
			<div className='2xl:container flex mx-auto px-3 lg:px-5 h-16 rounded-xl items-center'>
				<h1 className='mr-10 shrink-0'>Some application title</h1>

				<SearchBar />

				<div className='ml-auto flex items-center gap-8 max-lg:hidden'>
					<FeedbackButton />
					<div className='flex gap-3'>
						<LoginButton />
						<RegisterButton />
					</div>
				</div>

				<div className='lg:hidden w-full flex justify-end items-center space-x-1.5'>
					<LoginIconButton />
					<BurgerMenuButton />
				</div>
			</div>
		</header>
	)
}

export default Header
