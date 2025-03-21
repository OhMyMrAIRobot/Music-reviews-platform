import { FC } from 'react'

interface IRegisterButtonProps {
	onClick: () => void
}

const RegisterButton: FC<IRegisterButtonProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='px-6 h-10 text-sm text-black font-semibold bg-white rounded-md cursor-pointer'
		>
			Регистрация
		</button>
	)
}

export default RegisterButton
