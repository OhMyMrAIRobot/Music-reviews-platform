import { FC } from 'react'
import { LoginSvgIcon } from '../HeaderSvgIcons'

interface ILoginIconButtonProps {
	onClick: () => void
}

const LoginIconButton: FC<ILoginIconButtonProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='flex justify-center items-center rounded-md text-sm font-medium bg-white/5 border border-white/10 size-10'
		>
			<LoginSvgIcon />
		</button>
	)
}

export default LoginIconButton
