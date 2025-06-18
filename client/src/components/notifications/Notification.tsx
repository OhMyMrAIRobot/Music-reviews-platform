import { FC, useEffect, useState } from 'react'
import CloseSvg from '../svg/Close-svg'

interface IProps {
	text: string
	isError: boolean
	onClose: () => void
}

const Notification: FC<IProps> = ({ text, isError, onClose }) => {
	const [isExiting, setIsExiting] = useState(false)

	const handleClose = () => {
		setIsExiting(true)
		setTimeout(() => onClose(), 300)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			handleClose()
		}, 4700)

		return () => clearTimeout(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div
			className={`w-[300px] text-sm font-medium flex justify-between gap-2 bg-gradient-to-br border rounded-xl py-2 px-4 bg-[#090909]/10 backdrop-blur-lg select-none ${
				isError
					? 'text-red-500 border-red-800 from-red-700/30'
					: 'text-green-500 border-green-800 from-green-700/30'
			} ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}
		>
			<p>{text}</p>
			<button onClick={handleClose} className='size-3 cursor-pointer'>
				<CloseSvg className={'size-4'} />
			</button>
		</div>
	)
}

export default Notification
