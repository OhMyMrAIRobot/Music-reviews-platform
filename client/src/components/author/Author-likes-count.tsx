import { FC } from 'react'
import TooltipSpan from '../releasePage/tooltip/Tooltip-span'
import BookmarkSvg from '../svg/Bookmark-svg'
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
				<BookmarkSvg className={'size-5 fill-[rgba(35,101,199,1)]'} />
				<span>{count}</span>
			</div>
		</TooltipSpan>
	)
}

export default AuthorLikesCount
