import { FC } from 'react'
import { ReleaseTypesEnum } from '../../model/release/release-types'
import { AlbumSvgIcon, SingleSvgIcon } from '../svg/ReleaseSvgIcons'

interface IProps {
	type: string
	className: string
}

const ReleaseTypeIcon: FC<IProps> = ({ type, className }) => {
	switch (type) {
		case ReleaseTypesEnum.ALBUM:
			return <AlbumSvgIcon classname={className} />
		case ReleaseTypesEnum.SINGLE:
			return <SingleSvgIcon classname={className} />
		default:
			return <SingleSvgIcon classname={className} />
	}
}

export default ReleaseTypeIcon
