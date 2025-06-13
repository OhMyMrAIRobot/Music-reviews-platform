import { FC, ReactNode } from 'react'

interface IProps {
	children: ReactNode
}

const Tooltip: FC<IProps> = ({ children }) => {
	return (
		<div
			className={`bg-primary border-2 border-gray-600 rounded-lg text-white text-xs font-extrabold px-3 py-1 md:max-w-45 lg:max-w-full lg:whitespace-nowrap`}
		>
			{children}
		</div>
	)
}

export default Tooltip
