import { observer } from 'mobx-react-lite'
import { Link } from 'react-router'
import useNavigationPath from '../../hooks/use-navigation-path'
import { useSidebarOverlay } from '../../hooks/use-sidebar-overlay'
import { useStore } from '../../hooks/use-store'
import AboutSvg from '../sidebar/svg/About-svg'
import LogoFullSvg from '../svg/Logo-full-svg'
import PencilSvg from '../svg/Pencil-svg'
import BurgerMenuButton from './buttons/Burger-menu-button'
import HeaderButton from './buttons/Header-button'
import HeaderSvgButton from './buttons/Header-svg-button'
import LoginIconButton from './buttons/Login-icon-button'
import ProfileButton from './buttons/Profile-button'
import SearchBar from './Search-bar'

const Header = observer(() => {
	const { authStore } = useStore()

	const { openSidebarOverlay } = useSidebarOverlay()

	const {
		navigateToLogin,
		navigateToRegistration,
		navigateToMain,
		navigateToFeedback,
		navigateToActivation,
	} = useNavigationPath()

	return (
		<header className='sticky top-0 z-1000 w-full bg-[#09090B]/60 border-b border-[#27272A]/40 backdrop-blur-3xl'>
			<div className='2xl:container flex mx-auto h-16 rounded-xl items-center p-5'>
				<Link
					to={navigateToMain}
					className='w-[150px] h-[50px] mr-10 shrink-0 flex items-center justify-center cursor-pointer'
				>
					<LogoFullSvg />
				</Link>

				<SearchBar className={'hidden lg:flex lg:w-[400px]'} />

				<div className='ml-auto hidden lg:flex items-center gap-8'>
					{authStore.user?.isActive === false && (
						<Link to={navigateToActivation}>
							<HeaderSvgButton title={'Активация аккаунта'}>
								<AboutSvg className={'size-5'} />
							</HeaderSvgButton>
						</Link>
					)}

					<Link to={navigateToFeedback}>
						<HeaderSvgButton title={'Обратная связь'}>
							<PencilSvg className='size-3' />
						</HeaderSvgButton>
					</Link>

					{!authStore.isAuth && (
						<div className='flex gap-3'>
							<Link to={navigateToLogin}>
								<HeaderButton isInvert={false} title={'Войти'} />
							</Link>
							<Link to={navigateToRegistration}>
								<HeaderButton isInvert={true} title={'Регистрация'} />
							</Link>
						</div>
					)}

					{authStore.isAuth && <ProfileButton />}
				</div>

				<div className='flex lg:hidden w-full justify-end items-center space-x-1.5'>
					{authStore.isAuth ? (
						<ProfileButton />
					) : (
						<Link to={navigateToLogin}>
							<LoginIconButton />
						</Link>
					)}
					<BurgerMenuButton onClick={openSidebarOverlay} />
				</div>
			</div>
		</header>
	)
})

export default Header
