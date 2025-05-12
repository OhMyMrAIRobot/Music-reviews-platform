import { FC } from 'react'
import { IReleaseTypeStats } from '../../models/author/AuthorsResponse'
import { ReleaseRatingTypesEnum } from '../../models/release/ReleaseRatingTypes'
import { ReleaseTypesEnum } from '../../models/release/ReleaseTypes'
import { AlbumSvgIcon, SingleSvgIcon } from '../svg/ReleaseSvgIcons'
import AuthorCircleRating from './AuthorCircleRating'

interface IProps {
	releaseType: ReleaseTypesEnum
	stats: IReleaseTypeStats[]
}

const AuthorReleaseTypesRatings: FC<IProps> = ({ releaseType, stats }) => {
	const ratings = stats.find(r => r.type === releaseType)
	console.log(ratings)
	return (
		ratings && (
			<div className='flex items-center justify-center text-sm gap-x-2'>
				{releaseType === ReleaseTypesEnum.SINGLE ? (
					<SingleSvgIcon classname='size-5' />
				) : (
					<AlbumSvgIcon classname='size-5' />
				)}
				<AuthorCircleRating
					rating={ratings.ratings.super_user}
					ratingType={ReleaseRatingTypesEnum.SUPER_USER}
					releaseType={releaseType}
				/>
				<AuthorCircleRating
					rating={ratings.ratings.with_text}
					ratingType={ReleaseRatingTypesEnum.WITH_TEXT}
					releaseType={releaseType}
				/>
				<AuthorCircleRating
					rating={ratings.ratings.no_text}
					ratingType={ReleaseRatingTypesEnum.NO_TEXT}
					releaseType={releaseType}
				/>
			</div>
		)
	)
}

export default AuthorReleaseTypesRatings
