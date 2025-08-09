import { FC, useMemo } from 'react'
import { AuthorTypesEnum } from '../../models/author/author-types-enum'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'
import RegisteredArtistSvg from './svg/Registered-artist-svg'
import RegisteredDesignerSvg from './svg/Registered-designer-svg'
import RegisteredProducerSvg from './svg/Registered-producer-svg'

interface IProps {
	type: string
	className: string
}

const iconComponents = {
	[AuthorTypesEnum.ARTIST]: RegisteredArtistSvg,
	[AuthorTypesEnum.PRODUCER]: RegisteredProducerSvg,
	[AuthorTypesEnum.DESIGNER]: RegisteredDesignerSvg,
} as const

const RegisteredAuthorTypeIcon: FC<IProps> = ({ className, type }) => {
	const IconComponent = useMemo(
		() => iconComponents[type as AuthorTypesEnum],
		[type]
	)

	return (
		<TooltipSpan
			tooltip={<Tooltip>{`${type} зарегистрирован на сайте`}</Tooltip>}
			spanClassName='text-white relative cursor-pointer'
			centered={true}
		>
			<IconComponent className={className} />
		</TooltipSpan>
	)
}

export default RegisteredAuthorTypeIcon
