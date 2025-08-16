import { FC } from 'react'
import { Link } from 'react-router'
import AuthorCommentColorSvg from '../../../../../components/author/author-comment/svg/Author-comment-color-svg'
import AuthorLikeColorSvg from '../../../../../components/author/author-like/svg/Author-like-color-svg'
import ReleaseAuthors from '../../../../../components/release/Release-authors'
import ReleaseRatings from '../../../../../components/release/Release-ratings'
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon'
import TextReviewSvg from '../../../../../components/review/svg/Text-review-svg'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { IRelease } from '../../../../../models/release/release'

interface IProps {
	release: IRelease | null
	index: number
}

const MostReviewedCarouselCard: FC<IProps> = ({ release, index }) => {
	const { navigateToReleaseDetails } = useNavigationPath()

	return (
		release && (
			<div className='size-full flex flex-col items-center shadow-2xl select-none border border-white/10 bg-black/40 rounded-[30px] lg:rounded-[40px] p-[15px]'>
				{/* COVER */}
				<div className='flex flex-col items-center gap-2 relative w-full'>
					<span className='font-semibold absolute left-3 top-3 lg:left-4 lg:top-4 bg-black/10 text-white backdrop-blur-md text-[12px] lg:text-[13px] h-7 rounded-full px-3 flex items-center'>
						Топ-{index + 1} за сутки
					</span>

					<ReleaseTypeIcon
						type={release.releaseType}
						className={
							'absolute size-9 bottom-4 right-4 bg-zinc-900 rounded-full flex items-center justify-center p-2'
						}
					/>

					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							release.img === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: release.img
						}`}
						className='rounded-[15px] lg:rounded-[25px] border border-white/10 object-cover size-full'
					/>
				</div>

				{/* TITLE, AUTHORS, MARKS */}
				<div className='flex justify-between w-full items-center gap-5 mt-2'>
					<div className='w-full'>
						<span className='text-left lg:text-xl font-medium block'>
							{release.title}
						</span>

						<ReleaseAuthors
							authors={release.authors}
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

				{release.hasAuthorComments && (
					<div className='bg-zinc-900/60 hover:bg-zinc-800/60 transition-all duration-500 px-4 py-2 2xl:py-3 border border-opacity-[2%] rounded-[15px] group relative overflow-hidden w-full mt-4'>
						<div className='h-[1px] w-[93px] top-0 right-3 absolute bg-gradient-to-r from-white/0 via-white/35 to-white/0' />
						<div className='h-[30px] w-[1px] top-3 right-0 absolute bg-gradient-to-b from-white/0 via-white/25 to-white/0' />
						<div className='absolute h-[130%] w-[130%] bg-gradient-to-bl from-blue-700 opacity-20 z-0 to-50% group-hover:scale-[120%] origin-top-right transition-all duration-500 right-0 top-0' />

						<div className='flex items-center justify-between w-full'>
							<span className='leading-5 font-semibold text-xs lg:text-sm'>
								Автор прокомментировал релиз
							</span>
							<AuthorCommentColorSvg className='size-5 lg:size-7' />
						</div>
					</div>
				)}

				{release.hasAuthorLikes && (
					<div className='bg-zinc-900/60 hover:bg-zinc-800/60 transition-all duration-500 px-4 py-2 2xl:py-3 border border-opacity-[2%] rounded-[15px] group relative overflow-hidden mt-2 w-full'>
						<div className='h-[1px] w-[93px] top-0 right-3 absolute bg-gradient-to-r from-white/0 via-white/35 to-white/0' />
						<div className='h-[30px] w-[1px] top-3 right-0 absolute bg-gradient-to-b from-white/0 via-white/25 to-white/0' />
						<div className='absolute h-[130%] w-[130%] bg-gradient-to-bl from-[#FD322B] opacity-20 z-0 to-50% group-hover:scale-[120%] origin-top-right transition-all duration-500 right-0 top-0' />

						<div className='flex items-center justify-between w-full'>
							<span className='leading-5 font-semibold text-xs lg:text-sm'>
								Автор поставил лайки на рецензии
							</span>
							<AuthorLikeColorSvg className='size-5 lg:size-7' />
						</div>
					</div>
				)}

				<div className='mt-auto flex items-center justify-between w-full h-10 2xl:h-11'>
					<Link
						to={navigateToReleaseDetails(release.id)}
						className='h-full text-white flex items-center justify-center border border-white bg-black hover:text-black hover:bg-white transition-colors duration-200 rounded-full w-[65%] text-xs 2xl:text-base font-semibold'
					>
						Написать рецензию...
					</Link>

					<Link
						to={navigateToReleaseDetails(release.id)}
						className='border border-white/0 px-3 h-full bg-white/10 flex items-center rounded-full min-w-20 lg:min-w-25 justify-center text-center gap-1 hover:bg-white/15 hover:border-white/10 transition-colors duration-200'
					>
						<TextReviewSvg className={'size-5 mr-1'} />
						<span>{release.textCount + release.withoutTextCount}</span>
					</Link>
				</div>
			</div>
		)
	)
}

export default MostReviewedCarouselCard
