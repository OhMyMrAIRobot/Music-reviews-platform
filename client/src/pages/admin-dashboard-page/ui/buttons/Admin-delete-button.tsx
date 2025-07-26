import { FC } from 'react'
import TrashSvg from '../../../../components/svg/Trash-svg.tsx'
import Loader from '../../../../components/utils/Loader.tsx'

interface IProps {
	onClick: () => void
	isLoading?: boolean
}

const AdminDeleteButton: FC<IProps> = ({ onClick, isLoading = false }) => {
	return (
		<button
			onClick={onClick}
			className={`border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70  transition-colors duration-200 ${
				isLoading
					? 'opacity-50 cursor-not-allowed pointer-events-none'
					: 'hover:text-red-500 hover:border-red-500'
			}`}
		>
			{isLoading ? (
				<Loader className={'size-4'} />
			) : (
				<TrashSvg className={'size-4'} />
			)}
		</button>
	)
}

export default AdminDeleteButton
