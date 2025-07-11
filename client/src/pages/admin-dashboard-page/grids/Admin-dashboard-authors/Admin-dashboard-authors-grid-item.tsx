import { FC } from 'react'
import { IAdminAuthor } from '../../../../models/author/admin-authors-response'
import { getAuthorTypeColor } from '../../../../utils/get-author-type-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminEditButton from '../../buttons/Admin-edit-button'

interface IProps {
	className?: string
	author?: IAdminAuthor
	isLoading: boolean
	position?: number
}

const AdminDashboardAuthorsGridItem: FC<IProps> = ({
	className,
	author,
	isLoading,
	position,
}) => {
	return isLoading ? (
		<div className='bg-gray-400 w-full h-12 rounded-lg animate-pulse opacity-40' />
	) : (
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
							src={`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
								author.avatarImg
							}`}
							alt={author.name}
							className='size-9 aspect-square rounded-full select-none'
						/>
						<span className='font-medium'>{author.name}</span>
					</>
				) : (
					'Имя автора'
				)}
			</div>

			<div className='col-span-5 text-ellipsis line-clamp-1'>
				{author
					? author.types.map((type, idx) => (
							<span key={type.id}>
								<span
									className={`font-medium ${getAuthorTypeColor(type.type)}`}
								>
									{type.type}
								</span>
								{idx < author.types.length - 1 && ', '}
							</span>
					  ))
					: 'Тип автора'}
			</div>

			<div className='col-span-1'>
				{author ? (
					<div className='flex gap-x-3 justify-end'>
						<AdminEditButton onClick={() => {}} />
						<AdminDeleteButton onClick={() => {}} />
					</div>
				) : (
					'Действие'
				)}
			</div>
		</div>
	)
}

export default AdminDashboardAuthorsGridItem
