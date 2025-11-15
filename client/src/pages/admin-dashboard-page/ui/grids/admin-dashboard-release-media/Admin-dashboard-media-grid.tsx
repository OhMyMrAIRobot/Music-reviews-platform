import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ReleaseMediaAPI } from '../../../../../api/release/release-media-api'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import ReleaseMediaStatusIcon from '../../../../../components/release/release-media/Release-media-status-icon'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useReleaseMediaMeta } from '../../../../../hooks/use-release-media-meta'
import { ReleaseMediaStatusesFilterOptions } from '../../../../../models/release/release-media/release-media-status/release-media-statuses-filter-options'
import { ReleaseMediaTypesFilterOptions } from '../../../../../models/release/release-media/release-media-type/release-media-types-filter-options'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { releaseMediaKeys } from '../../../../../query-keys/release-media-keys'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminFilterButton from '../../buttons/Admin-filter-button'
import AdminDashboardMediaGridItem from './Admin-dashboard-media-grid-item'
import MediaFormModal from './Media-form-modal'

const perPage = 10

const AdminDashboardMediaGrid = () => {
	const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta()

	const [addModalOpen, setAddModalOpen] = useState<boolean>(false)
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeStatus, setActiveStatus] = useState<string>(
		ReleaseMediaStatusesFilterOptions.ALL
	)
	const [activeType, setActiveType] = useState<string>(
		ReleaseMediaTypesFilterOptions.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const statusId =
		activeStatus !== ReleaseMediaStatusesFilterOptions.ALL
			? statuses.find(status => status.status === activeStatus)?.id ?? null
			: null

	const typeId =
		activeType !== ReleaseMediaTypesFilterOptions.ALL
			? types.find(type => type.type === activeType)?.id ?? null
			: null

	const queryKey = releaseMediaKeys.list({
		limit: perPage,
		offset: (currentPage - 1) * perPage,
		statusId,
		typeId,
		order,
	})

	const queryFn = () =>
		ReleaseMediaAPI.fetchReleaseMedia(
			perPage,
			(currentPage - 1) * perPage,
			statusId,
			typeId,
			null,
			null,
			searchText.trim().length > 0 ? searchText.trim() : null,
			order
		)

	const { data: mediaData, isPending: isMediaLoading } = useQuery({
		queryKey,
		queryFn,
		enabled: !isMetaLoading,
		staleTime: 1000 * 60 * 5,
	})

	const media = mediaData?.releaseMedia || []
	const count = mediaData?.count || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [searchText, activeStatus, activeType])

	return (
		<div className='flex flex-col h-screen' id='admin-media'>
			<AdminHeader title={'Медиаматериалы'} setText={setSearchText} />

			{!isMetaLoading && (
				<MediaFormModal
					isOpen={addModalOpen}
					onClose={() => setAddModalOpen(false)}
				/>
			)}

			<div id='admin-media-grid' className='flex flex-col overflow-hidden p-5'>
				<div className='flex flex-wrap mb-2 gap-y-2 text-white/80 border-b border-white/10'>
					{isMetaLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<SkeletonLoader
									key={`status-skeleton-button-${idx}`}
									className='w-20 h-4 rounded-lg mr-5 mb-1'
								/>
						  ))
						: Object.values(ReleaseMediaStatusesFilterOptions).map(option => (
								<AdminFilterButton
									key={option}
									title={
										<span className={`flex items-center px-2 gap-x-1`}>
											<ReleaseMediaStatusIcon
												status={option}
												className='size-5'
											/>
											{option}
										</span>
									}
									isActive={activeStatus === option}
									onClick={() => setActiveStatus(option)}
								/>
						  ))}

					<div className='max-sm:hidden ml-auto'>
						<AdminFilterButton
							title={'Добавить медиа'}
							isActive={false}
							onClick={() => setAddModalOpen(true)}
						/>
					</div>
				</div>

				<div className='flex flex-wrap gap-y-2 xl:mb-5 text-white/80 border-b border-white/10'>
					{isMetaLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<SkeletonLoader
									key={`type-skeleton-button-${idx}`}
									className='w-20 h-4 rounded-lg mr-5 mb-1'
								/>
						  ))
						: Object.values(ReleaseMediaTypesFilterOptions).map(option => (
								<AdminFilterButton
									key={option}
									title={
										<span className={`flex items-center px-2 gap-x-1`}>
											{option}
										</span>
									}
									isActive={activeType === option}
									onClick={() => setActiveType(option)}
								/>
						  ))}
				</div>

				<div className='sm:hidden mt-2 text-white/80 border-b border-white/10'>
					<AdminFilterButton
						title={'Добавить медиа'}
						isActive={false}
						onClick={() => setAddModalOpen(true)}
					/>
				</div>

				<AdminDashboardMediaGridItem
					className='bg-white/5 font-medium max-xl:hidden'
					isLoading={false}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrdersEnum.DESC
								? SortOrdersEnum.ASC
								: SortOrdersEnum.DESC
						)
					}
				/>

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isMediaLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardMediaGridItem
										key={`Media-skeleton-${idx}`}
										isLoading={isMediaLoading}
									/>
							  ))
							: media.map((mediaItem, idx) => (
									<AdminDashboardMediaGridItem
										key={mediaItem.id}
										media={mediaItem}
										isLoading={isMediaLoading}
										position={(currentPage - 1) * perPage + idx + 1}
									/>
							  ))}
					</div>
				</div>

				{!isMediaLoading && count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Медиаматериалы не найдены!
					</span>
				)}

				{!isMediaLoading && count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-media-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboardMediaGrid
