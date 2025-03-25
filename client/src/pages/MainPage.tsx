import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import NotificationContainer from '../components/notifications/NotificationContainer'
import { UseStore } from '../hooks/UseStore'

const MainPage = observer(() => {
	const { notificationsStore } = UseStore()
	const [count, setCount] = useState(0)

	return (
		<>
			<div className='size-full bg-primary h-[1000px]'>
				<button
					onClick={() => {
						notificationsStore.addNotification({
							id: self.crypto.randomUUID(),
							text: 'This is a notification!' + count,
							isError: false,
						})
						setCount(count + 1)
					}}
				>
					main MainPage
				</button>
				<NotificationContainer />
			</div>
		</>
	)
})

export default MainPage
