import { FC } from 'react'

interface IProps {
	title: string
	isActive: boolean
	onClick: () => void
}

const ProfileSectionButton: FC<IProps> = ({ title, isActive, onClick }) => {
	return (
		<button
			onClick={onClick}
			className={`inline-flex items-center justify-center text-xs lg:text-sm font-semibold transition-colors duration-200 select-none h-8 lg:h-10 px-3 py-2 rounded-full lg:px-4 border border-white/20 cursor-pointer ${
				isActive ? 'bg-white text-zinc-900' : 'hover:bg-white/10'
			}`}
		>
			{title}
		</button>
	)
}

export default ProfileSectionButton
