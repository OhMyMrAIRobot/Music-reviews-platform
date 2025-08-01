import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'

interface IProps {
	releaseId: string
}

const SendMediaReviewForm: FC<IProps> = observer(({ releaseId }) => {
	const { releaseDetailsPageStore, notificationStore } = useStore()

	const userReleaseMedia = releaseDetailsPageStore.userReleaseMedia

	const [title, setTitle] = useState<string>('')
	const [url, setUrl] = useState<string>('')

	const { execute: postReleaseMedia, isLoading: isPosting } = useLoading(
		releaseDetailsPageStore.postMediaReview
	)

	const { execute: updateReleaseMedia, isLoading: isUpdating } = useLoading(
		releaseDetailsPageStore.updateReleaseMedia
	)

	const { execute: deleteReleaseMedia, isLoading: isDeleting } = useLoading(
		releaseDetailsPageStore.deleteReleaseMedia
	)

	const handleSubmit = async () => {
		if (isPosting || !isValid || isDeleting || isUpdating) return

		let errors: string[] = []
		if (userReleaseMedia) {
			if (hasChanges) {
				errors = await updateReleaseMedia(
					userReleaseMedia.id,
					title !== userReleaseMedia.title ? title.trim() : undefined,
					url !== userReleaseMedia.url ? url.trim() : undefined
				)
			} else {
				return
			}
		} else {
			errors = await postReleaseMedia(releaseId, title, url)
		}

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				`Вы успешно ${
					userReleaseMedia ? 'обновили' : 'добавили'
				} медиарецензию. Ожидайте подтверждения!`
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	const handleDelete = async () => {
		if (isPosting || isDeleting || isUpdating || !userReleaseMedia) return

		const errors = await deleteReleaseMedia(userReleaseMedia.id)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили медиарецензию!'
			)
			setUrl('')
			setTitle('')
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	useEffect(() => {
		if (userReleaseMedia) {
			setTitle(userReleaseMedia.title)
			setUrl(userReleaseMedia.url)
		}
	}, [userReleaseMedia])

	const isValid = useMemo(() => {
		return url.trim() && title.trim()
	}, [title, url])

	const hasChanges = useMemo(() => {
		if (!userReleaseMedia) return true
		return (
			userReleaseMedia.title.trim() !== title.trim() ||
			userReleaseMedia.url.trim() !== url.trim()
		)
	}, [title, url, userReleaseMedia])

	return (
		<div className='border bg-zinc-900 rounded-xl p-4 border-white/10'>
			<div className='grid grid-cols-2 gap-5'>
				<div className='grid gap-2'>
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

				<div className='grid gap-2'>
					<FormLabel
						name={'Ссылка на медиарецензию'}
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
			</div>

			<div className='flex items-center justify-between mt-4'>
				<div className='w-40'>
					<FormButton
						title={userReleaseMedia ? 'Обновить' : 'Отправить'}
						isInvert={true}
						onClick={handleSubmit}
						disabled={!isValid || isPosting || !hasChanges}
						isLoading={isPosting}
					/>
				</div>

				{userReleaseMedia && (
					<div className='w-40'>
						<FormButton
							title={'Удалить'}
							isInvert={false}
							onClick={handleDelete}
							disabled={!userReleaseMedia || isDeleting}
							isLoading={isDeleting}
						/>
					</div>
				)}
			</div>
		</div>
	)
})

export default SendMediaReviewForm
