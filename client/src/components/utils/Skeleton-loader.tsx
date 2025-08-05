import { FC, ReactNode } from 'react'

interface IProps {
	className: string
	children?: ReactNode
}

const SkeletonLoader: FC<IProps> = ({ className, children }) => {
	return (
		<div className={`bg-gray-400 animate-pulse opacity-40 ${className}`}>
			{children}
		</div>
	)
}

export default SkeletonLoader
