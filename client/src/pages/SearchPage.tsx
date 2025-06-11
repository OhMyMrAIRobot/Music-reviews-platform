import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import AuthorsPageGrid from '../components/authorsPage/AuthorsPageGrid'
import Loader from '../components/Loader'
import ReleasesPageGrid from '../components/ReleasesPageGrid'
import useCustomNavigate from '../hooks/UseCustomNavigate'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'
import { SearchTypesEnum } from '../model/search/search-types-enum'

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
	const { execute: fetchReleases, isLoading: isReleasesLoading } = useLoading(
		searchStore.fetchReleases
	)

	const perPage = 10

	useEffect(() => {
		if (query.length > 0) {
			switch (type) {
				case SearchTypesEnum.AUTHORS:
					fetchAuthors(query, perPage, (currentPage - 1) * perPage)
					break
				case SearchTypesEnum.RELEASES:
					fetchReleases(query, perPage, (currentPage - 1) * perPage)
					break
				default:
					break
			}
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
					perPage={perPage}
				/>
			)}
			{type === SearchTypesEnum.RELEASES && (
				<ReleasesPageGrid
					items={searchStore.releases}
					isLoading={isReleasesLoading}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					total={searchStore.releasesCount}
					perPage={perPage}
				/>
			)}
		</>
	)
})

export default SearchPage
