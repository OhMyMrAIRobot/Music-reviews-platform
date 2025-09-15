import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { AuthorConfirmationAPI } from '../../../api/author/author-confirmation-api'
import { authorConfirmationsKeys } from '../../../query-keys/author-confirmation-keys'
import AuthorConfirmationItem from './Author-confirmation-item'

interface IProps {
	show: boolean
}

const AuthorConfirmationTickets: FC<IProps> = ({ show }) => {
	const { data, isPending } = useQuery({
		queryKey: authorConfirmationsKeys.byCurrentUser(),
		queryFn: () => AuthorConfirmationAPI.fetchByUserId(),
		staleTime: 1000 * 60 * 5,
		enabled: show,
		refetchOnMount: 'always',
	})

	const items = data ?? []

	return (
		<div
			className={`grid gap-4 ${
				show ? '' : 'opacity-0 pointer-events-none duration-200 transition-all'
			}`}
		>
			{isPending
				? Array.from({ length: 5 }).map((_, idx) => (
						<AuthorConfirmationItem
							key={`Skeleton-author-confirm-${idx}`}
							isLoading={true}
						/>
				  ))
				: items.map(item => (
						<AuthorConfirmationItem
							key={item.id}
							isLoading={false}
							item={item}
						/>
				  ))}

			{!isPending && items.length === 0 && (
				<span className='text-center text-xl font-medium'>
					Заявки не найдены!
				</span>
			)}
		</div>
	)
}

export default AuthorConfirmationTickets
