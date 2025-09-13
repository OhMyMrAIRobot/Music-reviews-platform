import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useReleaseMediaMeta } from '../../../../hooks/use-release-media-meta'
import { IReleaseMedia } from '../../../../models/release/release-media/release-media'
import { ReleaseMediaStatusesEnum } from '../../../../models/release/release-media/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../../../models/release/release-media/release-media-type/release-media-types-enum'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { CarouselRef } from '../../../../types/carousel-ref'
import { toggleFavMedia as toggleFavMediaUtil } from '../../../../utils/toggle-fav-media'
import ReleaseMediaReviewsCarousel from './carousel/Release-media-reviews-carousel'

const LIMIT = 15
const OFFSET = 0
const ORDER = SortOrdersEnum.DESC

const ReleaseMediaReviews = () => {
	const { navigateToMediaReviews } = useNavigationPath()
	const queryClient = useQueryClient()

	const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta()

	const typeId = types.find(
		t => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW
	)?.id
	const statusId = statuses.find(
		s => s.status === ReleaseMediaStatusesEnum.APPROVED
	)?.id

	const queryKey = useMemo(
		() =>
			[
				'releaseMedia',
				{ limit: LIMIT, offset: OFFSET, statusId, typeId, order: ORDER },
			] as const,
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

	const storeToggle = async (
		mediaId: string,
		isFav: boolean
	): Promise<string[]> => {
		const current = queryClient.getQueryData<{ releaseMedia: IReleaseMedia[] }>(
			queryKey
		)
		const currentList = current?.releaseMedia ?? []
		const cloned = currentList.map(m => ({ ...m }))
		const updatedFavIds = await toggleFavMediaUtil(cloned, mediaId, isFav)
		queryClient.setQueryData<{ releaseMedia: IReleaseMedia[] }>(queryKey, {
			releaseMedia: cloned,
		})
		return updatedFavIds
	}

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
