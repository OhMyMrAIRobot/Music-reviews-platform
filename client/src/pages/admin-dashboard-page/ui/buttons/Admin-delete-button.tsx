import { FC } from 'react'
import TrashSvg from '../../../../components/svg/Trash-svg.tsx'

interface IProps {
	onClick: () => void
}

const AdminDeleteButton: FC<IProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-red-500 hover:border-red-500 transition-colors duration-200'
		>
			<TrashSvg className={'size-4'} />
		</button>
	)
}

export default AdminDeleteButton
