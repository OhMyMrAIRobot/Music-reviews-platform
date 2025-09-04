import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AuthorTypeSvg from '../../../../../components/author/author-types/Author-type-svg.tsx'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { AuthorTypesFilterEnum } from '../../../../../models/author/author-type/author-types-filter-enum.ts'
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx'
import AdminDashboardAuthorsGridItem from './Admin-dashboard-authors-grid-item.tsx'
import AuthorFormModal from './Author-form-modal.tsx'

const AdminDashboardAuthorsGrid = observer(() => {
	const perPage = 10

	const { adminDashboardAuthorsStore, metaStore } = useStore()

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeType, setActiveType] = useState<string>(
		AuthorTypesFilterEnum.ALL
	)
	const [addModalOpen, setAddModalOpen] = useState<boolean>(false)

	const { execute: fetch, isLoading } = useLoading(
		adminDashboardAuthorsStore.fetchAuthors
	)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchAuthorTypes
	)

	const fetchAuthors = () => {
		let typeId: string | null = null
		if (activeType !== AuthorTypesFilterEnum.ALL) {
			const type = metaStore.authorTypes.find(type => type.type === activeType)
			typeId = type?.id ?? null
		}
		return fetch(
			typeId,
			searchText.trim() ? searchText.trim() : null,
			perPage,
			(currentPage - 1) * perPage
		)
	}

	useEffect(() => {
		if (metaStore.authorTypes.length === 0) {
			fetchTypes()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setCurrentPage(1)
		fetchAuthors()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText, activeType])

	useEffect(() => {
		fetchAuthors()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage])

	return (
		<div className='flex flex-col h-screen' id='admin-authors'>
			<AdminHeader title={'Авторы'} setText={setSearchText} />

			{!isTypesLoading && (
				<AuthorFormModal
					isOpen={addModalOpen}
					onClose={() => setAddModalOpen(false)}
					refetchAuthors={fetchAuthors}
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
						: Object.values(AuthorTypesFilterEnum).map(option => (
								<AdminFilterButton
									key={option}
									title={
										<span className={`flex items-center px-2`}>
											<AuthorTypeSvg
												type={{ id: '0', type: option }}
												className={'size-5 mr-1'}
											/>
											{option}
										</span>
									}
									isActive={activeType === option}
									onClick={() => setActiveType(option)}
								/>
						  ))}
					<div className='lg:ml-auto'>
						<AdminFilterButton
							title={'Добавить автора'}
							isActive={false}
							onClick={() => setAddModalOpen(true)}
						/>
					</div>
				</div>

				<AdminDashboardAuthorsGridItem
					className='bg-white/5 font-medium max-lg:hidden'
					isLoading={false}
				/>

				{!isLoading && adminDashboardAuthorsStore.count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Авторы не найдены!
					</span>
				)}

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardAuthorsGridItem
										key={`Author-skeleton-${idx}`}
										isLoading={isLoading}
									/>
							  ))
							: adminDashboardAuthorsStore.authors.map((author, idx) => (
									<AdminDashboardAuthorsGridItem
										key={author.id}
										author={author}
										isLoading={isLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										refetchAuthors={fetchAuthors}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && adminDashboardAuthorsStore.count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardAuthorsStore.count}
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

export default AdminDashboardAuthorsGrid
