import { useEffect, useState } from 'react'
import AdminHeader from '../../../../components/admin-header/Admin-header'
import Pagination from '../../../../components/pagination/Pagination'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { AuthorTypesFilterEnum } from '../../../../models/author/author-types-filter-enum'
import AdminFilterButton from '../../buttons/Admin-filter-button'
import AdminDashboardAuthorsGridItem from './Admin-dashboard-authors-grid-item'

const AdminDashboardAuthorsGrid = () => {
	const perPage = 10

	const { adminDashboardAuthorsStore, metaStore, notificationStore } =
		useStore()

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeType, setActiveType] = useState<string>(
		AuthorTypesFilterEnum.ALL
	)

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
		return fetch(typeId, searchText, perPage, (currentPage - 1) * perPage)
	}

	const deleteAuthor = async (id: string) => {
		const result = await adminDashboardAuthorsStore.deleteAuthor(id)
		if (result.length === 0) {
			notificationStore.addSuccessNotification('Вы успешно удалили автора!')
			fetchAuthors()
		} else {
			result.forEach(err => notificationStore.addErrorNotification(err))
		}
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

			<div id='admin-users-grid' className='flex flex-col overflow-hidden p-5'>
				<div className='flex mb-5 text-white/80 border-b border-white/10'>
					{isTypesLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<div
									key={`skeleton-button-${idx}`}
									className='bg-gray-400 w-20 h-4 rounded-lg animate-pulse opacity-40 mr-5 mb-1'
								/>
						  ))
						: Object.values(AuthorTypesFilterEnum).map(option => (
								<AdminFilterButton
									key={option}
									title={option}
									isActive={activeType === option}
									onClick={() => setActiveType(option)}
								/>
						  ))}
				</div>

				<AdminDashboardAuthorsGridItem
					className='bg-white/5 font-medium'
					isLoading={false}
				/>

				{!isLoading && adminDashboardAuthorsStore.total === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Авторы не найдены!
					</span>
				)}

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardAuthorsGridItem
										key={`User-skeleton-${idx}`}
										isLoading={isLoading}
									/>
							  ))
							: adminDashboardAuthorsStore.authors.map((author, idx) => (
									<AdminDashboardAuthorsGridItem
										key={author.id}
										author={author}
										isLoading={isLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										deleteAuthor={() => deleteAuthor(author.id)}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && adminDashboardAuthorsStore.total > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardAuthorsStore.total}
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

export default AdminDashboardAuthorsGrid
