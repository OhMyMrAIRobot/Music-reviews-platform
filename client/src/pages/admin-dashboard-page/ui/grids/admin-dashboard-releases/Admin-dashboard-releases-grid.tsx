import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { ReleaseTypesFilterOptions } from '../../../../../models/release/release-type/release-types-filter-options.ts'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum.ts'
import { SortOrder } from '../../../../../types/sort-order-type.ts'
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx'
import AdminDashboardReleasesGridItem from './Admin-dashboard-releases-grid-item.tsx'
import ReleaseFormModal from './Release-form-modal.tsx'

const AdminDashboardReleasesGrid = observer(() => {
	const perPage = 10

	const { adminDashboardReleasesStore, metaStore } = useStore()

	const [addModalOpen, setAddModalOpen] = useState<boolean>(false)
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeType, setActiveType] = useState<string>(
		ReleaseTypesFilterOptions.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const { execute: fetch, isLoading: isReleasesLoading } = useLoading(
		adminDashboardReleasesStore.fetchReleases
	)

	const { execute: fetchReleaseTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseTypes
	)

	const fetchReleases = () => {
		let typeId: string | null = null
		if (activeType !== ReleaseTypesFilterOptions.ALL) {
			const type = metaStore.releaseTypes.find(type => type.type === activeType)
			typeId = type?.id ?? null
		}
		return fetch(
			typeId,
			searchText.trim() ? searchText : null,
			order,
			perPage,
			(currentPage - 1) * perPage
		)
	}

	useEffect(() => {
		setCurrentPage(1)
		fetchReleases()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText, activeType])

	useEffect(() => {
		fetchReleases()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, order])

	useEffect(() => {
		if (metaStore.releaseTypes.length === 0) {
			fetchReleaseTypes()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='flex flex-col h-screen' id='admin-authors'>
			<AdminHeader title={'Релизы'} setText={setSearchText} />

			{!isTypesLoading && (
				<ReleaseFormModal
					isOpen={addModalOpen}
					onClose={() => setAddModalOpen(false)}
					refetchReleases={fetchReleases}
				/>
			)}

			<div id='admin-users-grid' className='flex flex-col overflow-hidden p-5'>
				<div className='flex flex-wrap lg:mb-5 gap-y-2 text-white/80 border-b border-white/10'>
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

					<div className='lg:ml-auto'>
						<AdminFilterButton
							title={'Добавить релиз'}
							isActive={false}
							onClick={() => setAddModalOpen(true)}
						/>
					</div>
				</div>

				<AdminDashboardReleasesGridItem
					className='bg-white/5 font-medium max-lg:hidden'
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

				{!isReleasesLoading && adminDashboardReleasesStore.count === 0 && (
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
							: adminDashboardReleasesStore.releases.map((release, idx) => (
									<AdminDashboardReleasesGridItem
										key={release.id}
										release={release}
										isLoading={isReleasesLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										refetchReleases={fetchReleases}
									/>
							  ))}
					</div>
				</div>

				{!isReleasesLoading && adminDashboardReleasesStore.count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardReleasesStore.count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-authors-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
})

export default AdminDashboardReleasesGrid
