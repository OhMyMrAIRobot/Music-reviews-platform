import { FC, useEffect, useMemo, useState } from 'react'
import ComboBox from '../../../../../components/buttons/Combo-box'
import FormButton from '../../../../../components/form-elements/Form-button'
import FormInput from '../../../../../components/form-elements/Form-input'
import FormLabel from '../../../../../components/form-elements/Form-label'
import FormSingleSelect from '../../../../../components/form-elements/Form-single-select'
import ModalOverlay from '../../../../../components/modals/Modal-overlay'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { IReleaseMedia } from '../../../../../models/release/release-media/release-media'

interface IProps {
	isOpen: boolean
	onClose: () => void
	refetch?: () => void
	media?: IReleaseMedia
}

const MediaFormModal: FC<IProps> = ({ isOpen, onClose, media, refetch }) => {
	const { metaStore, adminDashboardMediaStore, notificationStore } = useStore()

	const [title, setTitle] = useState<string>('')
	const [url, setUrl] = useState<string>('')
	const [type, setType] = useState<string>('')
	const [status, setStatus] = useState<string>('')
	const [release, setRelease] = useState<string>('')

	const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
		metaStore.fetchReleaseMediaStatuses
	)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseMediaTypes
	)

	const { execute: fetchReleases } = useLoading(
		adminDashboardMediaStore.fetchReleases
	)

	const { execute: createReleaseMedia, isLoading: isCreating } = useLoading(
		adminDashboardMediaStore.createReleaseMedia
	)

	const { execute: updateReleaseMedia, isLoading: isUpdating } = useLoading(
		adminDashboardMediaStore.updateReleaseMedia
	)

	const handleSubmit = async () => {
		if (isCreating || isStatusesLoading || isTypesLoading || isUpdating) return

		const typeId = metaStore.releaseMediaTypes.find(t => t.type === type)?.id

		const statusId = metaStore.releaseMediaStatuses.find(
			s => s.status === status
		)?.id

		const releaseId = adminDashboardMediaStore.releases.find(
			r => r.title === release
		)?.id

		if ((!type || !statusId || !releaseId) && !media) return

		let errors = []

		if (!media) {
			errors = await createReleaseMedia(
				title.trim(),
				url.trim(),
				releaseId,
				typeId,
				statusId
			)
		} else {
			errors = await updateReleaseMedia(
				media.id,
				title.trim() !== media.title ? title.trim() : undefined,
				url.trim() !== media.url ? url.trim() : undefined,
				releaseId !== media.release.id ? releaseId : undefined,
				typeId !== media.releaseMediaType.id ? typeId : undefined,
				statusId !== media.releaseMediaStatus.id ? statusId : undefined
			)
		}

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				`Вы успешно ${media ? 'обновили' : 'добавили'} медиа!`
			)
			if (media && refetch) {
				refetch()
			}

			clearForm()
			onClose()
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	const loadReleases = async (search: string): Promise<string[]> => {
		if (search.trim() !== '') await fetchReleases(search)

		return adminDashboardMediaStore.releases.map(r => r.title)
	}

	const clearForm = () => {
		setTitle('')
		setUrl('')
		setStatus('')
		setType('')
		setRelease('')
		adminDashboardMediaStore.setReleases([])
	}

	const isFormValid = useMemo(() => {
		return title && url && status && type && release
	}, [release, status, title, type, url])

	const hasChanges = useMemo(() => {
		if (!media) return true
		return (
			title.trim() !== media.title ||
			url.trim() !== media.url ||
			type !== media.releaseMediaType.type ||
			status !== media.releaseMediaStatus.status ||
			release !== media.release.title
		)
	}, [media, release, status, title, type, url])

	useEffect(() => {
		if (isOpen) {
			if (metaStore.releaseMediaStatuses.length === 0) {
				fetchStatuses()
			}
			if (metaStore.releaseMediaTypes.length === 0) {
				fetchTypes()
			}
		}
	}, [
		adminDashboardMediaStore.releases.length,
		fetchReleases,
		fetchStatuses,
		fetchTypes,
		isOpen,
		metaStore.releaseMediaStatuses.length,
		metaStore.releaseMediaTypes.length,
	])

	useEffect(() => {
		if (isOpen && media) {
			setTitle(media.title)
			setUrl(media.url)
			setStatus(media.releaseMediaStatus.status)
			setType(media.releaseMediaType.type)
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
			isLoading={isCreating || isUpdating}
		>
			{isTypesLoading || isStatusesLoading ? (
				<SkeletonLoader className='w-240 h-140 rounded-xl' />
			) : (
				<div
					className={`relative rounded-xl w-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6`}
				>
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
								options={metaStore.releaseMediaTypes.map(entry => entry.type)}
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
								options={metaStore.releaseMediaStatuses.map(
									entry => entry.status
								)}
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
									isCreating || !isFormValid || !hasChanges || isUpdating
								}
								isLoading={isCreating || isUpdating}
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
			)}
		</ModalOverlay>
	)
}

export default MediaFormModal
