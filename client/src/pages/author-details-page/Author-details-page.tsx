import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { AuthorAPI } from '../../api/author/author-api'
import useNavigationPath from '../../hooks/use-navigation-path'
import { authorsKeys } from '../../query-keys/authors-keys'
import AuthorDetailsHeader from './ui/Author-details-header'
import AuthorDetailsReleases from './ui/Author-details-releases'
import AuthorDetailsReleasesCarousel from './ui/Author-details-releases-carousel'
import AuthorDetailsReviewsCarousel from './ui/Author-details-reviews-carousel'
import AuthorDetailsStats from './ui/Author-details-stats'
import AuthorDetailsNominations from './ui/author-details-nominations/Author-details-nominations'

const AuthorDetailsPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { navigateToMain } = useNavigationPath()

	const queryKey = id ? authorsKeys.details(id) : ['authors', { id: 'unknown' }]
	const queryFn = id
		? () => AuthorAPI.fetchAuthorById(id)
		: () => Promise.resolve(null)
	const { data: author, isPending } = useQuery({
		queryKey,
		queryFn,
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
	})

	if (!id || (!author && !isPending)) {
		return navigate(navigateToMain)
	}

	return (
		author && (
			<div className='flex flex-col gap-5 lg:gap-10'>
				<AuthorDetailsHeader author={author} isLoading={isPending} />
				<AuthorDetailsStats author={author} isLoading={isPending} />
				<AuthorDetailsReleasesCarousel id={id} />
				<AuthorDetailsReviewsCarousel id={id} />
				<AuthorDetailsNominations id={id} />
				<AuthorDetailsReleases id={id} />
			</div>
		)
	)
}

export default AuthorDetailsPage
