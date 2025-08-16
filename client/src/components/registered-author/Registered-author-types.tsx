import { FC } from 'react'
import { IAuthorType } from '../../models/author/author-type/author-type'
import { AuthorTypesEnum } from '../../models/author/author-type/author-types-enum'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'
import RegisteredArtistSvg from './svg/Registered-artist-svg'
import RegisteredDesignerSvg from './svg/Registered-designer-svg'
import RegisteredProducerSvg from './svg/Registered-producer-svg'

interface IProps {
	className: string
	types: IAuthorType[]
}

const iconComponents = {
	[AuthorTypesEnum.ARTIST]: RegisteredArtistSvg,
	[AuthorTypesEnum.PRODUCER]: RegisteredProducerSvg,
	[AuthorTypesEnum.DESIGNER]: RegisteredDesignerSvg,
} as const

const RegisteredAuthorTypes: FC<IProps> = ({ className, types }) => {
	return types.map(({ id, type }) => {
		const IconComponent = iconComponents[type as AuthorTypesEnum]

		return (
			<TooltipSpan
				key={id}
				tooltip={<Tooltip>{`${type} зарегистрирован на сайте`}</Tooltip>}
				spanClassName='text-white relative cursor-pointer'
				centered={true}
			>
				<IconComponent className={className} />
			</TooltipSpan>
		)
	})
}

export default RegisteredAuthorTypes
