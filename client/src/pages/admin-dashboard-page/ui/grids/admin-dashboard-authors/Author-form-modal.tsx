import { FC, useEffect, useMemo, useState } from 'react'
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
import { IAdminAuthor } from '../../../../../models/author/admin-authors-response.ts'
import { arraysEqual } from '../../../../../utils/arrays-equal.ts'
import SelectImageLabel from '../../../../edit-profile-page/ui/labels/Select-image-label.tsx'
import SelectedImageLabel from '../../../../edit-profile-page/ui/labels/Selected-image-label.tsx'

interface IProps {
	isOpen: boolean
	onClose: () => void
	refetchAuthors: () => void
	author?: IAdminAuthor
}

const AuthorFormModal: FC<IProps> = ({
	isOpen,
	onClose,
	refetchAuthors,
	author,
}) => {
	const { metaStore, notificationStore, adminDashboardAuthorsStore } =
		useStore()

	const [avatar, setAvatar] = useState<File | null>(null)
	const [cover, setCover] = useState<File | null>(null)
	const [name, setName] = useState<string>('')
	const [selectedTypes, setSelectedTypes] = useState<IMultiSelectValue[]>([])
	const [deleteAvatar, setDeleteAvatar] = useState<boolean>(false)
	const [deleteCover, setDeleteCover] = useState<boolean>(false)

	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
	const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

	const { execute: createAuthor, isLoading: isCreatingAuthor } = useLoading(
		adminDashboardAuthorsStore.createAuthor
	)

	const { execute: updateAuthor, isLoading: isUpdatingAuthor } = useLoading(
		adminDashboardAuthorsStore.updateAuthor
	)

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0]
			setAvatar(selectedFile)

			const fileUrl = URL.createObjectURL(selectedFile)
			setAvatarPreviewUrl(fileUrl)
		}
	}

	const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0]
			setCover(selectedFile)

			const fileUrl = URL.createObjectURL(selectedFile)
			setCoverPreviewUrl(fileUrl)
		}
	}

	const handleSubmit = async () => {
		if (!isFormValid || isUpdatingAuthor || isCreatingAuthor) return

		const formData = new FormData()

		if (!author || author.name !== name) {
			formData.append('name', name)
		}

		if (
			!author ||
			!arraysEqual(
				author.types.map(t => t.type).sort(),
				selectedTypes.map(st => st.name).sort()
			)
		) {
			selectedTypes.forEach(st => {
				formData.append('types[]', st.id)
			})
		}

		if (avatar) formData.append('avatarImg', avatar)
		if (cover) formData.append('coverImg', cover)

		if (deleteAvatar && !avatar)
			formData.append('clearAvatar', JSON.stringify(true))
		if (deleteCover && !cover)
			formData.append('clearCover', JSON.stringify(true))

		let errors: string[] = []

		if (author) {
			errors = await updateAuthor(author.id, formData)
		} else {
			errors = await createAuthor(formData)
		}

		if (errors.length > 0) {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		} else {
			const message = author
				? 'Автор успешно обновлен!'
				: 'Автор успешно добавлен!'

			notificationStore.addSuccessNotification(message)
			resetForm()
			onClose()
			refetchAuthors()
		}
	}

	const hasChanges = useMemo(() => {
		if (!author) return true

		if (author.name !== name) return true

		if (
			!arraysEqual(
				author.types.map(t => t.type).sort(),
				selectedTypes.map(st => st.name).sort()
			)
		)
			return true

		if (avatar || cover) return true

		if (deleteAvatar || deleteCover) return true

		return false
	}, [author, name, selectedTypes, avatar, cover, deleteAvatar, deleteCover])

	const resetForm = () => {
		setName('')
		setSelectedTypes([])
		setAvatar(null)
		setCover(null)
		setAvatarPreviewUrl(null)
		setCoverPreviewUrl(null)
		setDeleteAvatar(false)
		setDeleteCover(false)
	}

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchAuthorTypes
	)

	useEffect(() => {
		if (metaStore.authorTypes.length === 0) {
			fetchTypes()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (author && isOpen) {
			setName(author.name)
			setSelectedTypes(
				author.types.map(t => {
					return { name: t.type, id: t.id }
				})
			)

			if (author.avatarImg) {
				setAvatarPreviewUrl(
					`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
						author.avatarImg
					}`
				)
			}

			if (author.coverImg) {
				setCoverPreviewUrl(
					`${import.meta.env.VITE_SERVER_URL}/public/authors/covers/${
						author.coverImg
					}`
				)
			}
		} else {
			resetForm()
		}
	}, [isOpen, author])

	const loadOptions = async (
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		search: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		limit: number | null
	): Promise<IMultiSelectValue[]> => {
		return metaStore.authorTypes.map(el => {
			return { name: el.type, id: el.id }
		})
	}

	const title = author ? 'Редактирование автора' : 'Добавление автора'
	const buttonText = author ? 'Сохранить' : 'Добавить'
	const isFormValid = name.length > 0 && selectedTypes.length > 0

	if (!isOpen) return null

	return (
		<ModalOverlay
			isOpen={isOpen}
			onCancel={onClose}
			isLoading={isUpdatingAuthor || isCreatingAuthor}
		>
			{isTypesLoading ? (
				<SkeletonLoader className='w-240 h-140 rounded-xl' />
			) : (
				<div
					className={`relative rounded-xl w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6`}
				>
					<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
						{title}
					</h1>
					<div className='border-b border-white/10 p-6 flex gap-10 w-full'>
						<div className='grid gap-2 max-w-[30%] overflow-hidden w-full'>
							<h3 className='text-2xl font-semibold leading-none tracking-tight'>
								Аватар
							</h3>

							<div className='w-[250px]'>
								<SelectImageLabel htmlfor='avatar' />
							</div>

							<input
								onChange={handleAvatarChange}
								className='hidden'
								id='avatar'
								accept='image/*'
								type='file'
							/>
							<SelectedImageLabel file={avatar} />

							<div className='relative size-36 rounded-full overflow-hidden select-none'>
								<img
									alt='avatar'
									loading='lazy'
									decoding='async'
									src={
										avatarPreviewUrl ||
										`${
											import.meta.env.VITE_SERVER_URL
										}/public/authors/avatars/${
											import.meta.env.VITE_DEFAULT_AVATAR
										}`
									}
									className='object-cover size-full'
								/>
							</div>

							{author && (
								<div
									className={`flex gap-2 items-center mt-2 ${
										author.avatarImg === '' || avatar
											? 'opacity-50 pointer-events-none'
											: ''
									}`}
								>
									<FormCheckbox
										id={'avatar-checkbox'}
										checked={deleteAvatar}
										setChecked={setDeleteAvatar}
									/>
									<FormLabel
										name={'Удалить аватар'}
										htmlFor={'avatar-checkbox'}
										isRequired={false}
									/>
								</div>
							)}
						</div>

						<div className='grid gap-2 max-w-[70%] w-full overflow-hidden'>
							<h3 className='text-2xl font-semibold leading-none tracking-tight'>
								Обложка
							</h3>

							<div className='w-[250px]'>
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

							<div className='relative h-36 rounded-lg overflow-hidden select-none'>
								<img
									alt='cover'
									loading='lazy'
									decoding='async'
									src={
										coverPreviewUrl ||
										`${import.meta.env.VITE_SERVER_URL}/public/authors/covers/${
											import.meta.env.VITE_DEFAULT_COVER
										}`
									}
									className='aspect-video size-full'
								/>
							</div>

							{author && (
								<div
									className={`flex gap-2 items-center mt-2 ${
										author.coverImg === '' || cover
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

					<div className='w-full flex p-6 border-b border-white/10 gap-6'>
						<div className='grid gap-2 w-1/2'>
							<FormLabel
								name={'Имя автора'}
								htmlFor={'author-name'}
								isRequired={true}
							/>
							<FormInput
								id={'author-name'}
								placeholder={'Имя автора...'}
								type={'text'}
								value={name}
								setValue={setName}
							/>
						</div>

						<div className='grid gap-2 w-1/2'>
							<FormLabel
								name={'Тип автора'}
								htmlFor={'author-types'}
								isRequired={true}
							/>
							<FormMultiSelect
								id={'author-types'}
								placeholder={'Выберите тип автора'}
								value={selectedTypes}
								onChange={setSelectedTypes}
								loadOptions={loadOptions}
							/>
						</div>
					</div>

					<div className='pt-6 px-6 flex gap-3 justify-start'>
						<div className='w-30'>
							<FormButton
								title={buttonText}
								isInvert={true}
								onClick={handleSubmit}
								disabled={
									!isFormValid ||
									(!!author && !hasChanges) ||
									isUpdatingAuthor ||
									isCreatingAuthor
								}
								isLoading={isUpdatingAuthor || isCreatingAuthor}
							/>
						</div>

						<div className='w-25'>
							<FormButton
								title={'Назад'}
								isInvert={false}
								onClick={onClose}
								disabled={isUpdatingAuthor || isCreatingAuthor}
							/>
						</div>
					</div>
				</div>
			)}
		</ModalOverlay>
	)
}

export default AuthorFormModal
