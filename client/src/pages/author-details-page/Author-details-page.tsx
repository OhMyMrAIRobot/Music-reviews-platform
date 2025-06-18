import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import AuthorDetailsHeader from './ui/Author-details-header'
import AuthorDetailsReleases from './ui/Author-details-releases'
import AuthorDetailsReleasesCarousel from './ui/Author-details-releases-carousel'
import AuthorDetailsReviewsCarousel from './ui/Author-details-reviews-carousel'
import AuthorDetailsStats from './ui/Author-details-stats'

const AuthorDetailsPage = observer(() => {
	const { id } = useParams()

	const { authorDetailsPageStore } = useStore()

	const { execute: fetchAuthor, isLoading } = useLoading(
		authorDetailsPageStore.fetchAuthorById
	)

	useEffect(() => {
		if (id) {
			window.scrollTo(0, 0)
			fetchAuthor(id)
		}
	}, [fetchAuthor, id])

	return (
		authorDetailsPageStore.author && (
			<div className='flex flex-col gap-10'>
				<AuthorDetailsHeader
					author={authorDetailsPageStore.author}
					isLoading={isLoading}
				/>
				<AuthorDetailsStats
					author={authorDetailsPageStore.author}
					isLoading={isLoading}
				/>
				<AuthorDetailsReleasesCarousel />
				<AuthorDetailsReviewsCarousel />
				<AuthorDetailsReleases />
			</div>
		)
	)
})

export default AuthorDetailsPage
