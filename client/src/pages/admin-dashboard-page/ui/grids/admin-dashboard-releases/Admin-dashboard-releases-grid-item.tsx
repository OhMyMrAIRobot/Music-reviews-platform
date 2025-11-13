import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import { ReleaseAPI } from '../../../../../api/release/release-api.ts'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import useNavigationPath from '../../../../../hooks/use-navigation-path.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { AuthorTypesEnum } from '../../../../../models/author/author-type/author-types-enum.ts'
import { IAdminRelease } from '../../../../../models/release/admin-release/admin-release.ts'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum.ts'
import { releasesKeys } from '../../../../../query-keys/releases-keys.ts'
import { SortOrder } from '../../../../../types/sort-order-type.ts'
import { getAuthorTypeColor } from '../../../../../utils/get-author-type-color.ts'
import { getReleaseTypeColor } from '../../../../../utils/get-release-type-color.ts'
import AdminDeleteButton from '../../buttons/Admin-delete-button.tsx'
import AdminEditButton from '../../buttons/Admin-edit-button.tsx'
import ReleaseFormModal from './Release-form-modal.tsx'

interface IProps {
	className?: string
	release?: IAdminRelease
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
}

const AdminDashboardReleasesGridItem: FC<IProps> = ({
	className = '',
	release,
	order,
	isLoading,
	position,
	toggleOrder,
}) => {
	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

	const { notificationStore } = useStore()
	const queryClient = useQueryClient()

	const { navigateToReleaseDetails } = useNavigationPath()

	const deleteMutation = useMutation({
		mutationFn: (id: string) => ReleaseAPI.deleteRelease(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: releasesKeys.all })
			notificationStore.addSuccessNotification('Вы успешно удалили релиз!')
			setConfModalOpen(false)
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		},
	})

	const handleDelete = async () => {
		if (deleteMutation.isPending || !release) return
		await deleteMutation.mutateAsync(release.id)
	}

	return isLoading ? (
		<SkeletonLoader className='w-full h-80 xl:h-12 rounded-lg' />
	) : (
		<>
			{release && (
				<>
					{confModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить релиз?'}
							isOpen={confModalOpen}
							onConfirm={() => handleDelete()}
							onCancel={() => setConfModalOpen(false)}
							isLoading={deleteMutation.isPending}
						/>
					)}

					{editModalOpen && (
						<ReleaseFormModal
							isOpen={editModalOpen}
							onClose={() => setEditModalOpen(false)}
							release={release}
						/>
					)}
				</>
			)}

			<div
				className={`${className} text-sm xl:h-12 w-full rounded-lg grid xl:grid-cols-12 grid-rows-8 xl:grid-rows-1 items-center px-3 max-xl:py-2 border border-white/10 text-nowrap font-medium relative`}
			>
				<div className='xl:col-span-1 text-ellipsis line-clamp-1'>
					<span className='xl:hidden'># </span>
					{position ?? '#'}
				</div>

				{release && (
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							release.img === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: release.img
						}`}
						alt={release.title}
						className='absolute right-2 top-2 size-22 object-cover aspect-square select-none rounded-lg xl:hidden'
					/>
				)}

				<div className='xl:col-span-2 h-full flex items-center mr-2 max-xl:max-w-[calc(100%-90px)]'>
					{release ? (
						<Link
							to={navigateToReleaseDetails(release.id)}
							className='flex text-left gap-x-1.5 items-center hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
									release.img === ''
										? import.meta.env.VITE_DEFAULT_COVER
										: release.img
								}`}
								alt={release.title}
								className='hidden xl:block size-9 object-cover aspect-square rounded-full select-none'
							/>

							<span className='overflow-hidden xl:line-clamp-2 text-ellipsis text-wrap'>
								<span className='xl:hidden'>Название: </span>
								<span className='max-xl:underline underline-offset-4'>
									{release.title}
								</span>
							</span>
						</Link>
					) : (
						<span className='px-4'>Название релиза</span>
					)}
				</div>

				<div className='xl:col-span-1 flex items-center text-ellipsis line-clamp-1 '>
					{release ? (
						<>
							<span className='xl:hidden'>Тип релиза: </span>
							<div
								className={`flex max-xl:ml-1 gap-x-1 items-center ${getReleaseTypeColor(
									release.releaseType.type
								)}`}
							>
								<ReleaseTypeIcon
									type={release.releaseType.type}
									className={'size-5'}
								/>
								<span>{release.releaseType.type}</span>
							</div>
						</>
					) : (
						<span>Тип релиза</span>
					)}
				</div>

				<div className='xl:col-span-2 text-ellipsis text-wrap '>
					{release ? (
						<>
							<span className='xl:hidden'>Дата создания: </span>
							<span>{release.publishDate}</span>
						</>
					) : (
						<button
							onClick={() => toggleOrder}
							className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
						>
							<span>Дата создания</span>
							<ArrowBottomSvg
								className={`size-3 ${
									order === SortOrdersEnum.ASC ? 'rotate-180' : ''
								}`}
							/>
						</button>
					)}
				</div>

				<div className='xl:col-span-2 line-clamp-2 text-wrap text-ellipsis  mr-2'>
					{release ? (
						<>
							<span className='xl:hidden'>Артист: </span>
							{release.releaseArtists.length === 0 ? (
								<span className='opacity-50 '>Отсутствует</span>
							) : (
								release.releaseArtists.map((ra, idx) => (
									<span key={ra.id}>
										<span
											className={` ${getAuthorTypeColor(
												AuthorTypesEnum.ARTIST
											)}`}
										>
											{ra.name}
										</span>
										{idx < release.releaseArtists.length - 1 && ', '}
									</span>
								))
							)}
						</>
					) : (
						<span>Артист</span>
					)}
				</div>

				<div className='xl:col-span-2 line-clamp-2 text-wrap text-ellipsis  mr-2'>
					{release ? (
						<>
							<span className='xl:hidden'>Продюссер: </span>
							{release.releaseProducers.length === 0 ? (
								<span className='opacity-50 '>Отсутствует</span>
							) : (
								release.releaseProducers.map((rp, idx) => (
									<span key={rp.id}>
										<span
											className={` ${getAuthorTypeColor(
												AuthorTypesEnum.PRODUCER
											)}`}
										>
											{rp.name}
										</span>
										{idx < release.releaseProducers.length - 1 && ', '}
									</span>
								))
							)}
						</>
					) : (
						<span>Продюссер</span>
					)}
				</div>

				<div className='xl:col-span-1 line-clamp-2 text-wrap text-ellipsis  mr-2'>
					{release ? (
						<>
							<span className='xl:hidden'>Дизайнер: </span>
							{release.releaseDesigners.length === 0 ? (
								<span className='opacity-50 '>Отсутствует</span>
							) : (
								release.releaseDesigners.map((rd, idx) => (
									<span key={rd.id}>
										<span
											className={` ${getAuthorTypeColor(
												AuthorTypesEnum.DESIGNER
											)}`}
										>
											{rd.name}
										</span>
										{idx < release.releaseDesigners.length - 1 && ', '}
									</span>
								))
							)}
						</>
					) : (
						<span>Дизайнер</span>
					)}
				</div>

				<div className='xl:col-span-1 max-xl:mt-1'>
					{release ? (
						<div className='flex gap-x-3 xl:justify-end'>
							<AdminEditButton onClick={() => setEditModalOpen(true)} />
							<AdminDeleteButton onClick={() => setConfModalOpen(true)} />
						</div>
					) : (
						'Действие'
					)}
				</div>
			</div>
		</>
	)
}

export default AdminDashboardReleasesGridItem
