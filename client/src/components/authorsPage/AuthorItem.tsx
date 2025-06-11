import { FC, ReactNode } from 'react'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { AuthorTypesEnum } from '../../models/author/author-type'
import { IAuthorData } from '../../models/author/authors-response'
import { ReleaseTypesEnum } from '../../models/release/release-types'
import { ReleaseLikesSvgIcon } from '../releasePage/releasePageSvgIcons'
import TooltipSpan from '../releasePage/tooltip/Tooltip-span'
import AuthorReleaseTypesRatings from './AuthorReleaseTypesRatings'
import { ArtistSvgIcon, DesignerSvgIcon, ProducerSvgIcon } from './AuthorSvg'

export const ToolTip: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<div
			className={`bg-primary border-2 border-gray-600 rounded-lg text-white text-xs font-extrabold px-3 py-1 xs:max-w-30 md:max-w-45 lg:max-w-full lg:whitespace-nowrap`}
		>
			{children}
		</div>
	)
}

interface IProps {
	author: IAuthorData
}

const AuthorItem: FC<IProps> = ({ author }) => {
	const { navigateToAuthor } = useCustomNavigate()

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
					className='size-full object-cover object-center'
				/>
			</div>

			<div className='text-sm md:text-xl font-semibold flex items-center justify-center gap-x-1'>
				<span>{author.name}</span>
				{author.author_types.map(type => (
					<TooltipSpan
						tooltip={<ToolTip>{type.type}</ToolTip>}
						spanClassName='text-white relative'
						key={type.type}
						centered={false}
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
				tooltip={<ToolTip>{'Количество добавлений в предпочтения'}</ToolTip>}
				spanClassName='text-white relative'
			>
				<div className='flex gap-x-1 items-center justify-center font-medium'>
					<ReleaseLikesSvgIcon />
					<span>{author.likes_count}</span>
				</div>
			</TooltipSpan>

			<AuthorReleaseTypesRatings
				releaseType={ReleaseTypesEnum.SINGLE}
				stats={author.release_type_stats}
			/>

			<AuthorReleaseTypesRatings
				releaseType={ReleaseTypesEnum.ALBUM}
				stats={author.release_type_stats}
			/>
		</button>
	)
}

export default AuthorItem
