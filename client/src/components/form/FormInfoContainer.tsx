import { FC, ReactNode } from 'react'

interface IFormInfoContainerProps {
	children: ReactNode
}

const FormInfoContainer: FC<IFormInfoContainerProps> = ({ children }) => {
	return <div className='grid gap-2'>{children}</div>
}

export default FormInfoContainer
