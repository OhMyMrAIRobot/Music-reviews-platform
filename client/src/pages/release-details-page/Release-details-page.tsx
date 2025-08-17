import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/utils/Loader.tsx'
import { useLoading } from '../../hooks/use-loading.ts'
import useNavigationPath from '../../hooks/use-navigation-path'
import { useStore } from '../../hooks/use-store.ts'
import { ReleaseReviewSortFieldsEnum } from '../../models/review/release-review/release-review-sort-fields-enum.ts'
import { ReleaseReviewSortField } from '../../models/review/release-review/release-review-sort-fields.ts'
import { SortOrdersEnum } from '../../models/sort/sort-orders-enum.ts'
import authStore from '../../stores/auth-store.ts'
import { SortOrder } from '../../types/sort-order-type.ts'
import ReleaseDetailsAuthorComments from './ui/release-details-author-comments/Release-details-author-comments.tsx'
import ReleaseDetailsHeader from './ui/Release-details-header.tsx'
import ReleaseDetailsMedia from './ui/release-details-media/Release-details-media.tsx'
import ReleaseDetailsReviews from './ui/release-details-reviews/Release-details-reviews.tsx'
import SendAuthorCommentForm from './ui/send-author-comment-form/Send-author-comment-form.tsx'
import SendReviewForm from './ui/send-review-form/Send-review-form.tsx'

const ReleaseDetailsPage = observer(() => {
	const { releaseDetailsPageStore } = useStore()

	const perPage = 5
	const release = releaseDetailsPageStore.releaseDetails
	const reviews = releaseDetailsPageStore.releaseReviews

	const { id } = useParams()

	const navigate = useNavigate()

	const { navigateToMain } = useNavigationPath()

	const { execute: _fetchReviews, isLoading: isReviewLoading } = useLoading(
		releaseDetailsPageStore.fetchReleaseReviews
	)

	const { execute: fetchReleaseDetails, isLoading: isReleaseLoading } =
		useLoading(releaseDetailsPageStore.fetchReleaseDetails)

	const [totalItems, setTotalItems] = useState(0)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseReviewSortField.NEW
	)

	const fetchReviews = async (): Promise<void> => {
		let field: ReleaseReviewSortFieldsEnum = ReleaseReviewSortFieldsEnum.CREATED
		let order: SortOrder = SortOrdersEnum.DESC

		if (selectedSort === ReleaseReviewSortField.OLD) {
			order = SortOrdersEnum.ASC
		} else if (selectedSort === ReleaseReviewSortField.POPULAR) {
			field = ReleaseReviewSortFieldsEnum.LIKES
		}
		_fetchReviews(id, field, order, perPage, (currentPage - 1) * perPage).then(
			() => setTotalItems(releaseDetailsPageStore.reviewsCount)
		)
	}

	useEffect(() => {
		if (id) {
			fetchReleaseDetails(id).then(() => {
				if (!releaseDetailsPageStore.releaseDetails) {
					navigate(navigateToMain)
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	useEffect(() => {
		fetchReviews()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, selectedSort])

	const registeredAuthorIds = authStore.user
		? authStore.user.registeredAuthor.map(ra => ra.authorId)
		: []

	const isUserAuthor =
		release?.artists.some(ra => registeredAuthorIds.includes(ra.id)) ||
		release?.producers.some(rp => registeredAuthorIds.includes(rp.id)) ||
		release?.designers.some(rd => registeredAuthorIds.includes(rd.id))

	return isReleaseLoading ? (
		<div className='w-full'>
			<Loader className={'mx-auto size-20 border-white'} />
		</div>
	) : (
		release && (
			<>
				<ReleaseDetailsHeader release={release} />

				<ReleaseDetailsMedia releaseId={release.id} />

				<ReleaseDetailsAuthorComments releaseId={release.id} />

				{isUserAuthor ? (
					<SendAuthorCommentForm releaseId={release.id} />
				) : (
					<SendReviewForm fetchReviews={fetchReviews} releaseId={release.id} />
				)}

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
		)
	)
})

export default ReleaseDetailsPage
