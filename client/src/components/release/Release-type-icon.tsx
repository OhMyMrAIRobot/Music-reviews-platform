import { FC } from 'react'
import { ReleaseTypesEnum } from '../../models/release/release-types'
import AlbumSvg from './svg/Album-svg'
import SingleSvg from './svg/Single-svg'

interface IProps {
	type: string
	className: string
}

const ReleaseTypeIcon: FC<IProps> = ({ type, className }) => {
	switch (type) {
		case ReleaseTypesEnum.ALBUM:
			return <AlbumSvg className={className} />
		case ReleaseTypesEnum.SINGLE:
			return <SingleSvg className={className} />
		default:
			return null
	}
}

export default ReleaseTypeIcon
