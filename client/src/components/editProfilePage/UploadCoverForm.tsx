import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { useStore } from '../../hooks/use-store'
import EditProfileSection from './EditProfileSection'
import SelectImageLabel from './SelectImageLabel'
import SubmitButton from './SubmitButton'

const UploadCoverForm = observer(() => {
	const { profileStore, notificationsStore } = useStore()
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

		profileStore.uploadProfileCover(formData).then(result => {
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: result.message,
				isError: !result.status,
			})
		})
	}

	return (
		<EditProfileSection title='Обложка профиля'>
			<div className='w-[144px] shrink-0'>
				<SelectImageLabel htmlfor='cover' />
				<input
					onChange={handleFileChange}
					className='h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium hidden'
					id='cover'
					accept='image/*'
					type='file'
				/>
			</div>
			<div className='relative w-full max-h-28 sm:max-h-44 lg:max-h-64 rounded-lg overflow-hidden aspect-video'>
				<img
					alt='cover'
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
						profileStore.myProfile?.cover
					}`}
					className='object-cover size-full'
				/>
			</div>
			<SubmitButton onClick={handleSubmit} title='Отправить' />
		</EditProfileSection>
	)
})

export default UploadCoverForm
