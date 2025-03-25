import { observer } from 'mobx-react-lite'
import { UseStore } from '../../hooks/UseStore'
import Notification from './Notification'

const NotificationContainer = observer(() => {
	const { notificationsStore } = UseStore()

	return (
		<div className='fixed z-500 right-0 bottom-0 text-sm p-5 grid gap-3'>
			{notificationsStore.notifications.map(({ id, text, isError }) => (
				<Notification
					key={id}
					text={text}
					isError={isError}
					onClose={() => notificationsStore.removeNotification(id)}
				/>
			))}
		</div>
	)
})

export default NotificationContainer
