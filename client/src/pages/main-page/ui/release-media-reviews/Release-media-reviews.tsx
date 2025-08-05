import { useCallback, useEffect, useRef, useState } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { ReleaseMediaStatusesEnum } from '../../../../models/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../../../models/release-media-type/release-media-types-enum'
import { CarouselRef } from '../../../../types/carousel-ref'
import ReleaseMediaReviewsCarousel from './carousel/Release-media-reviews-carousel'

const ReleaseMediaReviews = () => {
	const { metaStore, mainPageStore } = useStore()

	const { navigateToMediaReviews } = useNavigationPath()

	const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
		metaStore.fetchReleaseMediaStatuses
	)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseMediaTypes
	)

	const { execute: fetchMedia, isLoading: isMediaLoading } = useLoading(
		mainPageStore.fetchReleaseMedia
	)

	const fetchReleaseMedia = useCallback(() => {
		if (isStatusesLoading || isTypesLoading) return
		const typeId = metaStore.releaseMediaTypes.find(
			t => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW
		)?.id
		const statusId = metaStore.releaseMediaStatuses.find(
			s => s.status === ReleaseMediaStatusesEnum.APPROVED
		)?.id

		if (!typeId || !statusId) return

		return fetchMedia(statusId, typeId)
	}, [
		isStatusesLoading,
		isTypesLoading,
		metaStore.releaseMediaTypes,
		metaStore.releaseMediaStatuses,
		fetchMedia,
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
			fetchReleaseMedia()
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
					items={mainPageStore.releaseMedia}
					isLoading={isMediaLoading || isStatusesLoading || isTypesLoading}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default ReleaseMediaReviews
