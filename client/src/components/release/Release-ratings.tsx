import { FC } from 'react'
import { IReleaseRating } from '../../models/release/release-rating'
import { ReleaseRatingTypesEnum } from '../../models/release/release-rating/release-rating-types-enum'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'

interface IProps {
	ratings: IReleaseRating[]
	className: string
	showHint: boolean
}

const ReleaseRatings: FC<IProps> = ({ ratings, className, showHint }) => {
	const ratingOrder = [
		ReleaseRatingTypesEnum.MEDIA,
		ReleaseRatingTypesEnum.WITH_TEXT,
		ReleaseRatingTypesEnum.WITHOUT_TEXT,
	]

	const sortedRatings = ratingOrder
		.map(type => ratings.find(r => r.type === type))
		.filter(r => r && r.total > 0)

	return sortedRatings.map(rating => {
		let baseClassName =
			' inline-flex items-center justify-center font-semibold rounded-full '
		let tooltip = ''
		if (rating?.type === ReleaseRatingTypesEnum.MEDIA) {
			baseClassName += 'bg-[rgba(255,255,255,.1)]'
			tooltip = 'Средняя оценка Медиа'
		} else if (rating?.type === ReleaseRatingTypesEnum.WITH_TEXT) {
			baseClassName += 'bg-[rgba(35,101,199)]'
			tooltip = 'Средняя оценка рецензий пользователей'
		} else if (rating?.type === ReleaseRatingTypesEnum.WITHOUT_TEXT) {
			baseClassName += 'border-2 border-[rgba(35,101,199)]'
			tooltip = 'Средняя оценка без рецензий пользователей'
		}

		return showHint ? (
			<TooltipSpan
				key={rating?.type}
				tooltip={<Tooltip>{tooltip}</Tooltip>}
				spanClassName={'relative rounded-full'}
				centered={false}
			>
				<div key={rating?.type} className={className + baseClassName}>
					{rating?.total}
				</div>
			</TooltipSpan>
		) : (
			<div key={rating?.type} className={className + baseClassName}>
				{rating?.total}
			</div>
		)
	})
}

export default ReleaseRatings
