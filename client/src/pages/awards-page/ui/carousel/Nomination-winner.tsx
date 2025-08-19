import { FC } from 'react'
import { Link } from 'react-router'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { NominationTypesEnum } from '../../../../models/nomination/nomination-type/nomination-type-enum'
import { INominationWinner } from '../../../../models/nomination/nomination-winner/nomination-winner'

interface IProps {
	item?: INominationWinner
	isLoading: boolean
}

const NominationWinner: FC<IProps> = ({ item, isLoading }) => {
	const { navigateToReleaseDetails, navigateToAuthorDetails } =
		useNavigationPath()

	const { VITE_SERVER_URL, VITE_DEFAULT_AVATAR, VITE_DEFAULT_COVER } =
		import.meta.env

	const imgPath = item
		? `${VITE_SERVER_URL}/public/${
				item.entityKind === 'author'
					? `authors/avatars/${item.author.avatarImg || VITE_DEFAULT_AVATAR}`
					: `releases/${item.release.img || VITE_DEFAULT_COVER}`
		  }`
		: ''

	return isLoading || !item ? (
		<SkeletonLoader className={'w-full h-100 rounded-[26px]'} />
	) : (
		<Link
			to={
				item.entityKind === 'author'
					? navigateToAuthorDetails(item.entityId)
					: navigateToReleaseDetails(item.entityId)
			}
			className='size-full relative group'
		>
			<img
				alt='blur-img'
				loading='lazy'
				decoding='async'
				data-nimg='1'
				className='blur-[32px] opacity-30 absolute -z-10 bottom-[60px] right-5 max-lg:hidden w-[75%] h-[75%]'
				src={imgPath}
			/>
			<div className='bg-white/5 overflow-hidden p-2 max-lg:pb-3 lg:p-3 rounded-[26px] h-full relative flex flex-col border border-[rgba(255,255,255,0.06)] text-center transition-all duration-200 ease-in lg:hover:scale-[1.02] group'>
				<div className='relative mb-3 transition-all duration-200 ease-in lg:group-hover:scale-[1.1] lg:group-hover:translate-y-[-7px]'>
					<img
						alt={item.type}
						loading='lazy'
						decoding='async'
						src={imgPath}
						className={
							'rounded-[17px] transition-all duration-500 lg:group-hover:rounded-[25px] w-full aspect-square'
						}
					/>
				</div>

				<div className='h-full flex flex-col items-center justify-center'>
					<span className='text-base lg:text-[22px] font-semibold tracking-tighter leading-6'>
						{item.entityKind === 'author'
							? item.author.name
							: item.release.title}
					</span>
					{item.entityKind === 'release' && (
						<span className='text-base text-white opacity-40 font-medium mt-0.5'>
							{item.type === NominationTypesEnum.COVER_OF_MONTH
								? item.release.designers.join(', ')
								: item.release.artists.join(', ')}
						</span>
					)}
				</div>

				<div className='uppercase text-[13px] lg:text-lg font-medium border-t border-[rgba(255,255,255,0.1)] mt-3 shrink-0 flex items-center flex-col justify-center pt-3'>
					{item.type}
				</div>
			</div>
		</Link>
	)
}

export default NominationWinner
