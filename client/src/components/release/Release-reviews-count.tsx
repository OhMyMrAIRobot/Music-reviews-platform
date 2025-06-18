import { FC } from 'react'
import NoTextReviewSvg from '../review/svg/No-text-review-svg'
import TextReviewSvg from '../review/svg/Text-review-svg'

interface IProps {
	textCount: number
	noTextCount: number
	className?: string
}

const ReleaseReviewsCount: FC<IProps> = ({
	textCount,
	noTextCount,
	className,
}) => {
	return (
		(textCount > 0 || noTextCount > 0) && (
			<div
				className={`flex gap-2 items-top font-semibold text-sm select-none ${className}`}
			>
				{textCount > 0 && (
					<div className='flex gap-0.75 items-center'>
						<TextReviewSvg className='size-3' />
						<span>{textCount}</span>
					</div>
				)}
				{noTextCount > 0 && (
					<div className='flex gap-0.75 items-center'>
						<NoTextReviewSvg className='size-3' />
						<span>{noTextCount}</span>
					</div>
				)}
			</div>
		)
	)
}

export default ReleaseReviewsCount
