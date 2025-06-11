import { FC } from 'react'
import { IReleaseDetails } from '../../../model/release/release-details'
import { ReleaseRatingTypesEnum } from '../../../model/release/release-rating-types-enum'
import RatingDetailsTooltip from '../tooltip/RatingDetailsTooltip'
import TooltipSpan from '../tooltip/Tooltip-span'

interface IProps {
	release: IReleaseDetails
}

const ReleaseRatingsContainer: FC<IProps> = ({ release }) => {
	const ratingOrder = [
		ReleaseRatingTypesEnum.SUPER_USER,
		ReleaseRatingTypesEnum.WITH_TEXT,
		ReleaseRatingTypesEnum.NO_TEXT,
	]

	const ratings = ratingOrder
		.map(type => release?.ratings.find(r => r.type === type))
		.filter(r => r && r.total > 0)

	return (
		<div className='flex justify-center lg:justify-start gap-x-3 select-none'>
			{ratings.map(rating => {
				let className =
					'w-20 h-8 lg:w-22 lg:h-10 rounded-3xl flex items-center justify-center text-xl lg:text-2xl font-bold relative '

				if (rating?.type === ReleaseRatingTypesEnum.SUPER_USER) {
					className += 'bg-[rgba(255,255,255,.1)]'
				} else if (rating?.type === ReleaseRatingTypesEnum.WITH_TEXT) {
					className += 'bg-[rgba(35,101,199)]'
				} else if (rating?.type === ReleaseRatingTypesEnum.NO_TEXT) {
					className += 'border-2 border-[rgba(35,101,199)]'
				}

				const ratingDetails = release.rating_details.find(
					rd => rd.type === rating?.type
				)

				return (
					rating && (
						<TooltipSpan
							key={rating.type}
							tooltip={
								<RatingDetailsTooltip
									rating={rating}
									key={rating.type}
									ratingDetails={ratingDetails}
								/>
							}
							spanClassName={className}
						>
							{rating?.total}
						</TooltipSpan>
					)
				)
			})}
		</div>
	)
}

export default ReleaseRatingsContainer
