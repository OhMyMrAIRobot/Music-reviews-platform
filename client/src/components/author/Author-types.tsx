import { FC } from 'react'
import { AuthorTypesEnum, IAuthorType } from '../../models/author/author-type'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'
import ArtistSvg from './svg/Artist-svg'
import DesignerSvg from './svg/Designer-svg'
import ProducerSvg from './svg/Producer-svg'

interface IProps {
	types: IAuthorType[]
}

const AuthorTypes: FC<IProps> = ({ types }) => {
	return types.map(type => (
		<TooltipSpan
			tooltip={<Tooltip>{type.type}</Tooltip>}
			spanClassName='text-white relative'
			key={type.type}
			centered={false}
		>
			{(() => {
				switch (type.type) {
					case AuthorTypesEnum.ARTIST:
						return <ArtistSvg className={'size-7'} />
					case AuthorTypesEnum.PRODUCER:
						return <ProducerSvg className={'size-7'} />
					case AuthorTypesEnum.DESIGNER:
						return <DesignerSvg className={'size-7'} />
					default:
						return null
				}
			})()}
		</TooltipSpan>
	))
}

export default AuthorTypes
