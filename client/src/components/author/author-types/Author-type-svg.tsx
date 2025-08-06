import { FC } from 'react'
import { IAuthorType } from '../../../models/author/author-type'
import { AuthorTypesEnum } from '../../../models/author/author-types-enum'
import ArtistSvg from '../svg/Artist-svg'
import DesignerSvg from '../svg/Designer-svg'
import ProducerSvg from '../svg/Producer-svg'

interface IProps {
	type: IAuthorType
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
