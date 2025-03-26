import { FC } from 'react'

interface ILoginButtonProps {
	onClick: () => void
}

const LoginButton: FC<ILoginButtonProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='px-10 h-10 text-sm text-white font-semibold bg-secondary hover:bg-[#242527]/100 border border-slate-300/15 rounded-md cursor-pointer transition-colors'
		>
			Войти
		</button>
	)
}

export default LoginButton
