import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { ReviewAPI } from '../../../../api/review/review-api.ts'
import Pagination from '../../../../components/pagination/Pagination.tsx'
import { ReleaseReviewSortField } from '../../../../models/review/release-review/release-review-sort-fields.ts'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum.ts'
import { releaseDetailsKeys } from '../../../../query-keys/release-details-keys.ts'
import { ReviewsSortFieldsEnum } from '../../../../types/review/index.ts'
import { SortOrder } from '../../../../types/sort-order-type.ts'
import ReleaseDetailsReviewsHeader from './Release-details-reviews-header.tsx'
import ReleaseDetailsReviewsItem from './Release-details-reviews-item.tsx'

interface IProps {
	releaseId: string
}

const PER_PAGE = 5

const ReleaseDetailsReviews: FC<IProps> = ({ releaseId }) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseReviewSortField.NEW
	)

	let field: ReviewsSortFieldsEnum = ReviewsSortFieldsEnum.CREATED
	let order: SortOrder = SortOrdersEnum.DESC

	if (selectedSort === ReleaseReviewSortField.OLD) {
		order = SortOrdersEnum.ASC
	} else if (selectedSort === ReleaseReviewSortField.POPULAR) {
		field = ReviewsSortFieldsEnum.LIKES
	}

	const queryKey = releaseDetailsKeys.reviews({
		releaseId,
		field,
		order,
		limit: PER_PAGE,
		offset: (currentPage - 1) * PER_PAGE,
	})

	const queryFn = () =>
		ReviewAPI.findAll({
			releaseId,
			sortField: field,
			sortOrder: order,
			limit: PER_PAGE,
			offset: (currentPage - 1) * PER_PAGE,
		})

	const { data: reviewsData, isPending: isLoading } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const reviews = reviewsData?.items ?? []
	const totalItems = reviewsData?.meta.count ?? 0

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
										key={review.user.id}
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
						itemsPerPage={PER_PAGE}
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
