import { useQuery } from '@tanstack/react-query'
import { FC, useEffect, useMemo, useState } from 'react'
import { AuthorAPI } from '../../api/author/author-api'
import AuthorsGrid from '../../components/author/authors-grid/Authors-grid'
import ComboBox from '../../components/buttons/Combo-box'
import SkeletonLoader from '../../components/utils/Skeleton-loader'
import { useAuthorMeta } from '../../hooks/meta'
import { authorsKeys } from '../../query-keys/authors-keys'
import { AuthorsQuery, AuthorTypesFilterOptions } from '../../types/author'

interface IProps {
	onlyRegistered: boolean
}

const limit = 10

const AuthorsPage: FC<IProps> = ({ onlyRegistered }) => {
	const [selectedAuthorType, setSelectedAuthorType] = useState<string>(
		AuthorTypesFilterOptions.ALL,
	)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const { types: authorTypes, isLoading: isTypesLoading } = useAuthorMeta()

	const selectedTypeId = useMemo(() => {
		return authorTypes.find(t => t.type === selectedAuthorType)?.id
	}, [authorTypes, selectedAuthorType])

	const query: AuthorsQuery = {
		typeId: selectedTypeId,
		limit,
		offset: (currentPage - 1) * limit,
		onlyRegistered,
	}

	const { data, isPending: isAuthorsLoading } = useQuery({
		queryKey: authorsKeys.list(query),
		queryFn: () => AuthorAPI.findAll(query),
		staleTime: 1000 * 60 * 5,
	})

	const authors = data?.items ?? []
	const total = data?.meta.count ?? 0

	useEffect(() => {
		setSelectedAuthorType(AuthorTypesFilterOptions.ALL)
		setCurrentPage(1)
	}, [onlyRegistered])

	useEffect(() => {
		setCurrentPage(1)
	}, [selectedAuthorType])

	return (
		<>
			<h1 id='authors' className='text-2xl lg:text-3xl font-semibold'>
				{onlyRegistered ? 'Зарегистрированные авторы' : 'Авторы'}
			</h1>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5'>
				<div className='w-full sm:w-55 h-10'>
					{!isTypesLoading && authorTypes.length > 0 ? (
						<ComboBox
							options={Object.values(AuthorTypesFilterOptions)}
							onChange={setSelectedAuthorType}
							className='border border-white/10'
							placeholder='Выберите тип автора'
							value={selectedAuthorType}
						/>
					) : (
						<SkeletonLoader className='size-full rounded-md' />
					)}
				</div>
			</div>

			<AuthorsGrid
				items={authors}
				isLoading={isAuthorsLoading || isTypesLoading}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				total={total}
				perPage={limit}
			/>
		</>
	)
}

export default AuthorsPage
