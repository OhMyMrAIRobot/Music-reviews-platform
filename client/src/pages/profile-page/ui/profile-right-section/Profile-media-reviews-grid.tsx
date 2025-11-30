import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api'
import Pagination from '../../../../components/pagination/Pagination'
import ReleaseMediaReview from '../../../../components/release/release-media/Release-media-review'
import { useReleaseMediaMeta } from '../../../../hooks/use-release-media-meta'
import { profileKeys } from '../../../../query-keys/profile-keys'
import {
	ReleaseMediaStatusesEnum,
	ReleaseMediaTypesEnum,
} from '../../../../types/release'

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
			ReleaseMediaAPI.findAll(
				{
					limit: perPage,
					offset: (currentPage - 1) * perPage,
					userId,
					statusId,
					typeId,
				}
				// perPage,
				// (currentPage - 1) * perPage,
				// statusId,
				// typeId,
				// null,
				// userId,
				// null,
				// null
			),
		enabled: !isMetaLoading && !!typeId && !!statusId && !!userId,
		staleTime: 1000 * 60 * 5,
	})

	// const { storeToggle } = useQueryListFavToggleAll<
	// 	IReleaseMedia,
	// 	{ releaseMedia: IReleaseMedia[] }
	// >(['profile', 'media'], 'releaseMedia', toggleFavMedia)

	const items = mediaData?.items || []

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
					: items.map(media => (
							<ReleaseMediaReview
								key={media.id}
								media={media}
								toggleFav={undefined} // TODO: FIX TOGGLE
								isLoading={false}
							/>
					  ))}
			</div>

			{!isMediaLoading && !isMediaLoading && items.length === 0 && (
				<p className='text-center text-2xl font-semibold mt-10'>
					Медиарецензии не найдены!
				</p>
			)}

			{mediaData && items.length > 0 && (
				<div className='mt-10'>
					<Pagination
						currentPage={currentPage}
						totalItems={mediaData.meta.count ?? 0}
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
