import { FC } from 'react'

interface IAuthErrorProps {
	text: string
}

const AuthError: FC<IAuthErrorProps> = ({ text }) => {
	return (
		<div className='text-red-500 text-sm bg-gradient-to-br border border-red-800 rounded-md px-2 py-1 from-red-700/30'>
			{text}
		</div>
	)
}

export default AuthError
