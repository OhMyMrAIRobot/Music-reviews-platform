import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import useCustomNavigate from '../../../hooks/use-custom-navigate'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { RolesEnum } from '../../../models/role/roles-enum'
import SettingsSvg from '../../svg/Settings-svg'
import ShieldSvg from '../../svg/Shield-svg'
import SkeletonLoader from '../../utils/Skeleton-loader'
import LogoutSvg from '../svg/Logout-svg'
import ProfileSvg from '../svg/Profile-svg'
import PopupProfileButton from './Popup-profile-button'

const ProfileButton = observer(() => {
	const { authStore, profileStore, notificationStore } = useStore()

	const {
		navigateToMain,
		navigatoToProfile,
		navigateToEditProfile,
		navigateToAdminReleases,
	} = useCustomNavigate()

	const { execute: fetchProfile, isLoading } = useLoading(
		profileStore.fetchProfile
	)

	useEffect(() => {
		if (authStore.isAuth && authStore.user) {
			fetchProfile(authStore.user.id)
		}
	}, [authStore.isAuth, authStore.user, fetchProfile])

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const popUpProfRef = useRef<HTMLDivElement | null>(null)

	const handleClickOutside = (event: MouseEvent) => {
		if (
			popUpProfRef.current &&
			!popUpProfRef.current.contains(event.target as Node)
		) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)

		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	const logOut = () => {
		authStore.logOut().then(() => {
			if (!authStore.isAuth) {
				navigateToMain()
			}
			notificationStore.addNotification({
				id: self.crypto.randomUUID(),
				text: !authStore.isAuth
					? 'Вы успешно вышли из аккаунта!'
					: 'Произошла ошибка при выходе!',
				isError: authStore.isAuth,
			})
		})
	}

	return (
		<div
			ref={popUpProfRef}
			className='relative flex rounded-md items-center select-none'
		>
			{isLoading ? (
				<SkeletonLoader className='size-10 rounded-full' />
			) : (
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='rounded-full size-10 overflow-hidden cursor-pointer aspect-square'
				>
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
							profileStore.profile?.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: profileStore.profile?.avatar
						}`}
						className='size-full aspect-square object-cover'
					/>
				</button>
			)}

			<div
				className={`absolute z-2000 right-0 w-[300px] top-14 rounded-lg bg-zinc-950 border border-white/10 grid gap-2 font-medium py-3 transition-all duration-125 ${
					isOpen
						? 'opacity-100 translate-y-0 pointer-events-auto'
						: 'opacity-0 -translate-y-3 pointer-events-none'
				}`}
			>
				<h3 className='px-5 pb-1 truncate'>{authStore.user?.nickname}</h3>

				<PopupProfileButton
					text='Моя страница'
					icon={<ProfileSvg className={'size-5.5'} />}
					onClick={() => {
						if (authStore.user?.id) navigatoToProfile(authStore.user.id)
					}}
				/>
				<PopupProfileButton
					text='Настройки профиля'
					icon={<SettingsSvg className={'size-7'} />}
					onClick={() => {
						if (authStore.user?.id) navigateToEditProfile()
					}}
				/>

				{(authStore.user?.role.role === RolesEnum.ADMIN ||
					authStore.user?.role.role === RolesEnum.ROOT_ADMIN) && (
					<PopupProfileButton
						text='Админ. панель'
						icon={<ShieldSvg className='size-6.5' />}
						onClick={() => {
							if (authStore.user?.id) navigateToAdminReleases()
						}}
					/>
				)}

				<div className='border-t border-white/10 pb-1' />

				<PopupProfileButton
					text='Выйти из профиля'
					icon={<LogoutSvg className='size-4.5' />}
					onClick={logOut}
				/>
			</div>
		</div>
	)
})

export default ProfileButton
