import { FC } from 'react'
import { IAuthorType } from '../../../models/author/author-type'
import Tooltip from '../../tooltip/Tooltip'
import TooltipSpan from '../../tooltip/Tooltip-span'
import AuthorTypeSvg from './Author-type-svg'

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
			<AuthorTypeSvg type={type} className={'size-7'} />
		</TooltipSpan>
	))
}

export default AuthorTypes
