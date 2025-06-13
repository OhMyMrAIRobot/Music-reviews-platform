import { FC } from 'react'
import { IReleaseTypeStats } from '../../../models/author/authors-response'
import { ReleaseRatingTypesEnum } from '../../../models/release/release-rating-types-enum'
import { ReleaseTypesEnum } from '../../../models/release/release-types'
import AlbumSvg from '../../release/svg/Album-svg'
import SingleSvg from '../../release/svg/Single-svg'
import AuthorRatingsItem from './Author-ratings-item'

interface IProps {
	releaseType: ReleaseTypesEnum
	stats: IReleaseTypeStats[]
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
					rating={ratings.ratings.super_user}
					ratingType={ReleaseRatingTypesEnum.SUPER_USER}
					releaseType={releaseType}
				/>
				<AuthorRatingsItem
					rating={ratings.ratings.with_text}
					ratingType={ReleaseRatingTypesEnum.WITH_TEXT}
					releaseType={releaseType}
				/>
				<AuthorRatingsItem
					rating={ratings.ratings.no_text}
					ratingType={ReleaseRatingTypesEnum.NO_TEXT}
					releaseType={releaseType}
				/>
			</div>
		)
	)
}

export default AuthorReleaseTypesRatings
