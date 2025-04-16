import { FC } from 'react'

interface IProps {
	size?: number
}

const Loader: FC<IProps> = ({ size = 20 }) => {
	return (
		<div
			className={`size-${size} mx-auto border-t-4 border-b-1 border-white rounded-full animate-spin`}
		></div>
	)
}

export default Loader
