import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { IAuthorConfirmation } from '../../../../../models/author/author-confirmation/author-confirmation'

interface IProps {
	className?: string
	item?: IAuthorConfirmation
	isLoading: boolean
	position?: number
	refetch?: () => void
}

const AdminDashboardAuthorConfirmationGridItem: FC<IProps> = observer(() => {
	return <div></div>
})

export default AdminDashboardAuthorConfirmationGridItem
