import { FC, ReactNode } from 'react'

interface IAuthInfoContainerProps {
	children: ReactNode
}

const AuthInfoContainer: FC<IAuthInfoContainerProps> = ({ children }) => {
	return <div className='grid gap-2'>{children}</div>
}

export default AuthInfoContainer
