import { useCallback, useEffect, useState } from 'react'
import ComboBox from '../../components/buttons/Combo-box'
import Pagination from '../../components/pagination/Pagination'
import ReleaseMediaReview from '../../components/release-media/Release-media-review'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { ReleaseMediaStatusesEnum } from '../../models/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../models/release-media-type/release-media-types-enum'
import { ReviewSortFields } from '../../models/review/review-sort-fields'
import { SortOrderEnum } from '../../models/sort/sort-order-enum'
import { SortOrder } from '../../types/sort-order-type'

const MediaReviewsPage = () => {
	const perPage = 12

	const { metaStore, mediaReviewPageStore } = useStore()

	const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
		metaStore.fetchReleaseMediaStatuses
	)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseMediaTypes
	)

	const { execute: fetchMedia, isLoading: isMediaLoading } = useLoading(
		mediaReviewPageStore.fetchMedia
	)

	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedOrder, setSelectedOrder] = useState<string>(
		ReviewSortFields.NEW
	)

	const fetch = useCallback(() => {
		if (isStatusesLoading || isTypesLoading) return

		const typeId = metaStore.releaseMediaTypes.find(
			t => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW
		)?.id
		const statusId = metaStore.releaseMediaStatuses.find(
			s => s.status === ReleaseMediaStatusesEnum.APPROVED
		)?.id

		if (!typeId || !statusId) return

		const order: SortOrder =
			selectedOrder === ReviewSortFields.NEW
				? SortOrderEnum.DESC
				: SortOrderEnum.ASC

		return fetchMedia(
			statusId,
			typeId,
			perPage,
			(currentPage - 1) * perPage,
			order
		)
	}, [
		isStatusesLoading,
		isTypesLoading,
		metaStore.releaseMediaTypes,
		metaStore.releaseMediaStatuses,
		selectedOrder,
		fetchMedia,
		currentPage,
	])

	useEffect(() => {
		const promises = []
		if (metaStore.releaseMediaStatuses.length === 0) {
			promises.push(fetchStatuses())
		}
		if (metaStore.releaseMediaTypes.length === 0) {
			promises.push(fetchTypes())
		}
		Promise.all(promises).then(() => {
			fetch()
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, selectedOrder])

	return (
		<>
			<h1
				id='media-reviews'
				className='text-lg md:text-xl lg:text-3xl font-semibold'
			>
				Медиарецензии
			</h1>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 flex gap-4 items-center'>
				<span className='hidden sm:block text-white/70 font-bold '>
					Сортировать по:
				</span>
				<div className='w-full sm:w-55'>
					<ComboBox
						options={Object.values(ReviewSortFields)}
						onChange={setSelectedOrder}
						className='border border-white/10'
						value={selectedOrder}
					/>
				</div>
			</div>

			<section className='mt-5 overflow-hidden'>
				<div className='gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3'>
					{isMediaLoading || isTypesLoading || isStatusesLoading
						? Array.from({ length: perPage }).map((_, idx) => (
								<ReleaseMediaReview
									key={`skeleton-release-media-${idx}`}
									isLoading={true}
								/>
						  ))
						: mediaReviewPageStore.media.map(media => (
								<ReleaseMediaReview
									key={media.id}
									media={media}
									isLoading={false}
									toggleFav={mediaReviewPageStore.toggleFavMedia}
								/>
						  ))}

					{mediaReviewPageStore.media.length === 0 &&
						!isMediaLoading &&
						!isTypesLoading &&
						!isMediaLoading && (
							<p className='text-center text-2xl font-semibold mt-10 w-full absolute'>
								Медиарецензии не найдены!
							</p>
						)}
				</div>
			</section>

			{mediaReviewPageStore.media.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={mediaReviewPageStore.mediaCount}
						itemsPerPage={perPage}
						setCurrentPage={setCurrentPage}
						idToScroll={'media-reviews'}
					/>
				</div>
			)}
		</>
	)
}

export default MediaReviewsPage
