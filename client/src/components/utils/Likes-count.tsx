import { FC } from 'react'
import BookmarkSvg from '../svg/Bookmark-svg'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'

interface IProps {
	count: number
}

const LikesCount: FC<IProps> = ({ count }) => {
	return (
		<TooltipSpan
			tooltip={<Tooltip>{'Количество добавлений в предпочтения'}</Tooltip>}
			spanClassName='text-white relative'
			centered={false}
		>
			<div className='flex gap-x-1 items-center justify-center font-medium'>
				<BookmarkSvg className={'size-5 fill-[rgba(35,101,199,1)]'} />
				<span>{count}</span>
			</div>
		</TooltipSpan>
	)
}

export default LikesCount
