import { FC } from 'react'
import MoveToSvg from '../../../components/svg/Move-to-svg'

interface IProps {
	onClick: () => void
}

const AdminNavigateButton: FC<IProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-white hover:border-white/70 transition-colors duration-200'
		>
			<MoveToSvg className={'size-4'} />
		</button>
	)
}

export default AdminNavigateButton
