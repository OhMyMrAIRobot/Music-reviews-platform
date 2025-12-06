import { FC } from 'react'
import { AuthorType, AuthorTypesEnum } from '../../../types/author'
import ArtistSvg from '../svg/Artist-svg'
import DesignerSvg from '../svg/Designer-svg'
import ProducerSvg from '../svg/Producer-svg'

interface IProps {
	type: AuthorType
	className: string
}

const AuthorTypeSvg: FC<IProps> = ({ type, className }) => {
	switch (type.type) {
		case AuthorTypesEnum.ARTIST:
			return <ArtistSvg className={className} />
		case AuthorTypesEnum.PRODUCER:
			return <ProducerSvg className={className} />
		case AuthorTypesEnum.DESIGNER:
			return <DesignerSvg className={className} />
		default:
			return null
	}
}

export default AuthorTypeSvg
