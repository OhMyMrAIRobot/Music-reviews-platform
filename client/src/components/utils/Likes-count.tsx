import { FC } from 'react'
import BookmarkSvg from '../svg/Bookmark-svg'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'

interface IProps {
	count: number
	className?: string
}

const LikesCount: FC<IProps> = ({ count, className = '' }) => {
	return (
		<TooltipSpan
			tooltip={<Tooltip>{'Количество добавлений в предпочтения'}</Tooltip>}
			spanClassName='text-white relative'
			centered={true}
		>
			<div className='flex gap-x-1 items-center justify-center font-medium'>
				<BookmarkSvg className={`${className} fill-[rgba(35,101,199,1)]`} />
				<span>{count}</span>
			</div>
		</TooltipSpan>
	)
}

export default LikesCount
