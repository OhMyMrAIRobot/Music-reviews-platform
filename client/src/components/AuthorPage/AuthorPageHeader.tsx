import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { useStore } from '../../hooks/use-store'
import { IAuthor } from '../../models/author/author'
import { AuthorTypesEnum } from '../../models/author/author-type'
import ArtistSvg from '../author/svg/Artist-svg'
import DesignerSvg from '../author/svg/Designer-svg'
import ProducerSvg from '../author/svg/Producer-svg'
import {
	ReleaseLikesSvgIcon,
	ToggleFavReleaseSvgIcon,
} from '../releasePage/releasePageSvgIcons'
import TooltipSpan from '../releasePage/tooltip/Tooltip-span'
import Tooltip from '../tooltip/Tooltip'

interface IProps {
	author: IAuthor
}

const AuthorPageHeader: FC<IProps> = observer(({ author }) => {
	const { checkAuth } = useAuth()
	const {
		authorPageStore,
		authStore,
		notificationStore: notificationsStore,
	} = useStore()

	const isLiked = author.user_fav_ids.some(
		val => val.userId === authStore.user?.id
	)

	const toggleFavAuthor = () => {
		if (!checkAuth()) return

		authorPageStore.toggleFavAuthor(author.id, isLiked).then(result => {
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: result.message,
				isError: !result.status,
			})
		})
	}

	return (
		<section className='relative w-full h-45 md:h-62 lg:h-125 rounded-2xl overflow-hidden bg-red-500'>
			<div className='size-full'>
				<div className='relative size-full overflow-hidden rounded-2xl z-10'>
					<img
						className='absolute size-full object-cover left-0 top-0 z-100'
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/authors/covers/${
							author.cover
						}`}
						alt='Author cover'
					/>
					<div className='absolute inset-2 bg-black/30 rounded-md'></div>

					{author.cover === '1.png' && (
						<div className='lg:size-50 overflow-hidden absolute left-3 top-3 lg:left-5 lg:top-5 rounded-full border border-zinc-700 z-100'>
							<img
								loading='lazy'
								decoding='async'
								src={`${
									import.meta.env.VITE_SERVER_URL
								}/public/authors/avatars/${author.img}`}
								className='size-full object-cover object-center'
							/>
						</div>
					)}

					<button
						onClick={toggleFavAuthor}
						className={`absolute top-3 right-3 z-1000 cursor-pointer inline-flex items-center justify-center border border-white/20 bg-zinc-950 size-10 lg:size-12 rounded-full ${
							isLiked ? 'text-pink-600' : 'text-white'
						}`}
					>
						<ToggleFavReleaseSvgIcon />
					</button>

					<div className='flex absolute bottom-10 left-10 gap-3 z-100'>
						<div className='bg-zinc-950 px-3 py-2 lg:px-5 lg:py-3 rounded-xl inline-flex items-center gap-2'>
							<h2 className='text-sm lg:text-4xl font-bold'>{author.name}</h2>
							{author.author_types.map(type => (
								<TooltipSpan
									tooltip={
										<Tooltip>
											<span>{type.type}</span>
										</Tooltip>
									}
									spanClassName='text-white relative'
									key={type.type}
								>
									{(() => {
										switch (type.type) {
											case AuthorTypesEnum.ARTIST:
												return <ArtistSvg className={'size-7'} />
											case AuthorTypesEnum.PRODUCER:
												return <ProducerSvg className={'size-7'} />
											case AuthorTypesEnum.DESIGNER:
												return <DesignerSvg className={'size-7'} />
											default:
												return null
										}
									})()}
								</TooltipSpan>
							))}
						</div>

						<TooltipSpan
							spanClassName='bg-zinc-950 px-3 py-1 lg:px-5 lg:py-3 rounded-xl items-center inline-flex gap-1 select-none relative'
							tooltip={
								<Tooltip>{'Количество добавлений в предпочтения'}</Tooltip>
							}
						>
							<div className='flex items-center gap-1'>
								<ReleaseLikesSvgIcon />
								<span className='leading-3'>{author.likes_count}</span>
							</div>
						</TooltipSpan>
					</div>
				</div>
			</div>
		</section>
	)
})

export default AuthorPageHeader
