import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import Pagination from '../../../../components/pagination/Pagination'
import ReleaseMediaReview from '../../../../components/release-media/Release-media-review'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { IProfile } from '../../../../models/profile/profile'
import { ReleaseMediaStatusesEnum } from '../../../../models/release/release-media/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../../../models/release/release-media/release-media-type/release-media-types-enum'

interface IProps {
	profile: IProfile
}

const ProfileMediaReviewsGrid: FC<IProps> = observer(({ profile }) => {
	const perPage = 5

	const { metaStore, profilePageStore } = useStore()

	const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
		metaStore.fetchReleaseMediaStatuses
	)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseMediaTypes
	)

	const { execute: fetchMedia, isLoading: isMediaLoading } = useLoading(
		profilePageStore.fetchMedia
	)

	const [currentPage, setCurrentPage] = useState<number>(1)

	const fetch = useCallback(() => {
		if (isStatusesLoading || isTypesLoading) return

		const typeId = metaStore.releaseMediaTypes.find(
			t => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW
		)?.id
		const statusId = metaStore.releaseMediaStatuses.find(
			s => s.status === ReleaseMediaStatusesEnum.APPROVED
		)?.id

		if (!typeId || !statusId) return

		return fetchMedia(
			profile.id,
			statusId,
			typeId,
			perPage,
			(currentPage - 1) * perPage
		)
	}, [
		isStatusesLoading,
		isTypesLoading,
		metaStore.releaseMediaTypes,
		metaStore.releaseMediaStatuses,
		fetchMedia,
		profile.id,
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
	}, [currentPage])

	return (
		<section className='mt-5'>
			<div className='gap-5 grid grid-cols-1 select-none'>
				{isMediaLoading || isStatusesLoading || isTypesLoading
					? Array.from({ length: perPage }).map((_, idx) => (
							<ReleaseMediaReview
								key={`Skeleton-media-review-${idx}`}
								isLoading={true}
							/>
					  ))
					: profilePageStore.media.map(media => (
							<ReleaseMediaReview
								key={media.id}
								media={media}
								toggleFav={profilePageStore.toggleFavMedia}
								isLoading={false}
							/>
					  ))}
			</div>

			{!isMediaLoading &&
				!isStatusesLoading &&
				!isTypesLoading &&
				profilePageStore.media.length === 0 && (
					<p className='text-center text-2xl font-semibold mt-10'>
						Медиарецензии не найдены!
					</p>
				)}

			{profilePageStore.media.length > 0 && (
				<div className='mt-10'>
					<Pagination
						currentPage={currentPage}
						totalItems={profilePageStore.mediaCount}
						itemsPerPage={perPage}
						setCurrentPage={setCurrentPage}
						idToScroll={'profile-sections'}
					/>
				</div>
			)}
		</section>
	)
})

export default ProfileMediaReviewsGrid
