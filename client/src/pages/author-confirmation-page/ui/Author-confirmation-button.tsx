import { FC } from 'react'

interface IProps {
	onClick: () => void
	isActive: boolean
	title: string
}

const AuthorConfirmationButton: FC<IProps> = ({ title, onClick, isActive }) => {
	return (
		<button
			onClick={onClick}
			className={`inline-flex items-center justify-center h-full rounded-sm cursor-pointer px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
				isActive ? 'text-white bg-zinc-950' : 'hover:bg-white/5'
			}`}
		>
			{title}
		</button>
	)
}

export default AuthorConfirmationButton
