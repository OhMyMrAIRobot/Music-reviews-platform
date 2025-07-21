import { useEffect, useState } from 'react'
import AdminHeader from '../../../../components/admin-header/Admin-header'
import Pagination from '../../../../components/pagination/Pagination'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import AdminDashboardReleasesGridItem from './Admin-dashboard-releases-grid-item'

const AdminDashboardReleasesGrid = () => {
	const perPage = 10

	const { adminDashboardReleasesStore } = useStore()

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)

	const { execute: fetchReleases, isLoading: isReleasesLoading } = useLoading(
		adminDashboardReleasesStore.fetchReleases
	)

	useEffect(() => {
		fetchReleases(null, searchText, perPage, (currentPage - 1) * perPage)
	}, [currentPage])

	return (
		<div className='flex flex-col h-screen' id='admin-authors'>
			<AdminHeader title={'Релизы'} setText={setSearchText} />

			<div id='admin-users-grid' className='flex flex-col overflow-hidden p-5'>
				<AdminDashboardReleasesGridItem
					className='bg-white/5 font-medium'
					isLoading={false}
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
							: adminDashboardReleasesStore.releases.map((releases, idx) => (
									<AdminDashboardReleasesGridItem
										key={releases.id}
										release={releases}
										isLoading={isReleasesLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										deleteRelease={() => {}}
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
}

export default AdminDashboardReleasesGrid
