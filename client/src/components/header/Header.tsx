import { observer } from 'mobx-react-lite'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { useStore } from '../../hooks/use-store'
import LogoFullSvg from '../svg/Logo-full-svg'
import BurgerMenuButton from './buttons/Burger-menu-button'
import FeedbackButton from './buttons/Feedback-button'
import HeaderButton from './buttons/Header-button'
import LoginIconButton from './buttons/Login-icon-button'
import ProfileButton from './buttons/Profile-button'
import SearchBar from './Search-bar'

const Header = observer(() => {
	const { authStore } = useStore()

	const { navigateToLogin, navigateToRegistration, navigateToMain } =
		useCustomNavigate()

	return (
		<header className='sticky top-0 z-1000 w-full bg-[#09090B]/60 border-b border-[#27272A]/40 backdrop-blur-3xl'>
			<div className='2xl:container flex mx-auto h-16 rounded-xl items-center p-5'>
				<button
					onClick={navigateToMain}
					className='w-[150px] h-[50px] mr-10 shrink-0 flex items-center justify-center cursor-pointer'
				>
					<LogoFullSvg className={''} />
				</button>

				<SearchBar />

				<div className='ml-auto flex items-center gap-8 max-lg:hidden'>
					<FeedbackButton />

					{!authStore.isAuth && (
						<div className='flex gap-3'>
							<HeaderButton
								onClick={navigateToLogin}
								isInvert={false}
								title={'Войти'}
							/>
							<HeaderButton
								onClick={navigateToRegistration}
								isInvert={true}
								title={'Регистрация'}
							/>
						</div>
					)}

					{authStore.isAuth && <ProfileButton />}
				</div>

				<div className='flex lg:hidden w-full justify-end items-center space-x-1.5'>
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
