import { FC } from 'react'
import EditSvg from '../../../../components/svg/Edit-svg.tsx'

interface IProps {
	onClick: () => void
}

const AdminEditButton: FC<IProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-white hover:border-white/70 transition-colors duration-200'
		>
			<EditSvg className={'size-4'} />
		</button>
	)
}

export default AdminEditButton
