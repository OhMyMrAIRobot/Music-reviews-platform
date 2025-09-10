import { FC } from 'react'
import TrashSvg from '../../../../../components/svg/Trash-svg'
import Loader from '../../../../../components/utils/Loader'

interface IProps {
	title: string
	disabled: boolean
	isLoading: boolean
	onClick: () => void
}

const ReleaseDetailsEstimationDeleteButton: FC<IProps> = ({
	title,
	disabled,
	isLoading,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`w-full inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-white/5 hover:bg-red-500 text-white h-10 px-6 py-2 space-x-2 text-xs lg:text-sm cursor-pointer transition-colors duration-200 ${
				disabled ? 'opacity-60 pointer-events-none' : ''
			}`}
		>
			{isLoading ? (
				<Loader className={'size-4'} />
			) : (
				<TrashSvg className='size-4' />
			)}

			<span>{title}</span>
		</button>
	)
}

export default ReleaseDetailsEstimationDeleteButton
