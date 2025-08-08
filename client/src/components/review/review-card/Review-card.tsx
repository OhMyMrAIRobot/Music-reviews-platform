import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../../hooks/use-auth'
import useNavigationPath from '../../../hooks/use-navigation-path.ts'
import { useStore } from '../../../hooks/use-store'
import { IReview } from '../../../models/review/review.ts'
import MoveToSvg from '../../svg/Move-to-svg.tsx'
import SkeletonLoader from '../../utils/Skeleton-loader.tsx'
import ReviewHeader from './Review-header'
import ReviewLikes from './Review-likes'

interface IProps {
	review?: IReview
	isLoading: boolean
	storeToggle?: (reviewId: string, isFav: boolean) => Promise<string[]>
}

const ReviewCard: FC<IProps> = observer(
	({ review, isLoading, storeToggle }) => {
		const { authStore, notificationStore } = useStore()

		const { checkAuth } = useAuth()

		const { navigateToReleaseDetails } = useNavigationPath()

		const [toggling, setToggling] = useState<boolean>(false)
		const [show, setShow] = useState<boolean>(false)

		const isFav =
			review?.userFavReview?.some(item => item.userId === authStore.user?.id) ??
			false

		const toggleFavReview = async () => {
			setToggling(true)
			if (!checkAuth()) {
				setToggling(false)
				return
			}

			if (authStore.user?.id === review?.userId) {
				notificationStore.addErrorNotification(
					'Вы не можете отметить свою рецензию как понравившеюся!'
				)
				setToggling(false)
				return
			}

			if (!storeToggle || !review) {
				notificationStore.addErrorNotification('Произошла ошибка!')
				return
			}

			const errors = await storeToggle(review.id, isFav)

			if (errors.length === 0) {
				notificationStore.addSuccessNotification(
					isFav
						? 'Вы успешно убрали рецензию из списка понравившихся!'
						: 'Вы успешно добавили рецензию в список понравившихся!'
				)
			} else {
				errors.forEach(err => notificationStore.addErrorNotification(err))
			}

			setToggling(false)
		}

		return isLoading ? (
			<SkeletonLoader className='h-64 rounded-[15px] lg:rounded-[20px]' />
		) : (
			review && (
				<div className='bg-zinc-900 relative p-1.5 flex flex-col mx-auto border border-zinc-800 rounded-[15px] lg:rounded-[20px] w-full max-w-full min-w-0'>
					<ReviewHeader review={review} />

					<div className='max-h-30 h-full overflow-hidden px-1.5 text-white min-w-0'>
						<h6 className='text-base lg:text-lg mt-3 pb-3 font-semibold overflow-hidden text-ellipsis w-full max-w-full whitespace-nowrap'>
							{review.title}
						</h6>
						<p className='text-[15px] lg:text-base line-clamp-3 break-words overflow-hidden text-ellipsis text-wrap'>
							{review.text}
						</p>
					</div>

					<div className='mt-5 flex justify-between items-center pr-2.5'>
						<ReviewLikes
							toggling={toggling}
							isLiked={isFav}
							likesCount={review.favCount}
							toggleFavReview={toggleFavReview}
						/>

						<Link
							to={navigateToReleaseDetails(review.releaseId)}
							className='cursor-pointer hover:bg-white/10 size-8 lg:size-10 rounded-md flex items-center justify-center transition-all duration-200 relative'
							onMouseEnter={() => setShow(true)}
							onMouseLeave={() => setShow(false)}
						>
							<MoveToSvg className='size-6 text-zinc-400 stroke-white fill-zinc-400' />
							<div
								className={`absolute -top-10 left-1/1 -translate-x-1/1 bg-zinc-950 border-2 border-gray-600 rounded-xl text-white text-xs font-semibold px-3 py-2 shadow z-100 whitespace-nowrap transition-all duration-300 ${
									show ? 'opacity-100 visible' : 'opacity-0 invisible'
								}`}
							>
								Перейти к релизу
							</div>
						</Link>
					</div>
				</div>
			)
		)
	}
)

export default ReviewCard
