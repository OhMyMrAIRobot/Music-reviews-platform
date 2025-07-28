import { FC } from 'react'

interface IProps {
	className: string
}

const Loader: FC<IProps> = ({ className }) => {
	return (
		<div
			className={`${className} border-t-4 border-b-1 rounded-full animate-spin`}
		/>
	)
}

export default Loader
