import { FC, useState } from 'react'
import { Link } from 'react-router'
import AuthorTypeSvg from '../../../../../components/author/author-types/Author-type-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import useNavigationPath from '../../../../../hooks/use-navigation-path.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { IAdminAuthor } from '../../../../../models/author/admin-author/admin-author.ts'
import {} from '../../../../../models/author/admin-author/admin-authors-response.ts'
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
	refetchAuthors?: () => void
}

const AdminDashboardAuthorsGridItem: FC<IProps> = ({
	className,
	author,
	isLoading,
	position,
	refetchAuthors,
}) => {
	const { adminDashboardAuthorsStore, notificationStore } = useStore()

	const { navigateToAuthorDetails } = useNavigationPath()

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModelOpen] = useState<boolean>(false)

	const handleRefetch = () => {
		if (refetchAuthors) {
			refetchAuthors()
		}
	}

	const { execute: deleteAuthor, isLoading: isDeleting } = useLoading(
		adminDashboardAuthorsStore.deleteAuthor
	)

	const handleDelete = async (id: string) => {
		if (isDeleting) return

		const result = await deleteAuthor(id)
		if (result.length === 0) {
			notificationStore.addSuccessNotification('Вы успешно удалили автора!')
			handleRefetch()
		} else {
			result.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	return isLoading ? (
		<SkeletonLoader className='w-full h-12 rounded-lg' />
	) : (
		<>
			{author && (
				<>
					{confModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить автора?'}
							isOpen={confModalOpen}
							onConfirm={() => handleDelete(author.id)}
							onCancel={() => setConfModalOpen(false)}
							isLoading={isDeleting}
						/>
					)}

					{editModalOpen && (
						<AuthorFormModal
							isOpen={editModalOpen}
							onClose={() => setEditModelOpen(false)}
							refetchAuthors={() => {}}
							author={author}
						/>
					)}
				</>
			)}
			<div
				className={`${className} text-[10px] md:text-sm h-10 md:h-12 w-full rounded-lg grid grid-cols-10 lg:grid-cols-12 items-center px-3 border border-white/10 text-nowrap`}
			>
				<div className='col-span-1 text-ellipsis line-clamp-1'>
					{position ?? '#'}
				</div>

				<div className='col-span-5 text-ellipsis line-clamp-1 h-full flex items-center gap-x-2'>
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
								className='size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='font-medium'>{author.name}</span>
						</>
					) : (
						'Имя автора'
					)}
				</div>

				<div className='col-span-4 flex'>
					{author
						? author.types.map((type, idx) => (
								<span key={type.id} className='flex'>
									<span
										className={`font-medium flex items-center ${getAuthorTypeColor(
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
						  ))
						: 'Тип автора'}
				</div>

				<div className='col-span-2 text-center'>
					{author ? (
						<div className='flex gap-x-3 justify-end'>
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
