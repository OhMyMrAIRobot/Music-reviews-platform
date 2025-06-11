import { FC } from 'react'

interface IProps {
	title: string
	isInvert: boolean
	onClick: () => void
}

const FormButton: FC<IProps> = ({ title, isInvert, onClick }) => {
	return (
		<button
			onClick={onClick}
			className={`border border-white/10 rounded-md text-sm px-4 py-2 h-10 font-medium cursor-pointer transition-colors duration-200 select-none ${
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
