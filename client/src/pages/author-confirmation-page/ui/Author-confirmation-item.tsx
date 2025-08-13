import { FC } from 'react'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import { IAuthorConfirmation } from '../../../models/author-confirmation/author-confirmation'
import { getAuthorConfirmationStatusColor } from '../../../utils/get-author-confirmation-status-color'

interface IProps {
	isLoading: boolean
	item?: IAuthorConfirmation
}

const AuthorConfirmationItem: FC<IProps> = ({ isLoading, item }) => {
	return isLoading || !item ? (
		<SkeletonLoader className={'rounded-lg w-full h-30 lg:h-35'} />
	) : (
		<div className='w-full rounded-lg border border-white/15 flex flex-col gap-1 p-2  text-sm lg:text-base '>
			<span>Пользователь: {item.user.nickname}</span>
			<span>Автор: {item.author.name}</span>
			<span>
				Статус:{' '}
				<span
					className={`font-medium ${getAuthorConfirmationStatusColor(
						item.status.status
					)}`}
				>
					{item.status.status}
				</span>
			</span>
			<span>Подтверждение: {item.confirmation}</span>
			<span className='text-sm opacity-50'>{item.createdAt}</span>
		</div>
	)
}

export default AuthorConfirmationItem
