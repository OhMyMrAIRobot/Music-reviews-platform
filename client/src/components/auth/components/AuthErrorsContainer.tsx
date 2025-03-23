import { FC } from 'react'
import AuthError from './AuthError'

interface IAuthErrorContainerProps {
	errors: string[]
}

const AuthErrorsContainer: FC<IAuthErrorContainerProps> = ({ errors }) => {
	return (
		<div className='grid gap-2'>
			{errors.map(error => (
				<AuthError key={error} text={error} />
			))}
		</div>
	)
}

export default AuthErrorsContainer
