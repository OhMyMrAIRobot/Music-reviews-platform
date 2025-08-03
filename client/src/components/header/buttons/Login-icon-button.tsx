import { FC } from 'react'
import LoginSvg from '../svg/Login-svg'

interface IProps {
	onClick?: () => void
}

const LoginIconButton: FC<IProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='flex justify-center items-center rounded-md text-sm font-medium bg-white/5 border border-white/10 size-10'
		>
			<LoginSvg className={'size-5'} />
		</button>
	)
}

export default LoginIconButton
