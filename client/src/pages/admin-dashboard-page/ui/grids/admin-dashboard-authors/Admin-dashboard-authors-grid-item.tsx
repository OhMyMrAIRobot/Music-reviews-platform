import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import { AuthorAPI } from '../../../../../api/author/author-api.ts'
import AuthorTypeSvg from '../../../../../components/author/author-types/Author-type-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import useNavigationPath from '../../../../../hooks/use-navigation-path.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { IAdminAuthor } from '../../../../../models/author/admin-author/admin-author.ts'
import {} from '../../../../../models/author/admin-author/admin-authors-response.ts'
import { authorsKeys } from '../../../../../query-keys/authors-keys.ts'
import { getAuthorTypeColor } from '../../../../../utils/get-author-type-color.ts'
import AdminDeleteButton from '../../buttons/Admin-delete-button.tsx'
import AdminEditButton from '../../buttons/Admin-edit-button.tsx'
import AdminNavigateButton from '../../buttons/Admin-navigate-button.tsx'
import AuthorFormModal from './Author-form-modal.tsx'

interface IProps {
	className?: string
	author?: IAdminAuthor
	isLoading: boolean
	position?: number
}

const AdminDashboardAuthorsGridItem: FC<IProps> = ({
	className = '',
	author,
	isLoading,
	position,
}) => {
	const { notificationStore } = useStore()

	const queryClient = useQueryClient()

	const { navigateToAuthorDetails } = useNavigationPath()

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModelOpen] = useState<boolean>(false)

	const deleteMutation = useMutation({
		mutationFn: (id: string) => AuthorAPI.deleteAuthor(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Вы успешно удалили автора!')
			queryClient.invalidateQueries({ queryKey: authorsKeys.all })
			setConfModalOpen(false)
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))

			setConfModalOpen(false)
		},
	})

	return isLoading ? (
		<SkeletonLoader className='w-full h-40 xl:h-12 rounded-lg' />
	) : (
		<>
			{author && (
				<>
					{confModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить автора?'}
							isOpen={confModalOpen}
							onConfirm={() => deleteMutation.mutate(author.id)}
							onCancel={() => setConfModalOpen(false)}
							isLoading={deleteMutation.isPending}
						/>
					)}

					{editModalOpen && (
						<AuthorFormModal
							isOpen={editModalOpen}
							onClose={() => setEditModelOpen(false)}
							author={author}
						/>
					)}
				</>
			)}
			<div
				className={`${className} relative text-sm xl:h-12 w-full rounded-lg grid grid-rows-4 xl:grid-rows-1 xl:grid-cols-12 items-center px-3 max-xl:py-2 border border-white/10 text-nowrap font-medium`}
			>
				<div className='xl:col-span-1 text-ellipsis line-clamp-1'>
					<span className='xl:hidden'># </span>
					{position ?? '#'}
				</div>

				{author && (
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
							author.avatarImg === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: author.avatarImg
						}`}
						alt={author.name}
						className='absolute top-0 right-0 size-22 rounded-lg object-cover aspect-square select-none xl:hidden'
					/>
				)}

				<div className='xl:col-span-5 h-full flex items-center gap-x-2 max-xl:max-w-[calc(100%-90px)]'>
					{author ? (
						<>
							<img
								loading='lazy'
								decoding='async'
								src={`${
									import.meta.env.VITE_SERVER_URL
								}/public/authors/avatars/${
									author.avatarImg === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: author.avatarImg
								}`}
								alt={author.name}
								className='size-9 object-cover aspect-square rounded-full select-none max-xl:hidden'
							/>
							<span className='overflow-hidden text-ellipsis text-wrap'>
								<span className='xl:hidden'>Имя: </span>
								<span>{author.name}</span>
							</span>
						</>
					) : (
						'Имя автора'
					)}
				</div>

				<div className='xl:col-span-4 flex flex-wrap'>
					{author ? (
						<>
							<span className='xl:hidden max-xl:pr-1'>Тип автора:</span>
							{author.types.map((type, idx) => (
								<span key={type.id} className='flex'>
									<span
										className={`flex items-center ${getAuthorTypeColor(
											type.type
										)}`}
									>
										<AuthorTypeSvg type={type} className={'size-5 mr-0.5'} />
										{type.type}
									</span>
									{idx < author.types.length - 1 && (
										<span className='mr-1 select-none'>,</span>
									)}
								</span>
							))}
						</>
					) : (
						'Тип автора'
					)}
				</div>

				<div className='xl:col-span-2 text-center max-xl:mt-1'>
					{author ? (
						<div className='flex gap-x-3 xl:justify-end'>
							<Link to={navigateToAuthorDetails(author.id)}>
								<AdminNavigateButton />
							</Link>
							<AdminEditButton onClick={() => setEditModelOpen(true)} />
							<AdminDeleteButton onClick={() => setConfModalOpen(true)} />
						</div>
					) : (
						<span className='text-center'>Действие</span>
					)}
				</div>
			</div>
		</>
	)
}

export default AdminDashboardAuthorsGridItem
