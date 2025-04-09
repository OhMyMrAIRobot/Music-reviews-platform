import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import ReleaseContainer from '../components/releasePage/container/ReleaseContainer'
import ReleaseReviewsContainer from '../components/releasePage/container/ReleaseReviewsContainer'
import SendReviewForm from '../components/releasePage/sendReviewForm/SendReviewForm'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

const ReleasePage = observer(() => {
	const { id } = useParams()
	const { releasesStore } = useStore()
	const { execute: fetch } = useLoading(releasesStore.fetchReleaseDetails)

	useEffect(() => {
		fetch(id)
	}, [])

	const release = releasesStore.releaseDetails

	return release ? (
		<>
			<ReleaseContainer release={release} />
			<SendReviewForm />
			<ReleaseReviewsContainer />
		</>
	) : (
		<div className='text-center text-2xl font-bold mt-30'>Релиз не найден!</div>
	)
})

export default ReleasePage
