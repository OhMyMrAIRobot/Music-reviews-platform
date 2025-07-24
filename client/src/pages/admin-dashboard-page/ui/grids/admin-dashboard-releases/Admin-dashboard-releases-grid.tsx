import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AdminHeader from '../../../../../components/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { ReleaseTypesFilterEnum } from '../../../../../models/release/release-types-filter-enum.ts'
import { SortOrderEnum } from '../../../../../models/sort/sort-order-enum.ts'
import { SortOrder } from '../../../../../types/sort-order-type.ts'
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx'
import AdminDashboardReleasesGridItem from './Admin-dashboard-releases-grid-item.tsx'
import ReleaseFormModal from './Release-form-modal.tsx'

const AdminDashboardReleasesGrid = observer(() => {
	const perPage = 10

	const { adminDashboardReleasesStore, notificationStore, metaStore } =
		useStore()

	const [addModalOpen, setAddModalOpen] = useState<boolean>(false)
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeType, setActiveType] = useState<string>(
		ReleaseTypesFilterEnum.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrderEnum.DESC)

	const { execute: fetch, isLoading: isReleasesLoading } = useLoading(
		adminDashboardReleasesStore.fetchReleases
	)

	const { execute: fetchReleaseTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseTypes
	)

	const fetchReleases = () => {
		let typeId: string | null = null
		if (activeType !== ReleaseTypesFilterEnum.ALL) {
			const type = metaStore.releaseTypes.find(type => type.type === activeType)
			typeId = type?.id ?? null
		}
		return fetch(
			typeId,
			searchText,
			order,
			perPage,
			(currentPage - 1) * perPage
		)
	}

	const handleDelete = async (id: string) => {
		const errors = await adminDashboardReleasesStore.deleteRelease(id)
		if (errors.length === 0) {
			notificationStore.addSuccessNotification('Вы успешно удалили релиз!')
			fetchReleases()
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
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
				<div className='flex mb-5 text-white/80 border-b border-white/10'>
					{isTypesLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<div
									key={`skeleton-button-${idx}`}
									className='bg-gray-400 w-20 h-4 rounded-lg animate-pulse opacity-40 mr-5 mb-1'
								/>
						  ))
						: Object.values(ReleaseTypesFilterEnum).map(type => (
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

					<div className='ml-auto'>
						<AdminFilterButton
							title={'Добавить релиз'}
							isActive={false}
							onClick={() => setAddModalOpen(true)}
						/>
					</div>
				</div>

				<AdminDashboardReleasesGridItem
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
										deleteRelease={() => handleDelete(release.id)}
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
