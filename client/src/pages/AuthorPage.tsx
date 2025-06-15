import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import AuthorPageReleases from '../components/authorPage/AuthorPageAllReleases/AuthorPageReleases'
import AuthorPageHeader from '../components/authorPage/AuthorPageHeader'
import AuthorPageReviewsCarousel from '../components/authorPage/AuthorPageReviewsCarousel'
import AuthorPageStats from '../components/authorPage/AuthorPageStats'
import AuthorsPageReleasesCarousel from '../components/authorPage/AuthorsPageReleasesCarousel'
import Loader from '../components/loader/loader'
import { useLoading } from '../hooks/use-loading'
import { useStore } from '../hooks/use-store'

const AuthorPage = observer(() => {
	const { id } = useParams()
	const { authorPageStore } = useStore()
	const { execute: fetchAuthor, isLoading: isAuthorLoading } = useLoading(
		authorPageStore.fetchAuthorById
	)

	useEffect(() => {
		if (id) {
			fetchAuthor(id)
		}
	}, [id])

	return isAuthorLoading ? (
		<Loader />
	) : (
		authorPageStore.author && (
			<div className='flex flex-col gap-10'>
				<AuthorPageHeader author={authorPageStore.author} />
				<AuthorPageStats author={authorPageStore.author} />
				<AuthorsPageReleasesCarousel />
				<AuthorPageReviewsCarousel />
				<AuthorPageReleases />
			</div>
		)
	)
})

export default AuthorPage
