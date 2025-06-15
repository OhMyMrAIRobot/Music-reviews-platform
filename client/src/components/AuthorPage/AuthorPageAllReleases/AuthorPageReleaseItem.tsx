import { FC } from 'react'
import useCustomNavigate from '../../../hooks/use-custom-navigate'
import { IRelease } from '../../../models/release/release'
import { ReleaseRatingTypesEnum } from '../../../models/release/release-rating-types-enum'
import TooltipSpan from '../../releasePage/tooltip/Tooltip-span'
import NoTextReviewSvg from '../../review/svg/No-text-review-svg'
import TextReviewSvg from '../../review/svg/Text-review-svg'
import Tooltip from '../../tooltip/Tooltip'

interface IProps {
	release: IRelease
}

const AuthorPageReleaseItem: FC<IProps> = ({ release }) => {
	const ratingOrder = [
		ReleaseRatingTypesEnum.SUPER_USER,
		ReleaseRatingTypesEnum.WITH_TEXT,
		ReleaseRatingTypesEnum.NO_TEXT,
	]

	const ratings = ratingOrder
		.map(type => release.ratings.find(r => r.type === type))
		.filter(r => r && r.total > 0)

	const { navigateToRelease, navigateToAuthor } = useCustomNavigate()
	return (
		<div className='flex items-center bg-white/[3%] border border-white/10 rounded-[10px] p-2 lg:p-[9px] group gap-4'>
			<img
				onClick={() => navigateToRelease(release.id)}
				loading='lazy'
				decoding='async'
				src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
					release.img
				}`}
				className='h-[50px] lg:h-[72px] rounded-[5px] transition-all duration-300 group-hover:scale-[1.25] group-hover:rounded-[8px] cursor-pointer'
			/>

			<div className='w-full max-w-1/2 grid grid-rows-3 h-[50px] lg:h-[72px]'>
				{(release.text_count > 0 || release.no_text_count > 0) && (
					<div className='flex gap-2 items-top font-semibold text-sm'>
						{release.text_count > 0 && (
							<div className='flex gap-0.75 items-center'>
								<TextReviewSvg className='size-3' />
								<span>{release.text_count}</span>
							</div>
						)}
						{release.no_text_count > 0 && (
							<div className='flex gap-0.75 items-center'>
								<NoTextReviewSvg className='size-3' />
								<span>{release.no_text_count}</span>
							</div>
						)}
					</div>
				)}

				<p
					className='hover:underline font-medium text-sm lg:text-base text-ellipsis overflow-hidden whitespace-nowrap transition-all duration-150 w-fit select-none cursor-pointer'
					onClick={() => navigateToRelease(release.id)}
				>
					{release.title}
				</p>

				<div className='flex flex-wrap font-medium leading-3 items-center text-sm lg:text-base'>
					{release.author.map((author, index) => (
						<div key={author.name} className='flex'>
							<div
								onClick={() => {
									navigateToAuthor(author.id)
									window.scrollTo({ top: 0, behavior: 'smooth' })
								}}
								className='opacity-70 hover:underline hover:opacity-100 transition-colors duration-300 cursor-pointer'
							>
								{author.name}
							</div>
							<span className='ml-[1px] pr-[3px]'>
								{index < release.author.length - 1 && ','}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className='flex items-center gap-[5px] select-none ml-auto pr-5'>
				{ratings.map(rating => {
					let className = ''
					let tooltip = ''
					if (rating?.type === ReleaseRatingTypesEnum.SUPER_USER) {
						className += 'bg-[rgba(255,255,255,.1)]'
						tooltip = 'Средняя оценка супер-пользователей'
					} else if (rating?.type === ReleaseRatingTypesEnum.WITH_TEXT) {
						className += 'bg-[rgba(35,101,199)]'
						tooltip = 'Средняя оценка рецензий пользователей'
					} else if (rating?.type === ReleaseRatingTypesEnum.NO_TEXT) {
						className += 'border-2 border-[rgba(35,101,199)]'
						tooltip = 'Средняя оценка без рецензий пользователей'
					}

					return (
						<TooltipSpan
							key={rating?.type}
							tooltip={<Tooltip>{tooltip}</Tooltip>}
							spanClassName={'relative rounded-full'}
							centered={false}
						>
							<div
								className={`inline-flex size-[30px] lg:size-[45px] text-sm lg:text-[22px] items-center justify-center font-semibold rounded-full ${className}`}
							>
								{rating?.total}
							</div>
						</TooltipSpan>
					)
				})}
			</div>
		</div>
	)
}

export default AuthorPageReleaseItem
