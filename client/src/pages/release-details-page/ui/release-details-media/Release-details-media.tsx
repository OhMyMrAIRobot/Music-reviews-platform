import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'
import CarouselNavButton from '../../../../components/carousel/Carousel-nav-button'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { ReleaseMediaStatusesEnum } from '../../../../models/release/release-media/release-media-status/release-media-statuses-enum'
import { RolesEnum } from '../../../../models/role/roles-enum'
import { CarouselRef } from '../../../../types/carousel-ref'
import ReleaseDetailsMediaCarousel from './Release-details-media-carousel'

interface IProps {
	releaseId: string
}

const ReleaseDetailsMedia: FC<IProps> = observer(({ releaseId }) => {
	const { releaseDetailsPageStore, metaStore, authStore } = useStore()

	const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
		metaStore.fetchReleaseMediaStatuses
	)

	const { execute: _fetchReleaseMedia, isLoading: isReleaseMediaLoading } =
		useLoading(releaseDetailsPageStore.fetchReleaseMedia)

	const {
		execute: _fetchUserReleaseMedia,
		isLoading: isUserReleaseMediaLoading,
	} = useLoading(releaseDetailsPageStore.fetchUserReleaseMedia)

	useEffect(() => {
		if (metaStore.releaseMediaStatuses.length === 0) {
			fetchStatuses().then(() => {
				Promise.all([fetchReleaseMedia(), fetchUserReleaseMedia()])
			})
		} else {
			Promise.all([fetchReleaseMedia(), fetchUserReleaseMedia()])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [releaseId, authStore.isAuth, authStore.user])

	const fetchReleaseMedia = async () => {
		const status = metaStore.releaseMediaStatuses.find(
			el => el.status === ReleaseMediaStatusesEnum.APPROVED
		)
		if (!status) return

		_fetchReleaseMedia(status.id, releaseId)
	}

	const fetchUserReleaseMedia = async () => {
		if (
			authStore.isAuth &&
			authStore.user &&
			authStore.user.role.role === RolesEnum.MEDIA
		) {
			_fetchUserReleaseMedia(releaseId, authStore.user.id)
		}
	}

	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	const userRelease = releaseDetailsPageStore.userReleaseMedia

	return (
		<section
			className={`gap-3 grid mt-5 w-full ${
				!isStatusesLoading &&
				!isStatusesLoading &&
				!isUserReleaseMediaLoading &&
				!releaseDetailsPageStore.userReleaseMedia &&
				releaseDetailsPageStore.releaseMedia.length === 0
					? 'hidden'
					: ''
			}`}
		>
			<div className='flex'>
				<div className='font-bold shrink-0 flex items-center justify-between space-x-2 lg:space-x-5 col-span-2'>
					<div className='text-xl xl:text-2xl font-semibold'>
						Медиаматериалы
					</div>

					{!isReleaseMediaLoading &&
					!isStatusesLoading &&
					!isUserReleaseMediaLoading ? (
						<div className='inline-flex items-center justify-center rounded-full size-10 lg:size-12 bg-white/5 select-none'>
							{releaseDetailsPageStore.releaseMediaCount +
								(releaseDetailsPageStore.userReleaseMedia ? 1 : 0)}
						</div>
					) : (
						<SkeletonLoader className={'rounded-full size-10 lg:size-12'} />
					)}
				</div>

				<div className='flex gap-3 items-center ml-auto'>
					<CarouselNavButton
						isNext={false}
						handlePrev={() => carouselRef.current?.scrollPrev()}
						handleNext={() => carouselRef.current?.scrollNext()}
						disabled={!canScrollPrev}
					/>
					<CarouselNavButton
						isNext={true}
						handlePrev={() => carouselRef.current?.scrollPrev()}
						handleNext={() => carouselRef.current?.scrollNext()}
						disabled={!canScrollNext}
					/>
				</div>
			</div>

			<ReleaseDetailsMediaCarousel
				ref={carouselRef}
				onCanScrollPrevChange={setCanScrollPrev}
				onCanScrollNextChange={setCanScrollNext}
				isLoading={
					isReleaseMediaLoading ||
					isStatusesLoading ||
					isUserReleaseMediaLoading
				}
				items={
					userRelease &&
					userRelease.releaseMediaStatus.status !==
						ReleaseMediaStatusesEnum.APPROVED
						? [userRelease, ...releaseDetailsPageStore.releaseMedia]
						: releaseDetailsPageStore.releaseMedia
				}
			/>
		</section>
	)
})

export default ReleaseDetailsMedia
