import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAuthCheck } from '../../hooks/UseAuthCheck'
import { useStore } from '../../hooks/UseStore'
import SelectImageLabel from './SelectImageLabel'

const UploadAvatarForm = observer(() => {
	const { profileStore, notificationsStore } = useStore()
	const { checkAuth } = useAuthCheck()
	const [file, setFile] = useState<File | null>(null)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0])
		}
	}

	const handleSubmit = () => {
		if (!checkAuth()) return

		if (!file) {
			alert('Выберите файл!')
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
		<div className='rounded-lg border border-white/10 bg-zinc-900 shadow-sm p-5 w-200 flex flex-col gap-y-5'>
			<h3 className='text-2xl font-semibold leading-none tracking-tight'>
				Аватар
			</h3>
			<div className='w-[144px] shrink-0'>
				<SelectImageLabel htmlfor='avatar' />
				<input
					onChange={handleFileChange}
					className='h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hidden'
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
			<div className='pt-6 border-t border-white/5'>
				<button
					onClick={handleSubmit}
					className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-[150px] cursor-pointer'
				>
					Отправить
				</button>
			</div>
		</div>
	)
})

export default UploadAvatarForm
