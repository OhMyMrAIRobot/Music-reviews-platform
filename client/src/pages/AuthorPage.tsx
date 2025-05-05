import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import AuthorPageHeader from '../components/AuthorPage/AuthorPageHeader'
import AuthorPageStats from '../components/AuthorPage/AuthorPageStats'
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
			fetchAuthor(id).then(() => console.log(authorPageStore.author))
		}
	}, [])

	return isAuthorLoading ? (
		<Loader />
	) : (
		authorPageStore.author && (
			<div className='grid gap-10'>
				<AuthorPageHeader author={authorPageStore.author} />
				<AuthorPageStats author={authorPageStore.author} />
			</div>
		)
	)
})

export default AuthorPage
