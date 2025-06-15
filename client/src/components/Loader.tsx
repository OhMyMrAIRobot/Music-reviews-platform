import { FC } from 'react'

interface IProps {
	className: string
}

const Loader: FC<IProps> = ({ className }) => {
	return (
		<div
			className={`mx-auto border-t-4 border-b-1 border-white rounded-full animate-spin ${className}`}
		></div>
	)
}

export default Loader
