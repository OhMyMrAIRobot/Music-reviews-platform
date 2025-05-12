import { observer } from 'mobx-react-lite'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { useStore } from '../../hooks/UseStore'
import BurgerMenuButton from './buttons/BurgerMenuButton'
import FeedbackButton from './buttons/FeedbackButton'
import LoginButton from './buttons/LoginButton'
import LoginIconButton from './buttons/LoginIconButton'
import ProfileButton from './buttons/ProfileButton'
import RegisterButton from './buttons/RegisterButton'
import SearchBar from './SearchBar'

const Header = observer(() => {
	const { navigateToLogin, navigateToRegistration } = useCustomNavigate()
	const { authStore } = useStore()

	return (
		<header className='sticky top-0 z-1000 w-full bg-[#09090B]/60 border-b border-[#27272A]/40 backdrop-blur-3xl'>
			<div className='2xl:container flex mx-auto h-16 rounded-xl items-center p-5'>
				<h1 className='mr-10 shrink-0'>Риса за творчество</h1>

				<SearchBar />

				<div className='ml-auto flex items-center gap-8 max-lg:hidden'>
					<FeedbackButton />
					{!authStore.isAuth && (
						<div className='flex gap-3'>
							<LoginButton onClick={navigateToLogin} />
							<RegisterButton onClick={navigateToRegistration} />
						</div>
					)}

					{authStore.isAuth && <ProfileButton />}
				</div>

				<div className='lg:hidden w-full flex justify-end items-center space-x-1.5'>
					{authStore.isAuth ? (
						<ProfileButton />
					) : (
						<LoginIconButton onClick={navigateToLogin} />
					)}
					<BurgerMenuButton />
				</div>
			</div>
		</header>
	)
})

export default Header
