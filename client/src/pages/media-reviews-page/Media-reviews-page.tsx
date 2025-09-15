import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ReleaseMediaAPI } from '../../api/release/release-media-api'
import ComboBox from '../../components/buttons/Combo-box'
import Pagination from '../../components/pagination/Pagination'
import ReleaseMediaReview from '../../components/release/release-media/Release-media-review'
import { useQueryListFavToggleAll } from '../../hooks/use-query-list-fav-toggle'
import { useReleaseMediaMeta } from '../../hooks/use-release-media-meta'
import type { IReleaseMedia } from '../../models/release/release-media/release-media'
import { ReleaseMediaStatusesEnum } from '../../models/release/release-media/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../models/release/release-media/release-media-type/release-media-types-enum'
import { ReviewSortFields } from '../../models/review/review-sort-fields'
import { SortOrdersEnum } from '../../models/sort/sort-orders-enum'
import { releaseMediaKeys } from '../../query-keys/release-media-keys'
import type { SortOrder } from '../../types/sort-order-type'
import { toggleFavMedia } from '../../utils/toggle-fav-media'

const PER_PAGE = 12

const MediaReviewsPage = () => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedOrder, setSelectedOrder] = useState<string>(
		ReviewSortFields.NEW
	)

	const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta()

	const typeId = useMemo(
		() =>
			types.find(t => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW)?.id ??
			null,
		[types]
	)

	const statusId = useMemo(
		() =>
			statuses.find(s => s.status === ReleaseMediaStatusesEnum.APPROVED)?.id ??
			null,
		[statuses]
	)

	const order: SortOrder = useMemo(
		() =>
			selectedOrder === ReviewSortFields.NEW
				? SortOrdersEnum.DESC
				: SortOrdersEnum.ASC,
		[selectedOrder]
	)

	const limit = PER_PAGE
	const offset = (currentPage - 1) * PER_PAGE

	const queryKey = releaseMediaKeys.list({
		limit,
		offset,
		statusId,
		typeId,
		order,
		authorId: null,
		releaseId: null,
	})

	const { data, isPending: isMediaLoading } = useQuery({
		queryKey,
		queryFn: () =>
			ReleaseMediaAPI.fetchReleaseMedia(
				limit,
				offset,
				statusId!,
				typeId!,
				null,
				null,
				null,
				order
			),
		enabled: Boolean(typeId && statusId),
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.releaseMedia ?? []
	const total = data?.count ?? 0

	const { storeToggle } = useQueryListFavToggleAll<
		IReleaseMedia,
		{ releaseMedia: IReleaseMedia[] }
	>(releaseMediaKeys.all, 'releaseMedia', toggleFavMedia)

	return (
		<>
			<h1 id='media-reviews' className='text-2xl lg:text-3xl font-semibold'>
				Медиарецензии
			</h1>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 flex gap-4 items-center'>
				<span className='hidden sm:block text-white/70 font-bold '>
					Сортировать по:
				</span>
				<div className='w-full sm:w-55'>
					<ComboBox
						options={Object.values(ReviewSortFields)}
						onChange={val => {
							setSelectedOrder(val)
							setCurrentPage(1)
						}}
						className='border border-white/10'
						value={selectedOrder}
					/>
				</div>
			</div>

			<section className='mt-5 overflow-hidden'>
				<div className='gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3'>
					{isMediaLoading || isMetaLoading
						? Array.from({ length: PER_PAGE }).map((_, idx) => (
								<ReleaseMediaReview
									key={`skeleton-release-media-${idx}`}
									isLoading={true}
								/>
						  ))
						: items.map(media => (
								<ReleaseMediaReview
									key={media.id}
									media={media}
									isLoading={false}
									toggleFav={storeToggle}
								/>
						  ))}

					{items.length === 0 && !isMediaLoading && !isMetaLoading && (
						<p className='text-center text-2xl font-semibold mt-10 w-full absolute'>
							Медиарецензии не найдены!
						</p>
					)}
				</div>
			</section>

			{items.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={total}
						itemsPerPage={PER_PAGE}
						setCurrentPage={setCurrentPage}
						idToScroll={'media-reviews'}
					/>
				</div>
			)}
		</>
	)
}

export default MediaReviewsPage
