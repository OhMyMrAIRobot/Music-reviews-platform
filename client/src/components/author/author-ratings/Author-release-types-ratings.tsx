import { FC } from 'react'
import { IReleaseTypeRatings } from '../../../models/author/authors-response'
import { ReleaseRatingTypesEnum } from '../../../models/release/release-rating-types-enum'
import { ReleaseTypesEnum } from '../../../models/release/release-types'
import AlbumSvg from '../../release/svg/Album-svg'
import SingleSvg from '../../release/svg/Single-svg'
import AuthorRatingsItem from './Author-ratings-item'

interface IProps {
	releaseType: ReleaseTypesEnum
	stats: IReleaseTypeRatings[]
}

const AuthorReleaseTypesRatings: FC<IProps> = ({ releaseType, stats }) => {
	const ratings = stats.find(r => r.type === releaseType)
	return (
		ratings && (
			<div className='flex items-center justify-center text-sm gap-x-2'>
				{releaseType === ReleaseTypesEnum.SINGLE ? (
					<SingleSvg className={'size-5'} />
				) : (
					<AlbumSvg className={'size-5'} />
				)}
				<AuthorRatingsItem
					rating={ratings.ratings.media}
					ratingType={ReleaseRatingTypesEnum.MEDIA}
					releaseType={releaseType}
				/>
				<AuthorRatingsItem
					rating={ratings.ratings.withText}
					ratingType={ReleaseRatingTypesEnum.WITH_TEXT}
					releaseType={releaseType}
				/>
				<AuthorRatingsItem
					rating={ratings.ratings.withoutText}
					ratingType={ReleaseRatingTypesEnum.WITHOUT_TEXT}
					releaseType={releaseType}
				/>
			</div>
		)
	)
}

export default AuthorReleaseTypesRatings
