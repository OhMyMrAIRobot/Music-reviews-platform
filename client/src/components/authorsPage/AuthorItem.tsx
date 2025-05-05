import { FC } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { IAuthorData } from '../../models/author/AuthorsResponse'
import { AuthorTypesEnum } from '../../models/author/AuthorTypes'
import { ReleaseRatingTypesEnum } from '../../models/release/ReleaseRatingTypes'
import { ReleaseTypesEnum } from '../../models/release/ReleaseTypes'
import { ReleaseLikesSvgIcon } from '../releasePage/releasePageSvgIcons'
import TooltipSpan from '../releasePage/tooltip/TooltipSpan'
import { AlbumSvgIcon, SingleSvgIcon } from '../svg/ReleaseSvgIcons'
import AuthorCircleRating from './AuthorCircleRating'
import { ArtistSvgIcon, DesignerSvgIcon, ProducerSvgIcon } from './AuthorSvg'

export const ToolTip: FC<{ text: string }> = ({ text }) => {
	return (
		<div
			className={`bg-primary border-2 border-gray-600 rounded-lg text-white text-xs font-extrabold px-3 py-1 xs:max-w-30 md:max-w-45 lg:max-w-full lg:whitespace-nowrap`}
		>
			{text}
		</div>
	)
}

interface IProps {
	author: IAuthorData
}

const AuthorItem: FC<IProps> = ({ author }) => {
	const { navigateToAuthor } = useCustomNavigate()

	const trackRatings = author.release_type_stats.find(
		r => r.type === ReleaseTypesEnum.SINGLE
	)

	const albumRatings = author.release_type_stats.find(
		r => r.type === ReleaseTypesEnum.ALBUM
	)

	return (
		<button
			onClick={() => navigateToAuthor(author.id)}
			className='border border-white/10 bg-zinc-900 shadow-sm p-3 rounded-2xl text-center cursor-pointer select-none flex flex-col gap-y-2'
		>
			<div className='aspect-square max-w-30 md:max-w-45 w-full mx-auto relative rounded-full overflow-hidden'>
				<img
					alt={author.name}
					decoding='async'
					loading='lazy'
					src={`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
						author.img
					}`}
				/>
			</div>

			<div className='text-sm md:text-xl font-semibold flex items-center justify-center gap-x-1'>
				<span>{author.name}</span>
				{author.author_types.map(type => (
					<TooltipSpan
						tooltip={<ToolTip text={type.type} />}
						spanClassName='text-white'
						key={type.type}
					>
						{(() => {
							switch (type.type) {
								case AuthorTypesEnum.ARTIST:
									return <ArtistSvgIcon />
								case AuthorTypesEnum.PRODUCER:
									return <ProducerSvgIcon />
								case AuthorTypesEnum.DESIGNER:
									return <DesignerSvgIcon />
								default:
									return null
							}
						})()}
					</TooltipSpan>
				))}
			</div>

			<TooltipSpan
				tooltip={<ToolTip text={'Количество добавлений в предпочтения'} />}
				spanClassName='text-white'
			>
				<div className='flex gap-x-1 items-center justify-center font-medium'>
					<ReleaseLikesSvgIcon />
					<span>{author.likes_count}</span>
				</div>
			</TooltipSpan>

			{trackRatings && (
				<div className='flex items-center justify-center text-sm gap-x-2'>
					<SingleSvgIcon classname='size-5' />
					<AuthorCircleRating
						rating={trackRatings.ratings.super_user}
						ratingType={ReleaseRatingTypesEnum.SUPER_USER}
						releaseType={ReleaseTypesEnum.SINGLE}
					/>
					<AuthorCircleRating
						rating={trackRatings.ratings.with_text}
						ratingType={ReleaseRatingTypesEnum.WITH_TEXT}
						releaseType={ReleaseTypesEnum.SINGLE}
					/>
					<AuthorCircleRating
						rating={trackRatings.ratings.no_text}
						ratingType={ReleaseRatingTypesEnum.NO_TEXT}
						releaseType={ReleaseTypesEnum.SINGLE}
					/>
				</div>
			)}

			{albumRatings && (
				<div className='flex items-center justify-center text-sm gap-x-2'>
					<AlbumSvgIcon classname='size-5' />
					<AuthorCircleRating
						rating={albumRatings.ratings.super_user}
						ratingType={ReleaseRatingTypesEnum.SUPER_USER}
						releaseType={ReleaseTypesEnum.ALBUM}
					/>
					<AuthorCircleRating
						rating={albumRatings.ratings.with_text}
						ratingType={ReleaseRatingTypesEnum.WITH_TEXT}
						releaseType={ReleaseTypesEnum.ALBUM}
					/>
					<AuthorCircleRating
						rating={albumRatings.ratings.no_text}
						ratingType={ReleaseRatingTypesEnum.NO_TEXT}
						releaseType={ReleaseTypesEnum.ALBUM}
					/>
				</div>
			)}
		</button>
	)
}

export default AuthorItem
