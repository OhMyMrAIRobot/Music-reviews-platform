import { FC, useEffect, useState } from 'react'
import { CloseSvgIcon } from './NotificationSvgIcons'

interface INotificationProps {
	text: string
	isError: boolean
	onClose: () => void
}

const Notification: FC<INotificationProps> = ({ text, isError, onClose }) => {
	const [isExiting, setIsExiting] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsExiting(true)
			setTimeout(() => {
				onClose()
			}, 300)
		}, 5000)

		return () => clearTimeout(timer)
	}, [onClose])

	return (
		<div
			className={`w-[300px] text-sm font-medium flex justify-between gap-2 bg-gradient-to-br border rounded-xl py-2 px-4 bg-[#090909]/10 backdrop-blur-lg select-none ${
				isError
					? 'text-red-500 border-red-800 from-red-700/30'
					: 'text-green-500 border-green-800 from-green-700/30'
			} ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}
		>
			<p>{text}</p>
			<button
				onClick={() => {
					setIsExiting(true)
					setTimeout(() => onClose(), 300)
				}}
				className='size-3 cursor-pointer'
			>
				<CloseSvgIcon classname={''} />
			</button>
		</div>
	)
}

export default Notification
