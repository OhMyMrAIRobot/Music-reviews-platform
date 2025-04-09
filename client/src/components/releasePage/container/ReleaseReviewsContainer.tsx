import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import Pagination from '../../pagination/Pagination'
import ReleaseReviewItem from '../review/ReleaseReviewItem'
import ReleaseReviewsHeader from './ReleaseReviewsHeader'

export const ReleaseReviewsSortEnum = Object.freeze({
	NEW: 'Новые',
	OLD: 'Старые',
	POPULAR: 'Популярные',
})

const ReleaseReviewsContainer = observer(() => {
	const { id } = useParams()
	const { releasePageStore } = useStore()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseReviewsSortEnum.NEW
	)

	const { execute: fetch } = useLoading(releasePageStore.fetchReleaseReviews)
	const [totalItems, setTotalItems] = useState(0)

	useEffect(() => {
		let field = 'created'
		let order: 'asc' | 'desc' = 'desc'

		if (selectedSort === 'Старые') {
			order = 'asc'
		} else if (selectedSort === 'Популярные') {
			field = 'likes'
		}
		fetch(id, field, order, 1, (currentPage - 1) * 1).then(() =>
			setTotalItems(releasePageStore.reviewsCount)
		)
	}, [currentPage, selectedSort])

	const reviews = releasePageStore.releaseReviews

	return (
		<section
			id='release-reviews'
			className='w-full grid grid-cols-1 mt-5 lg:mt-10'
		>
			{reviews && reviews.length !== 0 ? (
				<>
					<ReleaseReviewsHeader
						count={releasePageStore.reviewsCount}
						selectedSort={selectedSort}
						setSelectedSort={setSelectedSort}
					/>
					<div className='grid grid-cols-1 max-w-200 w-full mx-auto gap-5 mt-5'>
						{reviews.map(review => (
							<ReleaseReviewItem key={review.id} review={review} />
						))}
					</div>
					<div className='mt-10'>
						<Pagination
							currentPage={currentPage}
							totalItems={totalItems}
							itemsPerPage={1}
							onPageChange={setCurrentPage}
							idToScroll='release-reviews'
						/>
					</div>
				</>
			) : (
				<div className='text-center border font-medium border-zinc-950 bg-gradient-to-br from-white/10 rounded-xl text-xs lg:sm w-full lg:max-w-[800px] sm:max-w-[600px] py-2 mx-auto'>
					<span>Нет рецензий!</span>
				</div>
			)}
		</section>
	)
})

export default ReleaseReviewsContainer
