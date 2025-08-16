import { FC } from 'react'
import AuthorCommentColorSvg from '../author/author-comment/svg/Author-comment-color-svg'
import AuthorLikeColorSvg from '../author/author-like/svg/Author-like-color-svg'
import Tooltip from '../tooltip/Tooltip'
import TooltipSpan from '../tooltip/Tooltip-span'

interface IProps {
	hasAuthorComments: boolean
	hasAuthorLikes: boolean
	className?: string
}

const ReleaseAuthorActions: FC<IProps> = ({
	hasAuthorComments,
	hasAuthorLikes,
	className = '',
}) => {
	return (
		<div className={`flex gap-2 ${className}`}>
			{hasAuthorComments && (
				<TooltipSpan
					tooltip={<Tooltip>Автор прокомментировал релиз</Tooltip>}
					spanClassName='text-white cursor-pointer relative'
					centered={true}
				>
					<AuthorCommentColorSvg className={'size-5'} />
				</TooltipSpan>
			)}

			{hasAuthorLikes && (
				<TooltipSpan
					tooltip={<Tooltip>Автор поставил лайки на рецензии</Tooltip>}
					spanClassName='text-white cursor-pointer relative'
					centered={true}
				>
					<AuthorLikeColorSvg className={'size-5'} />
				</TooltipSpan>
			)}
		</div>
	)
}

export default ReleaseAuthorActions
