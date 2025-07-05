import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import FormButton from '../form-elements/Form-button'
import CloseSvg from '../svg/Close-svg'

interface IProps {
	title: string
	isOpen: boolean
	onConfirm: () => void
	onCancel: () => void
}

const ConfirmationModal: FC<IProps> = ({
	title,
	isOpen,
	onConfirm,
	onCancel,
}) => {
	const [isVisible, setIsVisible] = useState(false)
	const [shouldRender, setShouldRender] = useState(false)

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onCancel()
		}
	}

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true)
			setTimeout(() => setIsVisible(true), 20)
		} else {
			setIsVisible(false)
			const timer = setTimeout(() => setShouldRender(false), 300)
			return () => clearTimeout(timer)
		}
	}, [isOpen])

	if (!shouldRender) return null

	return createPortal(
		<div
			onClick={handleOverlayClick}
			className={`fixed inset-0 w-screen h-screen bg-black/80 flex items-center justify-center select-none transition-opacity duration-300 ${
				isVisible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<div
				onClick={e => e.stopPropagation()}
				className={`relative rounded-lg px-6 pb-6 pt-8 w-80 border border-white/10 bg-zinc-950 grid gap-6 transition-transform duration-300 ${
					isVisible ? 'scale-100' : 'scale-95'
				}`}
			>
				<button
					onClick={onCancel}
					className='absolute p-1 top-3 right-3 bg-zinc-900 rounded-full cursor-pointer text-white/60 hover:text-white transition-colors duration-200'
				>
					<CloseSvg className={'size-4'} />
				</button>

				<h3 className='text-lg text-center font-bold'>{title}</h3>
				<div className='grid gap-2'>
					<FormButton
						title={'Подтвердить'}
						isInvert={true}
						onClick={onConfirm}
						disabled={false}
					/>
					<FormButton
						title={'Отменить'}
						isInvert={false}
						onClick={onCancel}
						disabled={false}
					/>
				</div>
			</div>
		</div>,
		document.body
	)
}

export default ConfirmationModal
