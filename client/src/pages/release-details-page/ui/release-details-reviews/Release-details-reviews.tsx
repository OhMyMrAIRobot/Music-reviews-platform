import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { ReviewAPI } from '../../../../api/review/review-api.ts'
import Pagination from '../../../../components/pagination/Pagination.tsx'
import { ReleaseReviewSortFieldsEnum } from '../../../../models/review/release-review/release-review-sort-fields-enum.ts'
import { ReleaseReviewSortField } from '../../../../models/review/release-review/release-review-sort-fields.ts'
import { IReleaseReviewsResponse } from '../../../../models/review/release-review/release-reviews-response.ts'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum.ts'
import { releaseDetailsKeys } from '../../../../query-keys/release-details-keys.ts'
import { SortOrder } from '../../../../types/sort-order-type.ts'
import ReleaseDetailsReviewsHeader from './Release-details-reviews-header.tsx'
import ReleaseDetailsReviewsItem from './Release-details-reviews-item.tsx'

interface IProps {
	releaseId: string
}

const perPage = 5

const ReleaseDetailsReviews: FC<IProps> = ({ releaseId }) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseReviewSortField.NEW
	)

	let field: ReleaseReviewSortFieldsEnum = ReleaseReviewSortFieldsEnum.CREATED
	let order: SortOrder = SortOrdersEnum.DESC

	if (selectedSort === ReleaseReviewSortField.OLD) {
		order = SortOrdersEnum.ASC
	} else if (selectedSort === ReleaseReviewSortField.POPULAR) {
		field = ReleaseReviewSortFieldsEnum.LIKES
	}

	const queryKey = releaseDetailsKeys.reviews({
		releaseId,
		field,
		order,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
	})

	const queryFn = () =>
		ReviewAPI.fetchReviewsByReleaseId(
			releaseId,
			field,
			order,
			perPage,
			(currentPage - 1) * perPage
		)

	const { data: reviewsData, isPending: isLoading } =
		useQuery<IReleaseReviewsResponse>({
			queryKey,
			queryFn,
			staleTime: 1000 * 60 * 5,
		})

	const reviews = reviewsData?.reviews ?? []
	const totalItems = reviewsData?.count ?? 0

	return (
		<section
			id='release-reviews'
			className='w-full grid grid-cols-1 mt-5 lg:mt-10'
		>
			{totalItems > 0 && (
				<ReleaseDetailsReviewsHeader
					count={totalItems}
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
				/>
			)}

			<div className='grid grid-cols-1 max-w-200 w-full mx-auto gap-5 mt-5'>
				{isLoading
					? Array.from({ length: 5 }).map((_, idx) => (
							<ReleaseDetailsReviewsItem
								key={`release-details-review-skeleton-${idx}`}
								isLoading={isLoading}
							/>
					  ))
					: reviews?.map(
							review =>
								review.text && (
									<ReleaseDetailsReviewsItem
										key={review.userId}
										review={review}
										isLoading={isLoading}
									/>
								)
					  )}
			</div>

			{totalItems > 0 ? (
				<div className='mt-10'>
					<Pagination
						currentPage={currentPage}
						totalItems={totalItems}
						itemsPerPage={perPage}
						setCurrentPage={setCurrentPage}
						idToScroll='release-reviews'
					/>
				</div>
			) : (
				<div className='text-center border font-medium border-zinc-950 bg-gradient-to-br from-white/10 rounded-xl text-xs lg:sm w-full lg:max-w-[800px] sm:max-w-[600px] py-2 mx-auto'>
					<span>Нет рецензий!</span>
				</div>
			)}
		</section>
	)
}

export default ReleaseDetailsReviews
