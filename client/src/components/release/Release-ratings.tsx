import { FC } from 'react'
import { IReleaseRating } from '../../models/release/release-rating'
import { ReleaseRatingTypesEnum } from '../../models/release/release-rating-types-enum'

interface IProps {
	ratings: IReleaseRating[]
	className: string
}

const ReleaseRatings: FC<IProps> = ({ ratings, className }) => {
	const ratingOrder = [
		ReleaseRatingTypesEnum.SUPER_USER,
		ReleaseRatingTypesEnum.WITH_TEXT,
		ReleaseRatingTypesEnum.NO_TEXT,
	]

	const sortedRatings = ratingOrder
		.map(type => ratings.find(r => r.type === type))
		.filter(r => r && r.total > 0)

	return sortedRatings.map(rating => {
		let baseClassName =
			' inline-flex items-center justify-center font-semibold rounded-full '

		if (rating?.type === ReleaseRatingTypesEnum.SUPER_USER) {
			baseClassName += 'bg-[rgba(255,255,255,.1)]'
		} else if (rating?.type === ReleaseRatingTypesEnum.WITH_TEXT) {
			baseClassName += 'bg-[rgba(35,101,199)]'
		} else if (rating?.type === ReleaseRatingTypesEnum.NO_TEXT) {
			baseClassName += 'border-2 border-[rgba(35,101,199)]'
		}

		return (
			<div key={rating?.type} className={className + baseClassName}>
				{rating?.total}
			</div>
		)
	})
}

export default ReleaseRatings
