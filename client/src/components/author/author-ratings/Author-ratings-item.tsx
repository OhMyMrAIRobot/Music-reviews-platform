import { FC } from 'react'
import { ReleaseRatingTypesEnum } from '../../../models/release/release-rating/release-rating-types-enum'
import { ReleaseTypesEnum } from '../../../models/release/release-type/release-types-enum'
import Tooltip from '../../tooltip/Tooltip'
import TooltipSpan from '../../tooltip/Tooltip-span'

interface IProps {
	rating: number | null
	ratingType: ReleaseRatingTypesEnum
	releaseType: ReleaseTypesEnum
}

const AuthorRatingsItem: FC<IProps> = ({ rating, ratingType, releaseType }) => {
	const releaseTypeText =
		releaseType === ReleaseTypesEnum.ALBUM ? 'альбомов' : 'треков'

	let tooltipText = ''
	switch (ratingType) {
		case ReleaseRatingTypesEnum.MEDIA:
			tooltipText = `Средняя оценка ${releaseTypeText} от Медиа`
			break
		case ReleaseRatingTypesEnum.WITH_TEXT:
			tooltipText = `Средняя оценка ${releaseTypeText} с рецензией от пользователей`
			break
		case ReleaseRatingTypesEnum.WITHOUT_TEXT:
			tooltipText = `Средняя оценка ${releaseTypeText} без рецензий от пользователей`
			break
	}

	let className = ''
	if (ratingType === ReleaseRatingTypesEnum.MEDIA) {
		className += `border-[rgba(255,255,255,.1)] ${
			rating ? 'bg-[rgba(255,255,255,.1)]' : 'border-2 border-dashed'
		}`
	} else if (ratingType === ReleaseRatingTypesEnum.WITH_TEXT) {
		className += `border-2 ${
			rating
				? 'bg-[rgba(35,101,199)] border-[rgba(35,101,199)]'
				: 'border-dashed border-[rgba(35,101,199)]/60'
		}`
	} else if (ratingType === ReleaseRatingTypesEnum.WITHOUT_TEXT) {
		className += `border-2 ${
			rating
				? 'border-[rgba(35,101,199)]'
				: 'border-dashed border-[rgba(35,101,199)]/60'
		}`
	}

	return (
		<TooltipSpan
			tooltip={rating ? <Tooltip>{tooltipText}</Tooltip> : <></>}
			spanClassName={'relative'}
		>
			<div
				className={`inline-flex size-8 text-xs items-center justify-center font-semibold rounded-full ${className}`}
			>
				{rating}
			</div>
		</TooltipSpan>
	)
}

export default AuthorRatingsItem
