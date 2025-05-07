import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import AuthorPageHeader from '../components/authorPage/AuthorPageHeader'
import AuthorPageReviewsCarousel from '../components/authorPage/AuthorPageReviewsCarousel'
import AuthorPageStats from '../components/authorPage/AuthorPageStats'
import AuthorsPageReleasesCarousel from '../components/authorPage/AuthorsPageReleasesCarousel'
import Loader from '../components/Loader'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

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
	}, [])

	return isAuthorLoading ? (
		<Loader />
	) : (
		authorPageStore.author && (
			<div className='flex flex-col gap-10'>
				<AuthorPageHeader author={authorPageStore.author} />
				<AuthorPageStats author={authorPageStore.author} />
				<AuthorsPageReleasesCarousel />
				<AuthorPageReviewsCarousel />
			</div>
		)
	)
})

export default AuthorPage
