import { FC, ReactNode } from 'react'

interface IProps {
	onClick: () => void
	children: ReactNode
	disabled?: boolean
}

const AdminSvgButton: FC<IProps> = ({
	onClick,
	children,
	disabled = false,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`border border-white/15 size-8 flex items-center justify-center rounded-lg text-white/70 transition-colors duration-200 ${
				disabled
					? 'cursor-not-allowed opacity-45'
					: 'hover:text-white hover:border-white/70 cursor-pointer'
			}`}
		>
			{children}
		</button>
	)
}

export default AdminSvgButton
