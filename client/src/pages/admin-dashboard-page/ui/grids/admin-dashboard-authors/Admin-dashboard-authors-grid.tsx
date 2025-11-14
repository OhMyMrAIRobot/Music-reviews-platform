import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AuthorAPI } from '../../../../../api/author/author-api.ts'
import AuthorTypeSvg from '../../../../../components/author/author-types/Author-type-svg.tsx'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useAuthorMeta } from '../../../../../hooks/use-author-meta.ts'
import { AuthorTypesFilterEnum } from '../../../../../models/author/author-type/author-types-filter-enum.ts'
import { authorsKeys } from '../../../../../query-keys/authors-keys.ts'
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx'
import AdminDashboardAuthorsGridItem from './Admin-dashboard-authors-grid-item.tsx'
import AuthorFormModal from './Author-form-modal.tsx'

const perPage = 10

const AdminDashboardAuthorsGrid = () => {
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeType, setActiveType] = useState<string>(
		AuthorTypesFilterEnum.ALL
	)
	const [addModalOpen, setAddModalOpen] = useState<boolean>(false)

	const { types, isLoading: isTypesLoading } = useAuthorMeta()

	const typeId =
		activeType !== AuthorTypesFilterEnum.ALL && types
			? types.find(type => type.type === activeType)?.id ?? null
			: null

	const queryKey = authorsKeys.adminList({
		typeId,
		query: searchText.trim().length > 0 ? searchText.trim() : null,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
	})

	const queryFn = () =>
		AuthorAPI.adminFetchAuthors(
			typeId,
			searchText.trim().length > 0 ? searchText.trim() : null,
			perPage,
			(currentPage - 1) * perPage
		)

	const { data: authorsData, isPending } = useQuery({
		queryKey,
		queryFn,
		enabled: !isTypesLoading,
		staleTime: 1000 * 60 * 5,
	})

	const authors = authorsData?.authors || []
	const count = authorsData?.count || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [searchText, activeType])

	return (
		<div className='flex flex-col h-screen' id='admin-authors'>
			<AdminHeader title={'Авторы'} setText={setSearchText} />

			{!isTypesLoading && (
				<AuthorFormModal
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
					<div className='max-sm:hidden ml-auto'>
						<AdminFilterButton
							title={'Добавить автора'}
							isActive={false}
							onClick={() => setAddModalOpen(true)}
						/>
					</div>
				</div>

				<div className='sm:hidden mt-2 text-white/80 border-b border-white/10'>
					<AdminFilterButton
						title={'Добавить автора'}
						isActive={false}
						onClick={() => setAddModalOpen(true)}
					/>
				</div>

				<AdminDashboardAuthorsGridItem
					className='bg-white/5 font-medium max-xl:hidden'
					isLoading={false}
				/>

				{!isPending && count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Авторы не найдены!
					</span>
				)}

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isPending
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardAuthorsGridItem
										key={`Author-skeleton-${idx}`}
										isLoading={isPending}
									/>
							  ))
							: authors.map((author, idx) => (
									<AdminDashboardAuthorsGridItem
										key={author.id}
										author={author}
										isLoading={isPending}
										position={(currentPage - 1) * perPage + idx + 1}
									/>
							  ))}
					</div>
				</div>

				{!isPending && count > 0 && (
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

export default AdminDashboardAuthorsGrid
