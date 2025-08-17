import { FC, useEffect } from 'react'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import AuthorConfirmationItem from './Author-confirmation-item'

interface IProps {
	show: boolean
}

const AuthorConfirmationTickets: FC<IProps> = ({ show }) => {
	const { authorConfirmationPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorConfirmationPageStore.fetchAuthorConfirmationsByUserId
	)

	useEffect(() => {
		fetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [show])

	return (
		<div
			className={`grid gap-4 ${
				show ? '' : 'opacity-0 pointer-events-none duration-200 transition-all'
			}`}
		>
			{isLoading
				? Array.from({ length: 5 }).map((_, idx) => (
						<AuthorConfirmationItem
							key={`Skeleton-author-confirm-${idx}`}
							isLoading={true}
						/>
				  ))
				: authorConfirmationPageStore.authorConfirmations.map(item => (
						<AuthorConfirmationItem
							key={item.id}
							isLoading={false}
							item={item}
						/>
				  ))}
		</div>
	)
}

export default AuthorConfirmationTickets
