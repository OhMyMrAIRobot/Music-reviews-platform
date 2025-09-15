import { useQuery } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useQueryListFavToggleAll } from '../../../../hooks/use-query-list-fav-toggle'
import { useReleaseMediaMeta } from '../../../../hooks/use-release-media-meta'
import { IReleaseMedia } from '../../../../models/release/release-media/release-media'
import { ReleaseMediaStatusesEnum } from '../../../../models/release/release-media/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../../../models/release/release-media/release-media-type/release-media-types-enum'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys'
import { CarouselRef } from '../../../../types/carousel-ref'
import { toggleFavMedia } from '../../../../utils/toggle-fav-media'
import ReleaseMediaReviewsCarousel from './carousel/Release-media-reviews-carousel'

const LIMIT = 15
const OFFSET = 0
const ORDER = SortOrdersEnum.DESC

const ReleaseMediaReviews = () => {
	const { navigateToMediaReviews } = useNavigationPath()
	const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta()

	const typeId =
		types.find(t => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW)?.id ?? null
	const statusId =
		statuses.find(s => s.status === ReleaseMediaStatusesEnum.APPROVED)?.id ??
		null

	const queryKey = useMemo(
		() =>
			releaseMediaKeys.list({
				limit: LIMIT,
				offset: OFFSET,
				statusId,
				typeId,
				order: ORDER,
				authorId: null,
				releaseId: null,
			}),
		[statusId, typeId]
	)

	const queryFn = () =>
		ReleaseMediaAPI.fetchReleaseMedia(
			LIMIT,
			OFFSET,
			statusId!,
			typeId!,
			null,
			null,
			null,
			ORDER
		)

	const { data: mediaData, isPending: isMediaLoading } = useQuery({
		queryKey,
		queryFn,
		enabled: Boolean(typeId && statusId),
		staleTime: 1000 * 60 * 5,
	})

	const items = mediaData?.releaseMedia ?? []

	const { storeToggle } = useQueryListFavToggleAll<
		IReleaseMedia,
		{ releaseMedia: IReleaseMedia[] }
	>(releaseMediaKeys.all, 'releaseMedia', toggleFavMedia)

	const carouselRef = useRef<CarouselRef>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={'Рецензии Медиа'}
			buttonTitle={'Все рецензии Медиа'}
			showButton={true}
			href={navigateToMediaReviews}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<ReleaseMediaReviewsCarousel
					ref={carouselRef}
					items={items}
					isLoading={isMediaLoading || isMetaLoading}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
					storeToggle={storeToggle}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default ReleaseMediaReviews
