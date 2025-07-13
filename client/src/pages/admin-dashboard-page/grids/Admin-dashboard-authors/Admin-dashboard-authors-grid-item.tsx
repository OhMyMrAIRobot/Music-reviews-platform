import { FC, useState } from 'react'
import AuthorTypeSvg from '../../../../components/author/author-types/Author-type-svg'
import ConfirmationModal from '../../../../components/modals/Confirmation-modal'
import { IAdminAuthor } from '../../../../models/author/admin-authors-response'
import { getAuthorTypeColor } from '../../../../utils/get-author-type-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminEditButton from '../../buttons/Admin-edit-button'

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
	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)

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
								}/public/authors/avatars/${author.avatarImg}`}
								alt={author.name}
								className='size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='font-medium'>{author.name}</span>
						</>
					) : (
						'Имя автора'
					)}
				</div>

				<div className='col-span-5 flex'>
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

				<div className='col-span-1'>
					{author ? (
						<div className='flex gap-x-3 justify-end'>
							<AdminEditButton onClick={() => {}} />
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

export default AdminDashboardAuthorsGridItem
