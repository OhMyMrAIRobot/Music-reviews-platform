import { FC, useState } from 'react'
import AuthorTypeSvg from '../../../../components/author/author-types/Author-type-svg'
import ConfirmationModal from '../../../../components/modals/Confirmation-modal'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { IAdminAuthor } from '../../../../models/author/admin-authors-response'
import { getAuthorTypeColor } from '../../../../utils/get-author-type-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminEditButton from '../../buttons/Admin-edit-button'
import AdminNavigateButton from '../../buttons/Admin-navigate-button'
import AuthorFormModal from './Author-form-modal'

interface IProps {
	className?: string
	author?: IAdminAuthor
	isLoading: boolean
	position?: number
	deleteAuthor?: () => void
}

const AdminDashboardAuthorsGridItem: FC<IProps> = ({
	className,
	author,
	isLoading,
	position,
	deleteAuthor,
}) => {
	const { navigateToAuthor } = useCustomNavigate()

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModelOpen] = useState<boolean>(false)

	const handleDelete = () => {
		if (deleteAuthor) {
			deleteAuthor()
		}
	}

	return isLoading ? (
		<div className='bg-gray-400 w-full h-12 rounded-lg animate-pulse opacity-40' />
	) : (
		<>
			{author && (
				<>
					<ConfirmationModal
						title={'Вы действительно хотите удалить автора?'}
						isOpen={confModalOpen}
						onConfirm={handleDelete}
						onCancel={() => setConfModalOpen(false)}
					/>

					<AuthorFormModal
						isOpen={editModalOpen}
						onClose={() => setEditModelOpen(false)}
						refetchAuthors={() => {}}
						author={author}
					/>
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
							<AdminNavigateButton
								onClick={() => navigateToAuthor(author.id)}
							/>
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
