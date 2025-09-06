import { FC, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface IProps {
	isOpen: boolean
	children: ReactNode
	onCancel: () => void
	isLoading?: boolean
}

const ModalOverlay: FC<IProps> = ({
	isOpen,
	onCancel,
	children,
	isLoading = false,
}) => {
	const [isVisible, setIsVisible] = useState(false)
	const [shouldRender, setShouldRender] = useState(false)

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget && !isLoading) {
			onCancel()
		}
	}

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			setShouldRender(true)
			setTimeout(() => setIsVisible(true), 20)
		} else {
			setIsVisible(false)
			const timer = setTimeout(() => {
				setShouldRender(false)
				document.body.style.overflow = ''
			}, 300)
			return () => {
				clearTimeout(timer)
				document.body.style.overflow = ''
			}
		}
	}, [isOpen])

	useEffect(() => {
		return () => {
			document.body.style.overflow = ''
		}
	}, [])

	if (!shouldRender) return null

	return createPortal(
		<div
			onClick={handleOverlayClick}
			className={`fixed inset-0 h-screen bg-black/40 flex items-center justify-center select-none transition-opacity duration-300 z-1000 backdrop-blur-sm ${
				isVisible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<div onClick={e => e.stopPropagation()} className='max-w-full'>
				{children}
			</div>
		</div>,
		document.body
	)
}

export default ModalOverlay
