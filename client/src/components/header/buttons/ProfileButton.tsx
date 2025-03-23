import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { UseStore } from '../../../hooks/UseStore'
import {
	HeartSvgIcon,
	LogoutSvgIcon,
	ProfileSvgIcon,
	SettingsSvgIcon,
} from '../HeaderSvgIcons'
import PopupProfileButton from './PopupProfileButton'

const ProfileButton = observer(() => {
	const { authStore } = UseStore()

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
				className='rounded-full h-10 w-10 overflow-hidden bg-amber-400 cursor-pointer'
			></button>
			{isOpen && (
				<div className='absolute right-0 w-[300px] mt-2 rounded-xl bg-primary border-2 border-white/15 grid gap-2 font-medium py-3'>
					<h3 className='px-5 pb-1 truncate'>{authStore.user?.nickname}</h3>

					<PopupProfileButton
						text='Моя страница'
						icon={<ProfileSvgIcon />}
						onClick={() => {}}
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
						onClick={authStore.logOut}
					/>
				</div>
			)}
		</div>
	)
})

export default ProfileButton
