import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import AuthorsPageGrid from '../components/authorsPage/AuthorsPageGrid'
import Loader from '../components/Loader'
import useCustomNavigate from '../hooks/UseCustomNavigate'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'
import { SearchTypesEnum } from '../models/search/SearchTypesEnum'

const SearchPage = observer(() => {
	const [isLoading, setIsloading] = useState<boolean>(true)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [searchParams] = useSearchParams()
	const query = searchParams.get('query') || ''

	const { type } = useParams()
	const { navigateToMain } = useCustomNavigate()
	const { searchStore } = useStore()
	const { execute: fetchAuthors, isLoading: isAuthorsLoading } = useLoading(
		searchStore.fetchAuthors
	)

	useEffect(() => {
		if (query.length > 0) {
			fetchAuthors(query, 5, (currentPage - 1) * 5)
		}
	}, [currentPage, query, type])

	useEffect(() => {
		if (
			!type ||
			!Object.values(SearchTypesEnum).includes(type as SearchTypesEnum)
		) {
			navigateToMain()
		}
		setIsloading(false)
	}, [])

	return isLoading ? (
		<Loader />
	) : (
		<>
			{type === SearchTypesEnum.AUTHORS && (
				<AuthorsPageGrid
					items={searchStore.authors}
					isLoading={isAuthorsLoading}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					total={searchStore.authorsCount}
				/>
			)}
		</>
	)
})

export default SearchPage
