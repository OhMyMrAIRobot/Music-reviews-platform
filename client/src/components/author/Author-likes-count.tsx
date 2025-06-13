import { FC } from 'react'
import { ReleaseLikesSvgIcon } from '../releasePage/releasePageSvgIcons'
import TooltipSpan from '../releasePage/tooltip/Tooltip-span'
import Tooltip from '../tooltip/Tooltip'

interface IProps {
	count: number
}

const AuthorLikesCount: FC<IProps> = ({ count }) => {
	return (
		<TooltipSpan
			tooltip={<Tooltip>{'Количество добавлений в предпочтения'}</Tooltip>}
			spanClassName='text-white relative'
		>
			<div className='flex gap-x-1 items-center justify-center font-medium'>
				<ReleaseLikesSvgIcon />
				<span>{count}</span>
			</div>
		</TooltipSpan>
	)
}

export default AuthorLikesCount
