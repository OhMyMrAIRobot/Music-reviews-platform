import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Loader from '../components/loader/loader'
import ReleaseContainer from '../components/releasePage/container/ReleaseContainer'
import ReleaseReviewsContainer, {
	ReleaseReviewsSortEnum,
} from '../components/releasePage/container/ReleaseReviewsContainer'
import SendReviewForm from '../components/releasePage/sendReviewForm/SendReviewForm'
import { useLoading } from '../hooks/use-loading'
import { useStore } from '../hooks/use-store'

const ReleasePage = observer(() => {
	const { id } = useParams()

	const { releasePageStore } = useStore()

	const { execute: _fetchReviews, isLoading: isReviewLoading } = useLoading(
		releasePageStore.fetchReleaseReviews
	)

	const [totalItems, setTotalItems] = useState(0)
	const [isReleaseLoading, setIsReleaseLoading] = useState<boolean>(false)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseReviewsSortEnum.NEW
	)

	const release = releasePageStore.releaseDetails
	const reviews = releasePageStore.releaseReviews

	useEffect(() => {
		if (id) {
			setIsReleaseLoading(true)
			releasePageStore
				.fetchReleaseDetails(id)
				.finally(() => setIsReleaseLoading(false))
		}
	}, [])

	useEffect(() => {
		fetchReviews()
	}, [currentPage, selectedSort])

	const fetchReviews = async (): Promise<void> => {
		let field = 'created'
		let order: 'asc' | 'desc' = 'desc'

		if (selectedSort === ReleaseReviewsSortEnum.OLD) {
			order = 'asc'
		} else if (selectedSort === ReleaseReviewsSortEnum.POPULAR) {
			field = 'likes'
		}
		_fetchReviews(id, field, order, 5, (currentPage - 1) * 5).then(() =>
			setTotalItems(releasePageStore.reviewsCount)
		)
	}

	return isReleaseLoading ? (
		<div className='w-full'>
			<Loader />
		</div>
	) : release ? (
		<>
			<ReleaseContainer release={release} />
			<SendReviewForm fetchReviews={fetchReviews} id={id ?? '0'} />
			<ReleaseReviewsContainer
				reviews={reviews}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalItems={totalItems}
				isLoading={isReviewLoading}
			/>
		</>
	) : (
		<div className='text-center text-2xl font-bold mt-30'>Релиз не найден!</div>
	)
})

export default ReleasePage
