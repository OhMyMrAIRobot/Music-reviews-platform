import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Loader from '../../components/utils/Loader.tsx'
import { useLoading } from '../../hooks/use-loading.ts'
import { useStore } from '../../hooks/use-store.ts'
import { ReleaseReviewSortField } from '../../models/review/release-review-sort-fields.ts'
import ReleaseDetailsHeader from './ui/Release-details-header.tsx'
import ReleaseDetailsReviews from './ui/release-details-reviews/Release-details-reviews.tsx'
import SendReviewForm from './ui/send-review-form/Send-review-form.tsx'

const ReleaseDetailsPage = observer(() => {
	const perPage = 5

	const { id } = useParams()

	const { releaseDetailsPageStore } = useStore()

	const { execute: _fetchReviews, isLoading: isReviewLoading } = useLoading(
		releaseDetailsPageStore.fetchReleaseReviews
	)

	const [totalItems, setTotalItems] = useState(0)
	const [isReleaseLoading, setIsReleaseLoading] = useState<boolean>(false)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseReviewSortField.NEW
	)

	const release = releaseDetailsPageStore.releaseDetails
	const reviews = releaseDetailsPageStore.releaseReviews

	useEffect(() => {
		if (id) {
			setIsReleaseLoading(true)
			releaseDetailsPageStore
				.fetchReleaseDetails(id)
				.finally(() => setIsReleaseLoading(false))
		}
	}, [id, releaseDetailsPageStore])

	const fetchReviews = async (): Promise<void> => {
		let field = 'created'
		let order: 'asc' | 'desc' = 'desc'

		if (selectedSort === ReleaseReviewSortField.OLD) {
			order = 'asc'
		} else if (selectedSort === ReleaseReviewSortField.POPULAR) {
			field = 'likes'
		}
		_fetchReviews(id, field, order, perPage, (currentPage - 1) * perPage).then(
			() => setTotalItems(releaseDetailsPageStore.reviewsCount)
		)
	}

	useEffect(() => {
		fetchReviews()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, selectedSort])

	return isReleaseLoading ? (
		<div className='w-full'>
			<Loader className={'size-20'} />
		</div>
	) : release ? (
		<>
			<ReleaseDetailsHeader release={release} />

			<SendReviewForm fetchReviews={fetchReviews} id={id ?? '0'} />

			<ReleaseDetailsReviews
				reviews={reviews}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalItems={totalItems}
				isLoading={isReviewLoading}
				perPage={perPage}
			/>
		</>
	) : (
		<div className='text-center text-2xl font-bold mt-30'>Релиз не найден!</div>
	)
})

export default ReleaseDetailsPage
