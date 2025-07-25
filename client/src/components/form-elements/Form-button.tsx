import { FC } from 'react'

interface IProps {
	title: string
	isInvert: boolean
	onClick: () => void
	disabled: boolean
}

const FormButton: FC<IProps> = ({ title, isInvert, onClick, disabled }) => {
	const handleClick = () => {
		if (!disabled) {
			onClick()
		}
	}

	return (
		<button
			onClick={handleClick}
			disabled={disabled}
			className={`border border-white/10 rounded-md text-sm px-4 py-2 h-10 font-medium transition-colors duration-200 select-none w-full ${
				disabled
					? 'opacity-50 pointer-events-none'
					: 'opacity-100 cursor-pointer'
			} ${
				isInvert
					? 'bg-white text-black hover:bg-white/80 '
					: 'bg-zinc-950 text-white hover:bg-white/10'
			}`}
		>
			{title}
		</button>
	)
}

export default FormButton
