import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { useStore } from '../../hooks/use-store'
import EditProfileSection from './EditProfileSection'
import SelectImageLabel from './SelectImageLabel'
import SubmitButton from './SubmitButton'

const UploadAvatarForm = observer(() => {
	const { profileStore, notificationStore: notificationsStore } = useStore()
	const { checkAuth } = useAuth()
	const [file, setFile] = useState<File | null>(null)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0])
		}
	}

	const handleSubmit = () => {
		if (!checkAuth()) return

		if (!file) {
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: 'Выберите изображение!',
				isError: true,
			})
			return
		}
		const formData = new FormData()

		formData.append('file', file)

		profileStore.uploadProfileAvatar(formData).then(result => {
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: result.message,
				isError: !result.status,
			})
		})
	}

	return (
		<EditProfileSection title='Аватар'>
			<div className='w-[144px] shrink-0'>
				<SelectImageLabel htmlfor='avatar' />
				<input
					onChange={handleFileChange}
					className='h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium hidden'
					id='avatar'
					accept='image/*'
					type='file'
				/>
			</div>
			<div className='relative w-36 h-36 rounded-full overflow-hidden'>
				<img
					alt='avatar'
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
						profileStore.myProfile?.avatar
					}`}
					className='object-cover size-full'
				/>
			</div>
			<SubmitButton onClick={handleSubmit} title='Отправить' />
		</EditProfileSection>
	)
})

export default UploadAvatarForm
