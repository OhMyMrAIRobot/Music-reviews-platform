import { FC, ReactNode } from 'react'

interface IProps {
	children: ReactNode
}

const FormInfoContainer: FC<IProps> = ({ children }) => {
	return <div className='grid gap-2'>{children}</div>
}

export default FormInfoContainer
