import { useMutation } from '@tanstack/react-query'
import { FC, useEffect, useMemo, useState } from 'react'
import { AuthorAPI } from '../../../../../api/author/author-api.ts'
import FormButton from '../../../../../components/form-elements/Form-button.tsx'
import FormCheckbox from '../../../../../components/form-elements/Form-checkbox.tsx'
import FormInput from '../../../../../components/form-elements/Form-input.tsx'
import FormLabel from '../../../../../components/form-elements/Form-label.tsx'
import FormMultiSelect, {
	IMultiSelectValue,
} from '../../../../../components/form-elements/Form-multi-select.tsx'
import ModalOverlay from '../../../../../components/modals/Modal-overlay.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useApiErrorHandler } from '../../../../../hooks/use-api-error-handler.ts'
import { useAuthorMeta } from '../../../../../hooks/use-author-meta.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { Author } from '../../../../../types/author/index.ts'
import { arraysEqual } from '../../../../../utils/arrays-equal.ts'
import buildAuthorFormData from '../../../../../utils/build-author-form-data'
import SelectImageLabel from '../../../../edit-profile-page/ui/labels/Select-image-label.tsx'
import SelectedImageLabel from '../../../../edit-profile-page/ui/labels/Selected-image-label.tsx'

interface IProps {
	isOpen: boolean
	onClose: () => void
	author?: Author
}

const AuthorFormModal: FC<IProps> = ({ isOpen, onClose, author }) => {
	const { notificationStore } = useStore()

	const { types, isLoading: isTypesLoading } = useAuthorMeta()
	const handleApiError = useApiErrorHandler()

	// const queryClient = useQueryClient()

	const [avatar, setAvatar] = useState<File | null>(null)
	const [cover, setCover] = useState<File | null>(null)
	const [name, setName] = useState<string>('')
	const [selectedTypes, setSelectedTypes] = useState<IMultiSelectValue[]>([])
	const [deleteAvatar, setDeleteAvatar] = useState<boolean>(false)
	const [deleteCover, setDeleteCover] = useState<boolean>(false)

	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
	const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

	const createMutation = useMutation({
		mutationFn: (formData: FormData) => AuthorAPI.createAuthor(formData),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Автор успешно добавлен!')
			// queryClient.invalidateQueries({ queryKey: authorsKeys.all })
			resetForm()
			onClose()
		},
		onError: (error: unknown) => {
			handleApiError(error)
		},
	})

	const updateMutation = useMutation({
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
			AuthorAPI.updateAuthor(id, formData),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Автор успешно обновлен!')
			// queryClient.invalidateQueries({ queryKey: authorsKeys.all })
			resetForm()
			onClose()
		},
		onError: (error: unknown) => {
			handleApiError(error)
		},
	})

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
		if (!isFormValid || updateMutation.isPending || createMutation.isPending)
			return

		const values = {
			name,
			selectedTypes,
			avatar,
			cover,
			deleteAvatar,
			deleteCover,
		}

		const formData = buildAuthorFormData(values, author)

		if (author) {
			updateMutation.mutate({ id: author.id, formData })
		} else {
			createMutation.mutate(formData)
		}
	}

	const hasChanges = useMemo(() => {
		if (!author) return true

		if (author.name !== name) return true

		if (
			!arraysEqual(
				author.authorTypes.map(t => t.type).sort(),
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

	useEffect(() => {
		if (author && isOpen) {
			setName(author.name)
			setSelectedTypes(
				author.authorTypes.map(t => {
					return { name: t.type, id: t.id }
				})
			)

			if (author.avatar) {
				setAvatarPreviewUrl(
					`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
						author.avatar
					}`
				)
			}

			if (author.cover) {
				setCoverPreviewUrl(
					`${import.meta.env.VITE_SERVER_URL}/public/authors/covers/${
						author.cover
					}`
				)
			}
		} else {
			resetForm()
		}
	}, [isOpen, author])

	const loadOptions = async (
		search: string,
		limit: number | null
	): Promise<IMultiSelectValue[]> => {
		return types.map(el => {
			return { name: el.type ?? search, id: el.id ?? limit }
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
			isLoading={updateMutation.isPending || createMutation.isPending}
			className='max-lg:size-full'
		>
			{isTypesLoading ? (
				<SkeletonLoader className='w-full lg:w-240 h-140 rounded-xl' />
			) : (
				<div
					className={`relative rounded-xl w-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6 max-h-full overflow-y-scroll`}
				>
					<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
						{title}
					</h1>

					<div className='border-b border-white/10 p-6 grid lg:flex gap-10 w-full'>
						<div className='grid gap-2 w-full lg:max-w-[30%] overflow-hidden'>
							<h3 className='text-2xl font-semibold leading-none tracking-tight'>
								Аватар
							</h3>

							<div className='w-full sm:w-[250px]'>
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
										author.avatar === '' || avatar
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

						<div className='grid gap-2 lg:max-w-[70%] w-full overflow-hidden'>
							<h3 className='text-2xl font-semibold leading-none tracking-tight'>
								Обложка
							</h3>

							<div className='w-full sm:w-[250px]'>
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
										author.cover === '' || cover
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

					<div className='w-full grid lg:flex p-6 border-b border-white/10 gap-6'>
						<div className='grid gap-2 w-full lg:w-1/2'>
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

						<div className='grid gap-2 w-full lg:w-1/2'>
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

					<div className='w-full pt-6 px-6 grid sm:flex gap-3 sm:justify-start'>
						<div className='w-full sm:w-30'>
							<FormButton
								title={buttonText}
								isInvert={true}
								onClick={handleSubmit}
								disabled={
									!isFormValid ||
									(!!author && !hasChanges) ||
									updateMutation.isPending ||
									createMutation.isPending
								}
								isLoading={updateMutation.isPending || createMutation.isPending}
							/>
						</div>

						<div className='w-full sm:w-25'>
							<FormButton
								title={'Назад'}
								isInvert={false}
								onClick={onClose}
								disabled={updateMutation.isPending || createMutation.isPending}
							/>
						</div>
					</div>
				</div>
			)}
		</ModalOverlay>
	)
}

export default AuthorFormModal
