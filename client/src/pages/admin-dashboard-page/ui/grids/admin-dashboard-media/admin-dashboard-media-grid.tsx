import { useEffect, useState } from 'react'
import AdminHeader from '../../../../../components/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import ReleaseMediaStatusIcon from '../../../../../components/release-media/Release-media-status-icon'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { ReleaseMediaStatusesFilterOptions } from '../../../../../models/release-media-status/release-media-statuses-filter-options'
import { ReleaseMediaTypesFilterOptions } from '../../../../../models/release-media-type/release-media-types-filter-options'
import { SortOrderEnum } from '../../../../../models/sort/sort-order-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminFilterButton from '../../buttons/Admin-filter-button'
import AdminDashboardMediaGridItem from './admin-dashboard-media-grid-item'

const AdminDashboardMediaGrid = () => {
	const perPage = 10

	const { metaStore, adminDashboardMediaStore } = useStore()

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeStatus, setActiveStatus] = useState<string>(
		ReleaseMediaStatusesFilterOptions.ALL
	)
	const [activeType, setActiveType] = useState<string>(
		ReleaseMediaTypesFilterOptions.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrderEnum.DESC)

	const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
		metaStore.fetchReleaseMediaStatuses
	)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseMediaTypes
	)

	const { execute: _fetchMedia, isLoading: isMediaLoading } = useLoading(
		adminDashboardMediaStore.fetchReleaseMedia
	)

	const fetchMedia = async () => {
		let statusId: string | null = null
		let typeId: string | null = null
		if (activeStatus !== ReleaseMediaStatusesFilterOptions.ALL) {
			statusId =
				metaStore.releaseMediaStatuses.find(
					status => status.status === activeStatus
				)?.id ?? null
		}
		if (activeType !== ReleaseMediaTypesFilterOptions.ALL) {
			typeId =
				metaStore.releaseMediaTypes.find(type => type.type === activeType)
					?.id ?? null
		}
		return _fetchMedia(
			perPage,
			(currentPage - 1) * perPage,
			statusId,
			typeId,
			searchText.trim().length > 0 ? searchText : null,
			order
		)
	}

	useEffect(() => {
		if (metaStore.releaseMediaStatuses.length === 0) {
			fetchStatuses()
		}
		if (metaStore.releaseMediaTypes.length === 0) {
			fetchTypes()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setCurrentPage(1)
		fetchMedia()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText, activeStatus, activeType])

	useEffect(() => {
		fetchMedia()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, order])

	return (
		<div className='flex flex-col h-screen' id='admin-media'>
			<AdminHeader title={'Медиаматериалы'} setText={setSearchText} />

			<div id='admin-media-grid' className='flex flex-col overflow-hidden p-5'>
				<div className='flex mb-2 text-white/80 border-b border-white/10'>
					{isStatusesLoading
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
				</div>

				<div className='flex mb-5 text-white/80 border-b border-white/10'>
					{isTypesLoading
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

				<AdminDashboardMediaGridItem
					className='bg-white/5 font-medium'
					isLoading={false}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrderEnum.DESC
								? SortOrderEnum.ASC
								: SortOrderEnum.DESC
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
							: adminDashboardMediaStore.releaseMedia.map((media, idx) => (
									<AdminDashboardMediaGridItem
										key={media.id}
										media={media}
										isLoading={isMediaLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										refetch={fetchMedia}
									/>
							  ))}
					</div>
				</div>

				{!isMediaLoading &&
					adminDashboardMediaStore.releaseMediaCount === 0 && (
						<span className='font-medium mx-auto mt-5 text-lg'>
							Медиаматериалы не найдены!
						</span>
					)}

				{!isMediaLoading && adminDashboardMediaStore.releaseMediaCount > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardMediaStore.releaseMediaCount}
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
