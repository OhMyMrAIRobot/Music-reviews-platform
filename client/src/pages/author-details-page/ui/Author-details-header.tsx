import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import AuthorTypes from '../../../components/author/author-types/Author-types'
import ToggleFavButton from '../../../components/buttons/Toggle-fav-button'
import LikesCount from '../../../components/utils/Likes-count'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import { useAuth } from '../../../hooks/use-auth'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { IAuthor } from '../../../models/author/author'

interface IProps {
	author?: IAuthor
	isLoading: boolean
}

const AuthorDetailsHeader: FC<IProps> = observer(({ author, isLoading }) => {
	const { checkAuth } = useAuth()

	const { authorDetailsPageStore, authStore, notificationStore } = useStore()

	const { execute: toggle, isLoading: isToggling } = useLoading(
		authorDetailsPageStore.toggleFavAuthor
	)

	const isFav =
		author?.userFavAuthors?.some(val => val.userId === authStore.user?.id) ??
		false

	const toggleFavAuthor = async () => {
		if (!checkAuth() || !author) {
			return
		}

		const errors = await toggle(author.id, isFav)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				isFav
					? 'Вы убрали автора из списка понравившихся'
					: 'Вы добавили автора в список понравившихся!'
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	return isLoading ? (
		<SkeletonLoader className='relative w-full h-45 md:h-62 lg:h-125 rounded-2xl overflow-hidden' />
	) : (
		author && (
			<section className='relative w-full h-45 md:h-62 lg:h-125 rounded-2xl overflow-hidden'>
				<div className='size-full'>
					<div className='relative size-full overflow-hidden rounded-2xl z-10'>
						<img
							className='absolute size-full object-cover left-0 top-0 z-100 select-none'
							loading='lazy'
							decoding='async'
							src={`${import.meta.env.VITE_SERVER_URL}/public/authors/covers/${
								author.cover === ''
									? import.meta.env.VITE_DEFAULT_COVER
									: author.cover
							}`}
							alt={author.name}
						/>
						<div className='absolute inset-2 bg-black/20 rounded-md z-200 pointer-events-none'></div>

						{author.cover === '' && (
							<div className='size-25 lg:size-50 overflow-hidden absolute left-3 top-3 lg:left-5 lg:top-5 rounded-full border border-zinc-700 z-100'>
								<img
									loading='lazy'
									decoding='async'
									src={`${
										import.meta.env.VITE_SERVER_URL
									}/public/authors/avatars/${
										author.img === ''
											? import.meta.env.VITE_DEFAULT_AVATAR
											: author.img
									}`}
									className='size-full object-cover object-center select-none'
								/>
							</div>
						)}

						<ToggleFavButton
							onClick={toggleFavAuthor}
							isLiked={isFav}
							className='absolute top-3 right-3 z-300 size-10 lg:size-12'
							toggling={isToggling}
						/>

						<div className='flex absolute bottom-5 left-5 lg:bottom-10 lg:left-10 gap-3 z-300'>
							<div className='bg-zinc-950 px-3 py-2 lg:px-5 lg:py-3 rounded-xl inline-flex items-center gap-2'>
								<h2 className='text-sm lg:text-4xl font-bold'>{author.name}</h2>

								<AuthorTypes types={author.authorTypes} className='size-7' />
							</div>

							<div className='bg-zinc-950 px-3 py-1 lg:px-5 lg:py-3 rounded-xl items-center inline-flex'>
								<LikesCount count={author.favCount} />
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	)
})

export default AuthorDetailsHeader
