import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import Loader from '../../Loader'
import {
	HeartSvgIcon,
	LogoutSvgIcon,
	ProfileSvgIcon,
	SettingsSvgIcon,
} from '../HeaderSvgIcons'
import PopupProfileButton from './PopupProfileButton'

const ProfileButton = observer(() => {
	const { authStore, notificationsStore, profileStore } = useStore()
	const { navigateToMain, navigatoToProfile } = useCustomNavigate()

	const { execute: fetchProfile, isLoading: isProfileLoading } = useLoading(
		profileStore.fetchMyProfile
	)

	useEffect(() => {
		if (authStore.isAuth && authStore.user) {
			fetchProfile(authStore.user.id)
		}
	}, [authStore.isAuth, authStore.user])

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

	return (
		<div ref={popUpProfRef} className='relative inline-block rounded-md'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='rounded-full h-10 w-10 overflow-hidden cursor-pointer'
			>
				{isProfileLoading ? (
					<Loader size='size-10' />
				) : (
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
							profileStore.myProfile?.avatar
						}`}
						className='size-full aspect-square'
					/>
				)}
			</button>
			<div
				className={`absolute right-0 w-[300px] mt-2 rounded-xl bg-primary border-2 border-white/15 grid gap-2 font-medium py-3 transition-all duration-125 ${
					isOpen
						? 'opacity-100 translate-y-0 pointer-events-auto'
						: 'opacity-0 -translate-y-3 pointer-events-none'
				}`}
			>
				<h3 className='px-5 pb-1 truncate'>{authStore.user?.nickname}</h3>

				<PopupProfileButton
					text='Моя страница'
					icon={<ProfileSvgIcon />}
					onClick={() => {
						if (authStore.user?.id) navigatoToProfile(authStore.user.id)
					}}
				/>
				<PopupProfileButton
					text='Мне понравилось'
					icon={<HeartSvgIcon />}
					onClick={() => {}}
				/>
				<PopupProfileButton
					text='Настройки профиля'
					icon={<SettingsSvgIcon />}
					onClick={() => {}}
				/>

				<div className='border-t border-white/15 pb-1'></div>

				<PopupProfileButton
					text='Выйти из профиля'
					icon={<LogoutSvgIcon />}
					onClick={() => {
						authStore.logOut().then(() => {
							if (!authStore.isAuth) {
								navigateToMain()
							}
							notificationsStore.addNotification({
								id: self.crypto.randomUUID(),
								text: !authStore.isAuth
									? 'Вы успешно вышли из аккаунта!'
									: 'Произошла ошибка при выходе!',
								isError: authStore.isAuth,
							})
						})
					}}
				/>
			</div>
		</div>
	)
})

export default ProfileButton
