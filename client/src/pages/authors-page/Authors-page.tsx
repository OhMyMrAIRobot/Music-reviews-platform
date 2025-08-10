import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import AuthorsGrid from '../../components/author/authors-grid/Authors-grid'
import ComboBox from '../../components/buttons/Combo-box'
import SkeletonLoader from '../../components/utils/Skeleton-loader'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { AuthorTypesFilterEnum } from '../../models/author/author-types-filter-enum'

interface IProps {
	onlyRegistered: boolean
}

const AuthorsPage: FC<IProps> = observer(({ onlyRegistered }) => {
	const perPage = 10

	const { authorsPageStore, metaStore } = useStore()

	const [selectedAuthorType, setSelectedAuthorType] = useState<string>(
		AuthorTypesFilterEnum.ALL
	)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const { execute: fetchAuthors, isLoading: isAuthorsLoading } = useLoading(
		authorsPageStore.fetchAuthors
	)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchAuthorTypes
	)

	useEffect(() => {
		const type = metaStore.authorTypes.find(
			entry => entry.type === selectedAuthorType
		)
		fetchAuthors(
			type ? type.id : null,
			perPage,
			(currentPage - 1) * perPage,
			onlyRegistered
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAuthorType, currentPage, fetchAuthors, onlyRegistered])

	useEffect(() => {
		if (metaStore.authorTypes.length === 0) {
			fetchTypes()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<h1 id='authors' className='text-lg md:text-xl lg:text-3xl font-semibold'>
				{onlyRegistered ? 'Зарегистрированные авторы' : 'Авторы'}
			</h1>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5'>
				<div className='w-full sm:w-55 h-10'>
					{!isTypesLoading && metaStore.authorTypes.length > 0 ? (
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
				items={authorsPageStore.authors}
				isLoading={isAuthorsLoading || isTypesLoading}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				total={authorsPageStore.authorsCount}
				perPage={perPage}
			/>
		</>
	)
})

export default AuthorsPage
