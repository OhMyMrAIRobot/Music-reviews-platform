import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FC, useEffect, useMemo, useState } from 'react'
import { ReleaseMediaAPI } from '../../../../../../api/release/release-media-api'
import FormButton from '../../../../../../components/form-elements/Form-button'
import FormInput from '../../../../../../components/form-elements/Form-input'
import FormLabel from '../../../../../../components/form-elements/Form-label'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useStore } from '../../../../../../hooks/use-store'
import { releaseMediaKeys } from '../../../../../../query-keys/release-media-keys'
import authStore from '../../../../../../stores/auth-store'

interface IProps {
	releaseId: string
}

const ReleaseDetailsMediaReviewForm: FC<IProps> = ({ releaseId }) => {
	const { notificationStore } = useStore()

	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()

	const invalidateRelatedQueries = () => {
		const keys = [
			releaseMediaKeys.userByRelease(releaseId, authStore.user?.id || ''),
			releaseMediaKeys.all,
		]
		keys.forEach(key => queryClient.invalidateQueries({ queryKey: key }))
	}

	const createMutation = useMutation({
		mutationFn: (data: { title: string; url: string }) =>
			ReleaseMediaAPI.postReleaseMedia(data.title, data.url, releaseId),
		onSuccess: data => {
			invalidateRelatedQueries()
			queryClient.setQueryData(
				releaseMediaKeys.userByRelease(releaseId, authStore.user?.id || ''),
				data
			)
		},
	})

	const updateMutation = useMutation({
		mutationFn: (data: {
			id: string
			updateData: { title?: string; url?: string }
		}) => ReleaseMediaAPI.updateReleaseMedia(data.id, data.updateData),
		onSuccess: data => {
			invalidateRelatedQueries()
			queryClient.setQueryData(
				releaseMediaKeys.userByRelease(releaseId, authStore.user?.id || ''),
				data
			)
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => ReleaseMediaAPI.deleteReleaseMedia(id),
		onSuccess: () => {
			invalidateRelatedQueries()
			queryClient.setQueryData(
				releaseMediaKeys.userByRelease(releaseId, authStore.user?.id || ''),
				undefined
			)
		},
	})

	const { data: userReleaseMedia } = useQuery({
		queryKey: releaseMediaKeys.userByRelease(
			releaseId,
			authStore.user?.id || ''
		),
		queryFn: () =>
			ReleaseMediaAPI.fetchUserReleaseMedia(
				releaseId,
				authStore.user?.id || ''
			),
		enabled: authStore.isAuth,
		staleTime: 1000 * 60 * 5,
		retry: false,
	})

	const [title, setTitle] = useState<string>('')
	const [url, setUrl] = useState<string>('')

	const handleSubmit = async () => {
		if (
			!checkAuth() ||
			createMutation.isPending ||
			updateMutation.isPending ||
			deleteMutation.isPending ||
			!isValid ||
			!hasChanges
		)
			return

		try {
			if (userReleaseMedia) {
				await updateMutation.mutateAsync({
					id: userReleaseMedia.id,
					updateData: {
						title: title !== userReleaseMedia.title ? title.trim() : undefined,
						url: url !== userReleaseMedia.url ? url.trim() : undefined,
					},
				})
			} else {
				await createMutation.mutateAsync({
					title: title.trim(),
					url: url.trim(),
				})
			}

			notificationStore.addSuccessNotification(
				`Вы успешно ${
					userReleaseMedia ? 'обновили' : 'добавили'
				} медиарецензию. Ожидайте подтверждения!`
			)
		} catch (error: unknown) {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		}
	}

	const handleDelete = async () => {
		if (
			!checkAuth() ||
			createMutation.isPending ||
			updateMutation.isPending ||
			deleteMutation.isPending ||
			!userReleaseMedia
		)
			return

		try {
			await deleteMutation.mutateAsync(userReleaseMedia.id)
			notificationStore.addSuccessNotification(
				'Вы успешно удалили медиарецензию!'
			)
			setUrl('')
			setTitle('')
		} catch (error: unknown) {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
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
			{userReleaseMedia && (
				<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 mb-4 font-medium'>
					Вы уже оставляли медиарецензию к данной работе. Вы можете изменить ее,
					заполнив форму ниже!
				</div>
			)}

			<div className='grid md:grid-cols-2 gap-y-3 gap-5'>
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

			<div className='grid sm:flex items-center gap-y-3 sm:justify-between mt-6'>
				<div className='w-full sm:w-40'>
					<FormButton
						title={userReleaseMedia ? 'Обновить' : 'Отправить'}
						isInvert={true}
						onClick={handleSubmit}
						disabled={
							!isValid ||
							createMutation.isPending ||
							updateMutation.isPending ||
							!hasChanges
						}
						isLoading={createMutation.isPending || updateMutation.isPending}
					/>
				</div>

				{userReleaseMedia && (
					<div className='w-full sm:w-40'>
						<FormButton
							title={'Удалить'}
							isInvert={false}
							onClick={handleDelete}
							disabled={!userReleaseMedia || deleteMutation.isPending}
							isLoading={deleteMutation.isPending}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default ReleaseDetailsMediaReviewForm
