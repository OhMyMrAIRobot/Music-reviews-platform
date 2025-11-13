import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ReleaseAPI } from '../../../../../api/release/release-api.ts'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useReleaseMeta } from '../../../../../hooks/use-release-meta.ts'
import { ReleaseTypesFilterOptions } from '../../../../../models/release/release-type/release-types-filter-options.ts'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum.ts'
import { releasesKeys } from '../../../../../query-keys/releases-keys.ts'
import { SortOrder } from '../../../../../types/sort-order-type.ts'
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx'
import AdminToggleSortOrderButton from '../../buttons/Admin-toggle-sort-order-button.tsx'
import AdminDashboardReleasesGridItem from './Admin-dashboard-releases-grid-item.tsx'
import ReleaseFormModal from './Release-form-modal.tsx'

const perPage = 10

const AdminDashboardReleasesGrid = () => {
	const [addModalOpen, setAddModalOpen] = useState<boolean>(false)
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeType, setActiveType] = useState<string>(
		ReleaseTypesFilterOptions.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const { types, isLoading: isTypesLoading } = useReleaseMeta()

	const typeId =
		activeType === ReleaseTypesFilterOptions.ALL
			? null
			: types.find(type => type.type === activeType)?.id || null

	const queryKey = releasesKeys.adminList({
		typeId,
		query: searchText.trim() || null,
		order,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
	})

	const queryFn = () =>
		ReleaseAPI.adminFetchReleases(
			typeId,
			searchText.trim() || null,
			order,
			perPage,
			(currentPage - 1) * perPage
		)

	const { data, isPending: isReleasesLoading } = useQuery({
		queryKey,
		queryFn,
		enabled: !isTypesLoading,
		staleTime: 1000 * 60 * 5,
	})

	const releases = data?.releases || []
	const count = data?.count || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [searchText, activeType])

	return (
		<div className='flex flex-col h-screen' id='admin-authors'>
			<AdminHeader title={'Релизы'} setText={setSearchText} />

			{!isTypesLoading && (
				<ReleaseFormModal
					isOpen={addModalOpen}
					onClose={() => setAddModalOpen(false)}
				/>
			)}

			<div id='admin-users-grid' className='flex flex-col overflow-hidden p-5'>
				<div className='flex flex-wrap xl:mb-5 gap-y-2 text-white/80 border-b border-white/10'>
					{isTypesLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<SkeletonLoader
									key={`skeleton-button-${idx}`}
									className='w-20 h-4 rounded-lg mr-5 mb-1'
								/>
						  ))
						: Object.values(ReleaseTypesFilterOptions).map(type => (
								<AdminFilterButton
									key={type}
									title={
										<span className={`flex items-center px-2`}>
											<ReleaseTypeIcon type={type} className={'size-5 mr-1'} />
											{type}
										</span>
									}
									isActive={activeType === type}
									onClick={() => setActiveType(type)}
								/>
						  ))}

					<div className='ml-auto max-sm:hidden'>
						<AdminFilterButton
							title={'Добавить релиз'}
							isActive={false}
							onClick={() => setAddModalOpen(true)}
						/>
					</div>
				</div>

				<div className='sm:hidden mt-2 text-white/80 border-b border-white/10'>
					<AdminFilterButton
						title={'Добавить релиз'}
						isActive={false}
						onClick={() => setAddModalOpen(true)}
					/>
				</div>

				<AdminToggleSortOrderButton
					title={'Дата создания'}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrdersEnum.DESC
								? SortOrdersEnum.ASC
								: SortOrdersEnum.DESC
						)
					}
				/>

				<AdminDashboardReleasesGridItem
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

				{!isReleasesLoading && count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Релизы не найдены!
					</span>
				)}

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isReleasesLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardReleasesGridItem
										key={`Release-skeleton-${idx}`}
										isLoading={isReleasesLoading}
									/>
							  ))
							: releases.map((release, idx) => (
									<AdminDashboardReleasesGridItem
										key={release.id}
										release={release}
										isLoading={isReleasesLoading}
										position={(currentPage - 1) * perPage + idx + 1}
									/>
							  ))}
					</div>
				</div>

				{!isReleasesLoading && count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-authors-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboardReleasesGrid
