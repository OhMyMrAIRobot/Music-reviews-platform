import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { AuthorAPI } from '../../api/author/author-api'
import { ReleaseAPI } from '../../api/release/release-api'
import AuthorsGrid from '../../components/author/authors-grid/Authors-grid'
import ReleasesGrid from '../../components/release/Releases-grid'
import useNavigationPath from '../../hooks/use-navigation-path'
import { SearchTypesEnum } from '../../models/search/search-types-enum'
import { authorsKeys } from '../../query-keys/authors-keys'
import { releasesKeys } from '../../query-keys/releases-keys'

const perPage = 10

const SearchPage = () => {
	const { type } = useParams()

	const navigate = useNavigate()

	const { navigateToMain } = useNavigationPath()

	const [isLoading, setIsloading] = useState<boolean>(true)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [searchParams] = useSearchParams()
	const query = searchParams.get('query') || ''

	const authorsQuery = useQuery({
		queryKey: authorsKeys.search({
			query: query || null,
			limit: perPage,
			offset: (currentPage - 1) * perPage,
		}),
		queryFn: () =>
			AuthorAPI.fetchAuthors(
				null,
				query || null,
				perPage,
				(currentPage - 1) * perPage,
				false,
				null
			),
		enabled: query.length > 0 && type === SearchTypesEnum.AUTHORS,
		staleTime: 1000 * 60 * 5,
	})

	const releasesQuery = useQuery({
		queryKey: releasesKeys.search({
			query: query || null,
			limit: perPage,
			offset: (currentPage - 1) * perPage,
		}),
		queryFn: () =>
			ReleaseAPI.fetchReleases(
				null,
				query || null,
				null,
				null,
				perPage,
				(currentPage - 1) * perPage
			),
		enabled: query.length > 0 && type === SearchTypesEnum.RELEASES,
		staleTime: 1000 * 60 * 5,
	})

	useEffect(() => {
		if (
			!type ||
			!Object.values(SearchTypesEnum).includes(type as SearchTypesEnum)
		) {
			navigate(navigateToMain)
		}
		setIsloading(false)
	}, [navigate, navigateToMain, type])

	return (
		!isLoading && (
			<>
				{type === SearchTypesEnum.AUTHORS && (
					<AuthorsGrid
						items={authorsQuery.data?.authors ?? []}
						isLoading={authorsQuery.isPending}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						total={authorsQuery.data?.count ?? 0}
						perPage={perPage}
					/>
				)}
				{type === SearchTypesEnum.RELEASES && (
					<ReleasesGrid
						items={releasesQuery.data?.releases ?? []}
						isLoading={releasesQuery.isPending}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						total={releasesQuery.data?.count ?? 0}
						perPage={perPage}
					/>
				)}
			</>
		)
	)
}

export default SearchPage
