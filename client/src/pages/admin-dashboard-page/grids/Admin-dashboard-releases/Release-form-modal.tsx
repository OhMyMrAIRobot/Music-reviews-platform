import { FC, useEffect, useState } from 'react'
import ComboBox from '../../../../components/buttons/Combo-box'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormMultiSelect from '../../../../components/form-elements/Form-multi-select'
import ModalOverlay from '../../../../components/modals/Modal-overlay'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import SelectImageLabel from '../../../edit-profile-page/ui/labels/Select-image-label'
import SelectedImageLabel from '../../../edit-profile-page/ui/labels/Selected-image-label'

interface IProps {
	isOpen: boolean
	onClose: () => void
	refetchReleases: () => void
}

const ReleaseFormModal: FC<IProps> = ({ isOpen, onClose, refetchReleases }) => {
	const {
		metaStore,
		adminDashboardAuthorsStore,
		notificationStore,
		adminDashboardReleasesStore,
	} = useStore()

	const [cover, setCover] = useState<File | null>(null)
	const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
	const [title, setTitle] = useState<string>('')
	const [type, setType] = useState<string>('')
	const [date, setDate] = useState<string>('')
	const [selectedArtists, setSelectedArtists] = useState<string[]>([])
	const [selectedProducers, setSelectedProducers] = useState<string[]>([])
	const [selectedDesigners, setSelectedDesigners] = useState<string[]>([])

	const { execute: fetchReleaseTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseTypes
	)

	const { execute: fetchAuthors, isLoading: isAuthorsLoading } = useLoading(
		adminDashboardAuthorsStore.fetchAuthors
	)

	const handleSubmit = async () => {
		if (!isFormValid) return

		const formData = new FormData()

		if (cover) {
			formData.append('coverImg', cover)
		}

		formData.append('title', title)
		formData.append('publishDate', date)

		const releaseType = metaStore.releaseTypes.find(
			entry => entry.type === type
		)
		if (releaseType) {
			formData.append('releaseTypeId', releaseType.id)
		}

		selectedArtists.forEach(val => {
			const author = adminDashboardAuthorsStore.authors.find(
				entry => entry.name === val
			)
			if (author) {
				formData.append('releaseArtists[]', author.id)
			}
		})

		selectedProducers.forEach(val => {
			const author = adminDashboardAuthorsStore.authors.find(
				entry => entry.name === val
			)
			if (author) {
				formData.append('releaseProducers[]', author.id)
			}
		})

		selectedDesigners.forEach(val => {
			const author = adminDashboardAuthorsStore.authors.find(
				entry => entry.name === val
			)
			if (author) {
				formData.append('releaseDesigners[]', author.id)
			}
		})

		const errors = await adminDashboardReleasesStore.createRelease(formData)

		if (errors.length > 0) {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		} else {
			const message = 'Релиз успешно добавлен!'

			notificationStore.addSuccessNotification(message)
			resetForm()
			onClose()
			refetchReleases()
		}
	}

	const resetForm = () => {
		setCover(null)
		setCoverPreviewUrl(null)
		setTitle('')
		setType('')
		setDate('')
		setSelectedArtists([])
		setSelectedDesigners([])
		setSelectedProducers([])
	}

	const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0]
			setCover(selectedFile)

			const fileUrl = URL.createObjectURL(selectedFile)
			setCoverPreviewUrl(fileUrl)
		}
	}

	useEffect(() => {
		const promises = []
		if (metaStore.releaseTypes.length === 0) {
			promises.push(fetchReleaseTypes())
		}
		Promise.all([...promises, fetchAuthors()])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const formTitle = 'Добавление релиза'
	const buttonText = 'Добавить'
	const isFormValid = title.length > 0 && type !== '' && date !== ''

	if (!isOpen) return null

	return (
		<ModalOverlay isOpen={isOpen} onCancel={onClose}>
			{isTypesLoading || isAuthorsLoading ? (
				<div className='bg-gray-400 w-240 h-140 animate-pulse opacity-40 rounded-xl' />
			) : (
				<div
					className={`relative rounded-xl w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6`}
				>
					<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
						{formTitle}
					</h1>

					<div className='border-b border-white/10 p-6 flex gap-10 w-full'>
						<div className='grid gap-2 max-w-[30%] overflow-hidden w-full'>
							<h3 className='text-2xl font-semibold leading-none tracking-tight'>
								Обложка релиза
							</h3>

							<SelectImageLabel htmlfor='cover' />
							<input
								onChange={handleCoverChange}
								className='hidden'
								id='cover'
								accept='image/*'
								type='file'
							/>
							<SelectedImageLabel file={cover} />

							<div className='relative size-36 rounded-full overflow-hidden select-none'>
								<img
									alt='avatar'
									loading='lazy'
									decoding='async'
									src={
										coverPreviewUrl ||
										`${import.meta.env.VITE_SERVER_URL}/public/releases/${
											import.meta.env.VITE_DEFAULT_COVER
										}`
									}
									className='object-cover size-full'
								/>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-2 p-6 border-b border-white/10 gap-6'>
						<div className='grid grid-rows-3 gap-y-3'>
							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Название релиза'}
									htmlFor={'release-title'}
									isRequired={true}
								/>
								<FormInput
									id={'release-title'}
									placeholder={'Название релиза...'}
									type={'text'}
									value={title}
									setValue={setTitle}
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Тип релиза'}
									htmlFor={'release-type'}
									isRequired={true}
								/>

								<ComboBox
									options={metaStore.releaseTypes.map(entry => entry.type)}
									value={type || undefined}
									onChange={setType}
									placeholder='Тип релиза'
									className='border border-white/15'
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Дата публикации'}
									htmlFor={'release-date'}
									isRequired={true}
								/>
								<FormInput
									id={'release-date'}
									placeholder={''}
									type={'date'}
									value={date}
									setValue={setDate}
								/>
							</div>
						</div>

						<div className='grid grid-rows-3 gap-3'>
							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Артисты'}
									htmlFor={'release-artists'}
									isRequired={false}
								/>
								<FormMultiSelect
									id={'release-artists'}
									placeholder={'Артисты'}
									options={adminDashboardAuthorsStore.authors.map(
										entry => entry.name
									)}
									value={selectedArtists}
									onChange={setSelectedArtists}
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Продюсеры'}
									htmlFor={'release-producers'}
									isRequired={false}
								/>
								<FormMultiSelect
									id={'release-producers'}
									placeholder={'Продюсеры'}
									options={adminDashboardAuthorsStore.authors.map(
										entry => entry.name
									)}
									value={selectedProducers}
									onChange={setSelectedProducers}
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Дизайнеры'}
									htmlFor={'release-designers'}
									isRequired={false}
								/>
								<FormMultiSelect
									id={'release-designers'}
									placeholder={'Дизайнеры'}
									options={adminDashboardAuthorsStore.authors.map(
										entry => entry.name
									)}
									value={selectedDesigners}
									onChange={setSelectedDesigners}
								/>
							</div>
						</div>
					</div>

					<div className='pt-6 px-6 flex gap-3 justify-start'>
						<div className='w-30'>
							<FormButton
								title={buttonText}
								isInvert={true}
								onClick={handleSubmit}
								disabled={!isFormValid}
							/>
						</div>

						<div className='w-25'>
							<FormButton
								title={'Назад'}
								isInvert={false}
								onClick={onClose}
								disabled={false}
							/>
						</div>
					</div>
				</div>
			)}
		</ModalOverlay>
	)
}

export default ReleaseFormModal
