import { FC } from 'react'
import ReleaseAuthors from '../../../../../components/release/Release-authors'
import ReleaseRatings from '../../../../../components/release/Release-ratings'
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon'
import TextReviewSvg from '../../../../../components/review/svg/Text-review-svg'
import useCustomNavigate from '../../../../../hooks/use-custom-navigate'
import { IRelease } from '../../../../../models/release/release'

interface IProps {
	release: IRelease | null
	index: number
}

const MostReviewedCarouselCard: FC<IProps> = ({ release, index }) => {
	const { navigateToRelease } = useCustomNavigate()

	return (
		release && (
			<div className='w-full max-w-[300px] lg:max-w-[350px] flex flex-col items-center shadow-2xl select-none border border-white/10 bg-black/40 rounded-[30px] lg:rounded-[40px] p-[15px] overflow-hidden h-[85%]'>
				{/* COVER */}
				<div className='flex flex-col items-center gap-2 relative '>
					<span className='font-semibold absolute left-3 top-3 lg:left-4 lg:top-4 bg-black/10 text-white backdrop-blur-md text-[12px] lg:text-[13px] h-7 rounded-full px-3 flex items-center'>
						Топ-{index + 1} за сутки
					</span>

					<ReleaseTypeIcon
						type={release.release_type}
						className={
							'absolute size-9 bottom-4 right-4 bg-zinc-900 rounded-full flex items-center justify-center p-2'
						}
					/>

					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							release.img
						}`}
						className='rounded-[15px] lg:rounded-[25px] border border-white/10'
					/>
				</div>

				{/* TITLE, AUTHORS, MARKS */}
				<div className='flex justify-between w-full items-center gap-5 mt-2 '>
					<div className='w-full'>
						<span className='text-left lg:text-xl font-medium block'>
							{release.title}
						</span>

						<ReleaseAuthors
							authors={release.author}
							className='font-semibold mt-2 leading-3'
						/>
					</div>

					<div className='flex shrink-0 gap-[5px] items-center'>
						<ReleaseRatings
							ratings={release.ratings}
							className={'size-9 2xl:size-11 text-base'}
							showHint={false}
						/>
					</div>
				</div>

				<div className='mt-auto flex items-center justify-between w-full h-10 2xl:h-11'>
					<button
						onClick={() => {
							navigateToRelease(release.id)
						}}
						className='h-full text-white flex items-center justify-center border border-white bg-black hover:text-black hover:bg-white cursor-pointer transition-colors duration-200 rounded-full w-[65%] text-xs 2xl:text-base font-semibold'
					>
						Написать рецензию...
					</button>

					<button
						onClick={() => {
							navigateToRelease(release.id)
						}}
						className='border border-white/0 px-3 h-full bg-white/10 flex items-center rounded-full min-w-20 lg:min-w-25 justify-center text-center gap-1 hover:bg-white/15 hover:border-white/10 cursor-pointer transition-colors duration-200'
					>
						<TextReviewSvg className={'size-5 mr-1'} />
						<span>{release.text_count + release.no_text_count}</span>
					</button>
				</div>
			</div>
		)
	)
}

export default MostReviewedCarouselCard
