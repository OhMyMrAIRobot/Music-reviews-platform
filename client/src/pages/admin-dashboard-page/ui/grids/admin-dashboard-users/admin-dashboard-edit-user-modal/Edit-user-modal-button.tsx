import { FC, ReactNode } from 'react'
import Loader from '../../../../../../components/utils/Loader'

interface IProps {
	title: string
	onClick: () => void
	svg: ReactNode
	disabled: boolean
	isLoading?: boolean
}

const EditUserModalButton: FC<IProps> = ({
	title,
	onClick,
	svg,
	disabled,
	isLoading = false,
}) => {
	const handleClick = () => {
		if (!disabled) {
			onClick()
		}
	}

	return (
		<button
			disabled={disabled}
			onClick={handleClick}
			className={`h-8 px-3 text-sm font-medium border border-white/10 rounded-lg flex items-center justify-center gap-1 text-white/90  transition-all duration-200 ${
				disabled || isLoading
					? 'cursor-not-allowed opacity-70'
					: 'hover:text-white hover:bg-white/5 hover:border-white/15 cursor-pointer'
			}`}
		>
			{isLoading ? <Loader className={'size-3 border-white'} /> : svg}
			<span>{title}</span>
		</button>
	)
}

export default EditUserModalButton
