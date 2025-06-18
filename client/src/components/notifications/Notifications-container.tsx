import { observer } from 'mobx-react-lite'
import { useStore } from '../../hooks/use-store'
import Notification from './Notification'

const NotificationsContainer = observer(() => {
	const { notificationStore } = useStore()

	return (
		<div className='fixed z-500 right-0 bottom-0 text-sm p-5 grid gap-3'>
			{notificationStore.notifications.map(notification => (
				<Notification
					key={notification.id}
					text={notification.text}
					isError={notification.isError}
					onClose={() => notificationStore.removeNotification(notification.id)}
				/>
			))}
		</div>
	)
})

export default NotificationsContainer
