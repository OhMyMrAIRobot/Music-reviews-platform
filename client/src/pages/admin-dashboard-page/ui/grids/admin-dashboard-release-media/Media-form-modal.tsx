import { useMutation, useQuery } from '@tanstack/react-query'
import { FC, useEffect, useMemo, useState } from 'react'
import { ReleaseAPI } from '../../../../../api/release/release-api'
import { ReleaseMediaAPI } from '../../../../../api/release/release-media-api'
import ComboBox from '../../../../../components/buttons/Combo-box'
import FormButton from '../../../../../components/form-elements/Form-button'
import FormInput from '../../../../../components/form-elements/Form-input'
import FormLabel from '../../../../../components/form-elements/Form-label'
import FormSingleSelect from '../../../../../components/form-elements/Form-single-select'
import ModalOverlay from '../../../../../components/modals/Modal-overlay'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useApiErrorHandler } from '../../../../../hooks/use-api-error-handler'
import { useReleaseMediaMeta } from '../../../../../hooks/use-release-media-meta'
import { useStore } from '../../../../../hooks/use-store'
import { releasesKeys } from '../../../../../query-keys/releases-keys'
import {
	AdminCreateReleaseMediaData,
	AdminUpdateReleaseMediaData,
	ReleaseMedia,
	ReleasesQuery,
} from '../../../../../types/release'

interface IProps {
	isOpen: boolean
	onClose: () => void
	media?: ReleaseMedia
}

const MediaFormModal: FC<IProps> = ({ isOpen, onClose, media }) => {
	const { notificationStore } = useStore()

	const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta()

	const handleApiError = useApiErrorHandler()

	// const queryClient = useQueryClient()

	const [title, setTitle] = useState<string>('')
	const [url, setUrl] = useState<string>('')
	const [type, setType] = useState<string>('')
	const [status, setStatus] = useState<string>('')
	const [release, setRelease] = useState<string>('')
	const [searchReleases, setSearchReleases] = useState<string>('')

	const query: ReleasesQuery = {
		search: searchReleases.trim() ?? undefined,
		limit: 20,
		offset: 0,
	}

	const { data: releasesData, isPending: isReleasesLoading } = useQuery({
		queryKey: releasesKeys.list(query),
		queryFn: () => ReleaseAPI.findAll(query),
		enabled: !!searchReleases.trim() && isOpen,
		staleTime: 1000 * 60 * 5,
	})

	const releases = releasesData?.items || []

	const createMutation = useMutation({
		mutationFn: (data: AdminCreateReleaseMediaData) =>
			ReleaseMediaAPI.adminCreate(data),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Медиа успешно добавлено!')
			// queryClient.invalidateQueries({ queryKey: releaseMediaKeys.all })
			clearForm()
			onClose()
		},
		onError: (error: unknown) => {
			handleApiError(error)
		},
	})

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: AdminUpdateReleaseMediaData
		}) => ReleaseMediaAPI.adminUpdate(id, data),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Медиа успешно обновлено!')
			// queryClient.invalidateQueries({ queryKey: releaseMediaKeys.all })
			clearForm()
			onClose()
		},
		onError: (error: unknown) => {
			handleApiError(error)
		},
	})

	const handleSubmit = () => {
		if (createMutation.isPending || updateMutation.isPending) return

		const typeId = types.find(t => t.type === type)?.id
		const statusId = statuses.find(s => s.status === status)?.id
		const releaseId = releases.find(r => r.title === release)?.id

		if (!media) {
			if (typeId && statusId && releaseId)
				createMutation.mutate({
					title: title.trim(),
					url: url.trim(),
					releaseId: releaseId,
					releaseMediaTypeId: typeId,
					releaseMediaStatusId: statusId,
				})
		} else {
			updateMutation.mutate({
				id: media.id,
				data: {
					title: title.trim() !== media.title ? title.trim() : undefined,
					url: url.trim() !== media.url ? url.trim() : undefined,
					releaseId: releaseId !== media.release.id ? releaseId : undefined,
					releaseMediaTypeId: typeId !== media.type.id ? typeId : undefined,
					releaseMediaStatusId:
						statusId !== media.status.id ? statusId : undefined,
				},
			})
		}
	}

	const loadReleases = async (search: string): Promise<string[]> => {
		setSearchReleases(search)
		return releases.map(r => r.title)
	}

	const clearForm = () => {
		setTitle('')
		setUrl('')
		setStatus('')
		setType('')
		setRelease('')
		setSearchReleases('')
	}

	const isFormValid = useMemo(() => {
		return title && url && status && type && release
	}, [release, status, title, type, url])

	const hasChanges = useMemo(() => {
		if (!media) return true
		return (
			title.trim() !== media.title ||
			url.trim() !== media.url ||
			type !== media.type.type ||
			status !== media.status.status ||
			release !== media.release.title
		)
	}, [media, release, status, title, type, url])

	useEffect(() => {
		if (isOpen && media) {
			setTitle(media.title)
			setUrl(media.url)
			setStatus(media.status.status)
			setType(media.type.type)
			setRelease(media.release.title)
		}
	}, [isOpen, media])

	const formTitle = media ? 'Редактирование медиа' : 'Добавление медиа'
	const buttonText = media ? 'Сохранить' : 'Добавить'

	if (!isOpen) return null

	return (
		<ModalOverlay
			isOpen={isOpen}
			onCancel={onClose}
			isLoading={createMutation.isPending || updateMutation.isPending}
			className='max-lg:size-full'
		>
			{isMetaLoading ? (
				<SkeletonLoader className='w-full lg:w-240 h-140 rounded-xl' />
			) : (
				<div
					className={`relative rounded-xl w-full max-lg:h-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 lg:pb-6 flex items-center`}
				>
					<div className='w-full'>
						<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
							{formTitle}
						</h1>

						<div className='w-full grid lg:grid-cols-2 p-6 border-b border-white/10 gap-3 lg:gap-6'>
							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Заголовок'}
									htmlFor={'media-title-input'}
									isRequired={true}
								/>
								<FormInput
									id={'media-title-input'}
									placeholder={'Заголовок...'}
									type={'text'}
									value={title}
									setValue={setTitle}
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Ссылка на медиа'}
									htmlFor={'media-url-input'}
									isRequired={true}
								/>
								<FormInput
									id={'media-url-input'}
									placeholder={'https://www.youtube.com/...'}
									type={'text'}
									value={url}
									setValue={setUrl}
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Тип медиа'}
									htmlFor={'media-type'}
									isRequired={true}
								/>

								<ComboBox
									options={types.map(entry => entry.type)}
									value={type || undefined}
									onChange={setType}
									placeholder='Тип медиа'
									className='border border-white/15'
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Cтатус медиа'}
									htmlFor={'media-status'}
									isRequired={true}
								/>

								<ComboBox
									options={statuses.map(entry => entry.status)}
									value={status || undefined}
									onChange={setStatus}
									placeholder='Статус медиа'
									className='border border-white/15'
								/>
							</div>

							<div className='grid gap-2 w-full'>
								<FormLabel
									name={'Название релиза'}
									htmlFor={'media-release-input'}
									isRequired={true}
								/>

								<FormSingleSelect
									id={'media-release-input'}
									placeholder={'Введите название релиза...'}
									value={release}
									onChange={setRelease}
									loadOptions={loadReleases}
									isLoading={isReleasesLoading}
								/>
							</div>
						</div>

						<div className='pt-6 px-6 w-full grid sm:flex gap-3 sm:justify-start'>
							<div className='w-full sm:w-30'>
								<FormButton
									title={buttonText}
									isInvert={true}
									onClick={handleSubmit}
									disabled={
										createMutation.isPending ||
										!isFormValid ||
										!hasChanges ||
										updateMutation.isPending
									}
									isLoading={
										createMutation.isPending || updateMutation.isPending
									}
								/>
							</div>

							<div className='w-full sm:w-25'>
								<FormButton
									title={'Назад'}
									isInvert={false}
									onClick={onClose}
									disabled={false}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</ModalOverlay>
	)
}

export default MediaFormModal
