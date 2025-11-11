import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api'
import Pagination from '../../../../components/pagination/Pagination'
import ReleaseMediaReview from '../../../../components/release/release-media/Release-media-review'
import { useQueryListFavToggleAll } from '../../../../hooks/use-query-list-fav-toggle'
import { useReleaseMediaMeta } from '../../../../hooks/use-release-media-meta'
import { IReleaseMedia } from '../../../../models/release/release-media/release-media'
import { ReleaseMediaStatusesEnum } from '../../../../models/release/release-media/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../../../models/release/release-media/release-media-type/release-media-types-enum'
import { profileKeys } from '../../../../query-keys/profile-keys'
import { toggleFavMedia } from '../../../../utils/toggle-fav-media'

interface IProps {
	userId: string
}

const perPage = 5

const ProfileMediaReviewsGrid: FC<IProps> = ({ userId }) => {
	const [currentPage, setCurrentPage] = useState<number>(1)

	const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta()

	const typeId = types.find(
		t => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW
	)?.id
	const statusId = statuses.find(
		s => s.status === ReleaseMediaStatusesEnum.APPROVED
	)?.id

	const queryKey = profileKeys.media({
		userId,
		statusId: statusId ?? null,
		typeId: typeId ?? null,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
	})

	const { data: mediaData, isPending: isMediaLoading } = useQuery({
		queryKey,
		queryFn: () =>
			typeId && statusId
				? ReleaseMediaAPI.fetchReleaseMedia(
						perPage,
						(currentPage - 1) * perPage,
						statusId,
						typeId,
						null,
						userId,
						null,
						null
				  )
				: Promise.resolve({ releaseMedia: [], count: 0 }),
		enabled: !isMetaLoading && !!typeId && !!statusId,
		staleTime: 1000 * 60 * 5,
	})

	const { storeToggle } = useQueryListFavToggleAll<
		IReleaseMedia,
		{ releaseMedia: IReleaseMedia[] }
	>(['profile', 'media'], 'releaseMedia', toggleFavMedia)

	return (
		<section>
			<div className='gap-5 grid grid-cols-1 select-none'>
				{isMediaLoading || isMediaLoading
					? Array.from({ length: perPage }).map((_, idx) => (
							<ReleaseMediaReview
								key={`Skeleton-media-review-${idx}`}
								isLoading={true}
							/>
					  ))
					: mediaData?.releaseMedia.map(media => (
							<ReleaseMediaReview
								key={media.id}
								media={media}
								toggleFav={storeToggle}
								isLoading={false}
							/>
					  ))}
			</div>

			{!isMediaLoading &&
				!isMediaLoading &&
				mediaData?.releaseMedia.length === 0 && (
					<p className='text-center text-2xl font-semibold mt-10'>
						Медиарецензии не найдены!
					</p>
				)}

			{mediaData && mediaData.releaseMedia.length > 0 && (
				<div className='mt-10'>
					<Pagination
						currentPage={currentPage}
						totalItems={mediaData.count ?? 0}
						itemsPerPage={perPage}
						setCurrentPage={setCurrentPage}
						idToScroll={'profile-sections'}
					/>
				</div>
			)}
		</section>
	)
}

export default ProfileMediaReviewsGrid
