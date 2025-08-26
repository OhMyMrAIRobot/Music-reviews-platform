import { FC } from 'react'
import { NominationTypesEnum } from '../../models/nomination/nomination-type/nomination-type-enum'
import AlbumOfMonthNominationSvg from './svg/Album-of-month-nomination-svg'
import CoverOfMonthNominationSvg from './svg/Cover-of-month-nomination-svg'
import HitOfMonthNominationSvg from './svg/Hit-of-month-nomination-svg'

interface IProps {
	nomination: string
	className: string
}

const NominationIconSvg: FC<IProps> = ({ nomination, className }) => {
	switch (nomination) {
		case NominationTypesEnum.COVER_OF_MONTH:
			return <CoverOfMonthNominationSvg className={className} />
		case NominationTypesEnum.ALBUM_OF_MONTH:
			return <AlbumOfMonthNominationSvg className={className} />
		case NominationTypesEnum.HIT_OF_MONTH:
			return <HitOfMonthNominationSvg className={className} />
		default:
			return null
	}
}

export default NominationIconSvg
