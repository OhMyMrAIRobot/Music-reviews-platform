import { FC } from 'react'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'
import WrittenCommentsSvg from './svg/Written-comments-svg'

interface IProps {
	count: number
	iconClassname?: string
}

const RegisteredAuthorWrittenComments: FC<IProps> = ({
	count,
	iconClassname = '',
}) => {
	return (
		count > 0 && (
			<TooltipSpan
				tooltip={<Tooltip>Написано авторских комментариев</Tooltip>}
				spanClassName='text-white relative cursor-pointer flex items-center gap-1'
				centered={true}
			>
				<WrittenCommentsSvg className={iconClassname} />
				<span className='font-bold text-sm'>{count}</span>
			</TooltipSpan>
		)
	)
}

export default RegisteredAuthorWrittenComments
