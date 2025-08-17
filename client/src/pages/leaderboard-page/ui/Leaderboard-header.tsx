import AuthorLikeColorSvg from '../../../components/author/author-like/svg/Author-like-color-svg'
import NoTextReviewSvg from '../../../components/review/svg/No-text-review-svg'
import TextReviewSvg from '../../../components/review/svg/Text-review-svg'
import LogoSmallSvg from '../../../components/svg/Logo-small-svg'
import PixelHeartFillSvg from '../../../components/svg/Pixel-heart-fill-svg'
import PixelHeartSvg from '../../../components/svg/Pixel-heart-svg'

const LeaderboardHeader = () => {
	return (
		<div className='bg-zinc-900 border border-white/10 p-[5px] h-[50px] rounded-xl items-stretch hidden xl:flex'>
			<div className='w-[67px] h-full bg-zinc-950 border border-white/10 rounded-lg flex items-center text-center justify-center mr-1'>
				#
			</div>

			<div className='w-[80px] h-full bg-zinc-950 border border-white/10 rounded-lg flex items-center text-center justify-center'>
				<LogoSmallSvg className='w-[30px] h-[20px]' />
			</div>

			<div className='w-[549px] ml-5 flex h-full items-center'>
				Пользователь
			</div>

			<div className='w-[80px] h-full bg-zinc-950 border border-white/10 rounded-lg flex items-center text-center justify-center mr-2'>
				<AuthorLikeColorSvg className='size-6.5' />
			</div>

			<div className='w-[100px] h-full bg-zinc-950 border border-white/10 rounded-lg flex items-center gap-2 text-center justify-center mr-2'>
				<TextReviewSvg className='size-5' />
				<NoTextReviewSvg className='size-5' />
			</div>

			<div className='w-[100px] h-full bg-zinc-950 border border-white/10 rounded-lg flex items-center gap-2 text-center justify-center mr-2'>
				<PixelHeartFillSvg className={'w-5 h-4.5'} />
				<PixelHeartSvg className={'w-5 h-4.5'} />
			</div>

			<div className='w-[160px]  h-full bg-zinc-950 border border-white/10 rounded-lg flex items-center text-center justify-center ml-auto'>
				Авторы
			</div>
		</div>
	)
}

export default LeaderboardHeader
