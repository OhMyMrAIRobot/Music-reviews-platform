import {
	useMutation,
	useQueryClient,
	type InvalidateQueryFilters,
} from '@tanstack/react-query'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import { AuthorCommentAPI } from '../../../../../api/author/author-comment-api'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useApiErrorHandler } from '../../../../../hooks/use-api-error-handler'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { useStore } from '../../../../../hooks/use-store'
import { authorCommentsKeys } from '../../../../../query-keys/author-comments-keys'
import { authorsKeys } from '../../../../../query-keys/authors-keys'
import { leaderboardKeys } from '../../../../../query-keys/leaderboard-keys'
import { platformStatsKeys } from '../../../../../query-keys/platform-stats-keys'
import { profilesKeys } from '../../../../../query-keys/profiles-keys'
import { releasesKeys } from '../../../../../query-keys/releases-keys'
import { AuthorComment } from '../../../../../types/author'
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum'
import { SortOrder } from '../../../../../types/common/types/sort-order'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminOpenButton from '../../buttons/Admin-open-button'
import AuthorCommentFormModal from './Author-comment-form-modal'

interface IProps {
	className?: string
	comment?: AuthorComment
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
}

const AdminDashboardAuthorCommentsGridItem: FC<IProps> = ({
	className = '',
	comment,
	isLoading,
	position,
	order,
	toggleOrder,
}) => {
	/** HOOKS */
	const { notificationStore } = useStore()
	const handleApiError = useApiErrorHandler()
	const { navigateToReleaseDetails, navigatoToProfile } = useNavigationPath()
	const queryClient = useQueryClient()

	/** STATES */
	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: authorCommentsKeys.all },
			{ queryKey: releasesKeys.all },
			{ queryKey: authorsKeys.all },
			{ queryKey: profilesKeys.all },
			{ queryKey: leaderboardKeys.all },
			{ queryKey: platformStatsKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Mutation to delete the author comment
	 */
	const deleteMutation = useMutation({
		mutationFn: (id: string) => AuthorCommentAPI.adminDelete(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили авторский комментарий!'
			)
			setConfModalOpen(false)

			invalidateRelatedQueries()
		},
		onError: (error: unknown) => {
			setConfModalOpen(false)
			handleApiError(error, 'Не удалось удалить авторский комментарий!')
		},
	})

	return isLoading ? (
		<SkeletonLoader className='w-full h-75 xl:h-12 rounded-lg' />
	) : (
		<>
			{comment && (
				<>
					{confModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить авторский комментарий?'}
							isOpen={confModalOpen}
							onConfirm={() => deleteMutation.mutate(comment.id)}
							onCancel={() => setConfModalOpen(false)}
							isLoading={deleteMutation.isPending}
						/>
					)}

					{editModalOpen && (
						<AuthorCommentFormModal
							isOpen={editModalOpen}
							onClose={() => setEditModalOpen(false)}
							comment={comment}
						/>
					)}
				</>
			)}

			<div
				className={`${className} text-sm font-medium xl:h-12 w-full rounded-lg grid grid-rows-7 xl:grid-rows-1 xl:grid-cols-12 items-center px-3 max-xl:py-2 border border-white/10 text-nowrap`}
			>
				<div className='xl:col-span-1 text-ellipsis line-clamp-1'>
					<span className='xl:hidden'># </span>
					{position ?? '#'}
				</div>

				<div className='xl:col-span-2 h-full flex items-center mr-2'>
					{comment ? (
						<Link
							to={navigatoToProfile(comment.user.id)}
							className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
									comment.user.avatar === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: comment.user.avatar
								}`}
								alt={comment.user.nickname}
								className='max-xl:hidden size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='xl:hidden'>Автор</span>
							<span className='line-clamp-2 max-xl:underline underline-offset-4 overflow-hidden text-ellipsis text-wrap'>
								{comment.user.nickname}
							</span>
						</Link>
					) : (
						<span className='px-2'>Автор</span>
					)}
				</div>

				<div className='xl:col-span-2 h-full flex items-center mr-2'>
					{comment ? (
						<Link
							to={navigateToReleaseDetails(comment.release.id)}
							className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
									comment.release.img === ''
										? import.meta.env.VITE_DEFAULT_COVER
										: comment.release.img
								}`}
								alt={comment.release.title}
								className='max-xl:hidden size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='xl:hidden'>Релиз: </span>
							<span className='line-clamp-2 max-xl:underline underline-offset-4 overflow-hidden text-ellipsis text-wrap'>
								{comment.release.title}
							</span>
						</Link>
					) : (
						<span className='px-2'>Релиз</span>
					)}
				</div>

				<div className='xl:col-span-2 text-ellipsis text-wrap xl:'>
					{comment ? (
						<>
							<span className='xl:hidden'>Дата публикации: </span>
							<span>{comment.createdAt}</span>
						</>
					) : (
						<button
							onClick={toggleOrder}
							className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
						>
							<span>Дата публикации</span>
							<ArrowBottomSvg
								className={`size-3 ${
									order === SortOrdersEnum.ASC ? 'rotate-180' : ''
								}`}
							/>
						</button>
					)}
				</div>

				<div className='xl:col-span-2 line-clamp-2 overflow-hidden text-ellipsis text-wrap mr-2'>
					{comment ? (
						<>
							<span className='xl:hidden'>Заголовок: </span>
							<span>{comment.title}</span>
						</>
					) : (
						<span>Заголовок</span>
					)}
				</div>

				<div className='xl:col-span-2 line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
					{comment ? (
						<>
							<span className='xl:hidden'>Комментарий: </span>
							<span>{comment.text}</span>
						</>
					) : (
						<span>Комментарий</span>
					)}
				</div>

				<div className='xl:col-span-1 max-xl:mt-1'>
					{comment ? (
						<div className='flex gap-x-3 xl:justify-end'>
							<AdminOpenButton
								onClick={() => {
									setEditModalOpen(true)
								}}
							/>
							<AdminDeleteButton onClick={() => setConfModalOpen(true)} />
						</div>
					) : (
						'Действие'
					)}
				</div>
			</div>
		</>
	)
}

export default AdminDashboardAuthorCommentsGridItem
