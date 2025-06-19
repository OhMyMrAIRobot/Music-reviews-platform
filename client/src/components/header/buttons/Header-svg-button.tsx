import { FC, ReactNode } from 'react'

interface IProps {
	title: string
	onClick: () => void
	children?: ReactNode
}

const HeaderSvgButton: FC<IProps> = ({ title, onClick, children }) => {
	return (
		<button
			className='flex h-10 px-4 items-center justify-center rounded-md text-sm font-medium border border-white/15 cursor-pointer select-none transition-colors duration-200 hover:bg-white/15'
			onClick={onClick}
		>
			{children}
			<span className='hidden xl:block xl:ml-2'>{title}</span>
		</button>
	)
}

export default HeaderSvgButton
