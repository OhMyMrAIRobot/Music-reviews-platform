import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import AuthorsGrid from '../../components/author/authors-grid/Authors-grid'
import ReleasesGrid from '../../components/release/Releases-grid'
import { useLoading } from '../../hooks/use-loading'
import useNavigationPath from '../../hooks/use-navigation-path'
import { useStore } from '../../hooks/use-store'
import { SearchTypesEnum } from '../../models/search/search-types-enum'

const perPage = 10

const SearchPage = observer(() => {
	const { type } = useParams()

	const { searchPageStore } = useStore()

	const navigate = useNavigate()

	const { navigateToMain } = useNavigationPath()

	const [isLoading, setIsloading] = useState<boolean>(true)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [searchParams] = useSearchParams()
	const query = searchParams.get('query') || ''

	const { execute: fetchAuthors, isLoading: isAuthorsLoading } = useLoading(
		searchPageStore.fetchAuthors
	)

	const { execute: fetchReleases, isLoading: isReleasesLoading } = useLoading(
		searchPageStore.fetchReleases
	)

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
	}, [currentPage, fetchAuthors, fetchReleases, query, type])

	useEffect(() => {
		if (
			!type ||
			!Object.values(SearchTypesEnum).includes(type as SearchTypesEnum)
		) {
			navigate(navigateToMain)
		}
		setIsloading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		!isLoading && (
			<>
				{type === SearchTypesEnum.AUTHORS && (
					<AuthorsGrid
						items={searchPageStore.authors}
						isLoading={isAuthorsLoading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						total={searchPageStore.authorsCount}
						perPage={perPage}
					/>
				)}
				{type === SearchTypesEnum.RELEASES && (
					<ReleasesGrid
						items={searchPageStore.releases}
						isLoading={isReleasesLoading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						total={searchPageStore.releasesCount}
						perPage={perPage}
					/>
				)}
			</>
		)
	)
})

export default SearchPage
