import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import ComboBox from '../../../../../components/buttons/Combo-box.tsx'
import FormButton from '../../../../../components/form-elements/Form-button.tsx'
import FormCheckbox from '../../../../../components/form-elements/Form-checkbox.tsx'
import FormInput from '../../../../../components/form-elements/Form-input.tsx'
import FormLabel from '../../../../../components/form-elements/Form-label.tsx'
import FormMultiSelect, {
	IMultiSelectValue,
} from '../../../../../components/form-elements/Form-multi-select.tsx'
import ModalOverlay from '../../../../../components/modals/Modal-overlay.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { IAdminRelease } from '../../../../../models/release/admin-release/admin-release.ts'
import { arraysEqual } from '../../../../../utils/arrays-equal.ts'
import SelectImageLabel from '../../../../edit-profile-page/ui/labels/Select-image-label.tsx'
import SelectedImageLabel from '../../../../edit-profile-page/ui/labels/Selected-image-label.tsx'

interface IProps {
	isOpen: boolean
	onClose: () => void
	release?: IAdminRelease
	refetchReleases: () => void
}

const ReleaseFormModal: FC<IProps> = observer(
	({ isOpen, onClose, refetchReleases, release }) => {
		const { metaStore, notificationStore, adminDashboardReleasesStore } =
			useStore()

		const [cover, setCover] = useState<File | null>(null)
		const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
		const [title, setTitle] = useState<string>('')
		const [type, setType] = useState<string>('')
		const [date, setDate] = useState<string>('')
		const [selectedArtists, setSelectedArtists] = useState<IMultiSelectValue[]>(
			[]
		)
		const [selectedProducers, setSelectedProducers] = useState<
			IMultiSelectValue[]
		>([])
		const [selectedDesigners, setSelectedDesigners] = useState<
			IMultiSelectValue[]
		>([])
		const [deleteCover, setDeleteCover] = useState<boolean>(false)

		const { execute: fetchReleaseTypes, isLoading: isTypesLoading } =
			useLoading(metaStore.fetchReleaseTypes)

		const { execute: fetchAuthors } = useLoading(
			adminDashboardReleasesStore.fetchAuthors
		)

		const { execute: createRelease, isLoading: isCreatingRelease } = useLoading(
			adminDashboardReleasesStore.createRelease
		)

		const { execute: updateRelease, isLoading: isUpdatingRelease } = useLoading(
			adminDashboardReleasesStore.updateRelease
		)

		const handleSubmit = async () => {
			if (!isFormValid || isCreatingRelease || isUpdatingRelease) return

			const formData = new FormData()

			if (cover) {
				formData.append('coverImg', cover)
			}

			if (deleteCover && !cover)
				formData.append('clearCover', JSON.stringify(true))

			if (!release || title !== release.title) {
				formData.append('title', title)
			}

			if (!release || date !== release.publishDate) {
				formData.append('publishDate', date)
			}

			const releaseType = metaStore.releaseTypes.find(
				entry => entry.type === type
			)
			if ((!release || release.releaseType.type !== type) && releaseType) {
				formData.append('releaseTypeId', releaseType.id)
			}

			if (
				!release ||
				!arraysEqual(
					release.releaseArtists.map(entry => entry.name).sort(),
					selectedArtists.map(sa => sa.name).sort()
				)
			) {
				if (selectedArtists.length === 0) {
					formData.append('releaseArtists[]', '[]')
				} else {
					selectedArtists.forEach(sa => {
						formData.append('releaseArtists[]', sa.id)
					})
				}
			}

			if (
				!release ||
				!arraysEqual(
					release.releaseProducers.map(entry => entry.name).sort(),
					selectedProducers.map(sp => sp.name).sort()
				)
			) {
				if (selectedProducers.length === 0) {
					formData.append('releaseProducers[]', '[]')
				} else {
					selectedProducers.forEach(sp => {
						formData.append('releaseProducers[]', sp.id)
					})
				}
			}

			if (
				!release ||
				!arraysEqual(
					release.releaseDesigners.map(entry => entry.name).sort(),
					selectedDesigners.map(sd => sd.name).sort()
				)
			) {
				if (selectedDesigners.length === 0) {
					formData.append('releaseDesigners[]', '[]')
				} else {
					selectedDesigners.forEach(sd => {
						formData.append('releaseDesigners[]', sd.id)
					})
				}
			}

			let errors = []

			if (release) {
				errors = await updateRelease(release.id, formData)
			} else {
				errors = await createRelease(formData)
			}

			if (errors.length > 0) {
				errors.forEach(err => notificationStore.addErrorNotification(err))
			} else {
				const message = release
					? 'Релиз успешно обновлен'
					: 'Релиз успешно добавлен!'

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

		const hasChanges = useMemo(() => {
			if (!release) return true
			if (cover) return true
			if (release.title !== title) return true
			if (release.releaseType.type !== type) return true
			if (release.publishDate !== date) return true
			if (deleteCover) return true

			if (
				!arraysEqual(
					release.releaseArtists.map(entry => entry.name).sort(),
					selectedArtists.map(sa => sa.name).sort()
				)
			)
				return true

			if (
				!arraysEqual(
					release.releaseProducers.map(entry => entry.name).sort(),
					selectedProducers.map(sp => sp.name).sort()
				)
			)
				return true

			if (
				!arraysEqual(
					release.releaseDesigners.map(entry => entry.name).sort(),
					selectedDesigners.map(sd => sd.name).sort()
				)
			)
				return true

			return false
		}, [
			cover,
			date,
			deleteCover,
			release,
			selectedArtists,
			selectedDesigners,
			selectedProducers,
			title,
			type,
		])

		const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.files && event.target.files[0]) {
				const selectedFile = event.target.files[0]
				setCover(selectedFile)

				const fileUrl = URL.createObjectURL(selectedFile)
				setCoverPreviewUrl(fileUrl)
			}
		}

		const loadAuthors = async (
			search: string,
			limit: number | null
		): Promise<IMultiSelectValue[]> => {
			await fetchAuthors(search.trim() !== '' ? search.trim() : null, limit)

			return adminDashboardReleasesStore.authors.map(a => ({
				id: a.id,
				name: a.name,
			}))
		}

		useEffect(() => {
			if (release && isOpen) {
				setTitle(release.title)
				setDate(release.publishDate)
				setType(release.releaseType.type)
				if (release.img) {
					setCoverPreviewUrl(
						`${import.meta.env.VITE_SERVER_URL}/public/releases/${release.img}`
					)
				}
				setSelectedArtists(release.releaseArtists)
				setSelectedProducers(release.releaseProducers)
				setSelectedDesigners(release.releaseDesigners)
			} else {
				resetForm()
			}
		}, [isOpen, release])

		useEffect(() => {
			if (metaStore.releaseTypes.length === 0) {
				fetchReleaseTypes()
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [])

		const formTitle = release ? 'Редактирование релиза' : 'Добавление релиза'
		const buttonText = release ? 'Сохранить' : 'Добавить'
		const isFormValid = title.length > 0 && type !== '' && date !== ''

		if (!isOpen) return null

		return (
			<ModalOverlay
				isOpen={isOpen}
				onCancel={onClose}
				isLoading={isCreatingRelease || isUpdatingRelease}
				className='max-lg:size-full'
			>
				{isTypesLoading ? (
					<SkeletonLoader className='w-full lg:w-240 h-140 size-full rounded-xl' />
				) : (
					<div
						className={`relative rounded-xl w-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6 overflow-y-scroll max-h-full`}
					>
						<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
							{formTitle}
						</h1>

						<div className='border-b border-white/10 p-6 flex gap-10 w-full'>
							<div className='grid gap-2 lg:max-w-[30%] overflow-hidden w-full'>
								<h3 className='text-2xl font-semibold leading-none tracking-tight'>
									Обложка релиза
								</h3>

								<div className='w-full lg:w-[250px]'>
									<SelectImageLabel htmlfor='cover' />
								</div>

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

								{release && (
									<div
										className={`flex gap-2 items-center mt-2 ${
											release.img === '' || cover
												? 'opacity-50 pointer-events-none'
												: ''
										}`}
									>
										<FormCheckbox
											id={'cover-checkbox'}
											checked={deleteCover}
											setChecked={setDeleteCover}
										/>
										<FormLabel
											name={'Удалить обложку'}
											htmlFor={'cover-checkbox'}
											isRequired={false}
										/>
									</div>
								)}
							</div>
						</div>

						<div className='grid grid-cols-1 lg:grid-cols-2 p-6 border-b border-white/10 gap-3 lg:gap-6'>
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
										value={selectedArtists}
										onChange={setSelectedArtists}
										loadOptions={loadAuthors}
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
										value={selectedProducers}
										onChange={setSelectedProducers}
										loadOptions={loadAuthors}
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
										value={selectedDesigners}
										onChange={setSelectedDesigners}
										loadOptions={loadAuthors}
									/>
								</div>
							</div>
						</div>

						<div className='w-full pt-6 px-6 grid sm:flex gap-3 sm:justify-start'>
							<div className='w-full sm:w-30'>
								<FormButton
									title={buttonText}
									isInvert={true}
									onClick={handleSubmit}
									disabled={
										!isFormValid ||
										(!!release && !hasChanges) ||
										isCreatingRelease ||
										isUpdatingRelease
									}
									isLoading={isCreatingRelease || isUpdatingRelease}
								/>
							</div>

							<div className='w-full sm:w-25'>
								<FormButton
									title={'Назад'}
									isInvert={false}
									onClick={onClose}
									disabled={isCreatingRelease || isUpdatingRelease}
								/>
							</div>
						</div>
					</div>
				)}
			</ModalOverlay>
		)
	}
)

export default ReleaseFormModal
