import { FC } from 'react'
import { createPortal } from 'react-dom'
import FormButton from '../form-elements/Form-button'
import CloseSvg from '../svg/Close-svg'
import ModalOverlay from './Modal-overlay'

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
	return createPortal(
		<ModalOverlay isOpen={isOpen} onCancel={onCancel}>
			<div
				className={`relative rounded-lg px-6 pb-6 pt-8 w-80 border border-white/10 bg-zinc-950 grid gap-6 transition-transform duration-300`}
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
		</ModalOverlay>,
		document.body
	)
}

export default ConfirmationModal
