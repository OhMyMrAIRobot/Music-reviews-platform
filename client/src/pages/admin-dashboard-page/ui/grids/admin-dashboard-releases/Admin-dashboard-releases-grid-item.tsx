import { FC, useState } from 'react'
import { Link } from 'react-router'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import useNavigationPath from '../../../../../hooks/use-navigation-path.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { AuthorTypesEnum } from '../../../../../models/author/author-type/author-types-enum.ts'
import { IAdminRelease } from '../../../../../models/release/admin-release/admin-release.ts'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum.ts'
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
	refetchReleases?: () => void
}

const AdminDashboardReleasesGridItem: FC<IProps> = ({
	className,
	release,
	order,
	isLoading,
	position,
	toggleOrder,
	refetchReleases,
}) => {
	const { adminDashboardReleasesStore, notificationStore } = useStore()

	const { navigateToReleaseDetails } = useNavigationPath()

	const { execute: deleteRelease, isLoading: isDeleting } = useLoading(
		adminDashboardReleasesStore.deleteRelease
	)

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

	const toggle = () => {
		if (toggleOrder) {
			toggleOrder()
		}
	}

	const handleRefetch = () => {
		if (refetchReleases) {
			refetchReleases()
		}
	}

	const handleDelete = async (id: string) => {
		if (isDeleting) return

		const errors = await deleteRelease(id)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification('Вы успешно удалили релиз!')
			handleRefetch()
		} else {
			errors.forEach(err => {
				notificationStore.addErrorNotification(err)
			})
		}
	}

	return isLoading ? (
		<SkeletonLoader className='w-full h-80 lg:h-12 rounded-lg' />
	) : (
		<>
			{release && (
				<>
					{confModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить релиз?'}
							isOpen={confModalOpen}
							onConfirm={() => handleDelete(release.id)}
							onCancel={() => setConfModalOpen(false)}
							isLoading={isDeleting}
						/>
					)}

					{editModalOpen && (
						<ReleaseFormModal
							isOpen={editModalOpen}
							onClose={() => setEditModalOpen(false)}
							release={release}
							refetchReleases={() => {}}
						/>
					)}
				</>
			)}

			<div
				className={`${className} text-sm lg:h-12 w-full rounded-lg grid lg:grid-cols-12 grid-rows-8 lg:grid-rows-1 items-center px-3 max-lg:py-2 border border-white/10 text-nowrap font-medium`}
			>
				<div className='lg:col-span-1 text-ellipsis line-clamp-1'>
					<span className='lg:hidden'># </span>
					{position ?? '#'}
				</div>

				<div className='lg:col-span-2 h-full flex items-center mr-2'>
					{release ? (
						<Link
							to={navigateToReleaseDetails(release.id)}
							className='flex text-left gap-x-1.5 items-center hover:bg-white/5 rounded-lg lg:px-1.5 lg:py-0.5 w-full'
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
								className='hidden lg:block size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='lg:hidden'>Название: </span>
							<span className=' line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
								{release.title}
							</span>
						</Link>
					) : (
						<span className='px-4'>Название релиза</span>
					)}
				</div>

				<div className='lg:col-span-1 flex items-center text-ellipsis line-clamp-1 '>
					{release ? (
						<>
							<span className='lg:hidden'>Тип релиза: </span>
							<div
								className={`flex max-lg:ml-1 gap-x-1 items-center ${getReleaseTypeColor(
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

				<div className='lg:col-span-2 text-ellipsis text-wrap '>
					{release ? (
						<>
							<span className='lg:hidden'>Дата создания: </span>
							<span>{release.publishDate}</span>
						</>
					) : (
						<button
							onClick={toggle}
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

				<div className='lg:col-span-2 line-clamp-2 text-wrap text-ellipsis  mr-2'>
					{release ? (
						<>
							<span className='lg:hidden'>Артист: </span>
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

				<div className='lg:col-span-2 line-clamp-2 text-wrap text-ellipsis  mr-2'>
					{release ? (
						<>
							<span className='lg:hidden'>Продюссер: </span>
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

				<div className='lg:col-span-1 line-clamp-2 text-wrap text-ellipsis  mr-2'>
					{release ? (
						<>
							<span className='lg:hidden'>Дизайнер: </span>
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

				<div className='lg:col-span-1'>
					{release ? (
						<div className='flex gap-x-3 lg:justify-end'>
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
