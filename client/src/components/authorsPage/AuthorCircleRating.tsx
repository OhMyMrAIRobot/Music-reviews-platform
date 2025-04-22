import { FC } from 'react'
import { ReleaseRatingTypesEnum } from '../../models/release/ReleaseRatingTypes'
import { ReleaseTypesEnum } from '../../models/release/ReleaseTypes'
import TooltipSpan from '../releasePage/tooltip/TooltipSpan'
import { ToolTip } from './AuthorItem'

interface IProps {
	rating: number | null
	ratingType: ReleaseRatingTypesEnum
	releaseType: ReleaseTypesEnum
}

const AuthorCircleRating: FC<IProps> = ({
	rating,
	ratingType,
	releaseType,
}) => {
	const releaseTypeText =
		releaseType === ReleaseTypesEnum.ALBUM ? 'альбомов' : 'треков'

	let tooltipText = ''
	switch (ratingType) {
		case ReleaseRatingTypesEnum.SUPER_USER:
			tooltipText = `Средняя оценка ${releaseTypeText} от супер-пользователей`
			break
		case ReleaseRatingTypesEnum.WITH_TEXT:
			tooltipText = `Средняя оценка ${releaseTypeText} с рецензией от пользователей`
			break
		case ReleaseRatingTypesEnum.NO_TEXT:
			tooltipText = `Средняя оценка ${releaseTypeText} без рецензий от пользователей`
			break
	}

	let className = ''
	if (ratingType === ReleaseRatingTypesEnum.SUPER_USER) {
		className += `border-[rgba(255,255,255,.1)] ${
			rating ? 'bg-[rgba(255,255,255,.1)]' : 'border-2 border-dashed'
		}`
	} else if (ratingType === ReleaseRatingTypesEnum.WITH_TEXT) {
		className += `border-2 ${
			rating
				? 'bg-[rgba(35,101,199)] border-[rgba(35,101,199)]'
				: 'border-dashed border-[rgba(35,101,199)]/60'
		}`
	} else if (ratingType === ReleaseRatingTypesEnum.NO_TEXT) {
		className += `border-2 ${
			rating
				? 'border-[rgba(35,101,199)]'
				: 'border-dashed border-[rgba(35,101,199)]/60'
		}`
	}

	return (
		<TooltipSpan
			tooltip={rating ? <ToolTip text={tooltipText} /> : <></>}
			spanClassName={''}
		>
			<div
				className={`inline-flex size-8 text-xs items-center justify-center font-semibold rounded-full ${className}`}
			>
				{rating}
			</div>
		</TooltipSpan>
	)
}

export default AuthorCircleRating
