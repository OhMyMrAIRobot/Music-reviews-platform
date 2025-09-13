import { useQuery } from '@tanstack/react-query'
import { FC, useEffect, useMemo, useState } from 'react'
import { AuthorAPI } from '../../api/author/author-api'
import AuthorsGrid from '../../components/author/authors-grid/Authors-grid'
import ComboBox from '../../components/buttons/Combo-box'
import SkeletonLoader from '../../components/utils/Skeleton-loader'
import { useAuthorMeta } from '../../hooks/use-author-meta'
import { AuthorTypesFilterEnum } from '../../models/author/author-type/author-types-filter-enum'

interface IProps {
	onlyRegistered: boolean
}

const PER_PAGE = 10

const AuthorsPage: FC<IProps> = ({ onlyRegistered }) => {
	const [selectedAuthorType, setSelectedAuthorType] = useState<string>(
		AuthorTypesFilterEnum.ALL
	)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const { types: authorTypes, isLoading: isTypesLoading } = useAuthorMeta()

	const selectedTypeId = useMemo(() => {
		const type = authorTypes.find(t => t.type === selectedAuthorType)
		return type ? type.id : null
	}, [authorTypes, selectedAuthorType])

	const limit = PER_PAGE
	const offset = (currentPage - 1) * PER_PAGE

	const { data, isPending: isAuthorsLoading } = useQuery({
		queryKey: [
			'authors',
			{ typeId: selectedTypeId, limit, offset, onlyRegistered },
		],
		queryFn: () =>
			AuthorAPI.fetchAuthors(
				selectedTypeId,
				null,
				limit,
				offset,
				onlyRegistered,
				null
			),
		staleTime: 1000 * 60 * 5,
	})

	const authors = data?.authors ?? []
	const total = data?.count ?? 0

	useEffect(() => {
		setSelectedAuthorType(AuthorTypesFilterEnum.ALL)
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
							options={Object.values(AuthorTypesFilterEnum)}
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
				perPage={PER_PAGE}
			/>
		</>
	)
}

export default AuthorsPage
