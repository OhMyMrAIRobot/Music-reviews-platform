import { FC, ReactNode } from 'react'

interface IProps {
	text: string
	icon?: ReactNode
	onClick: () => void
}

const PopupProfileButton: FC<IProps> = ({ text, icon, onClick }) => (
	<button
		onClick={onClick}
		className='px-2 cursor-pointer text-zinc-400 hover:text-white transition-all'
	>
		<div className='px-3 py-1.5 hover:bg-white/5 flex w-full items-center justify-between rounded-lg'>
			<p>{text}</p>
			<div className='flex items-center justify-center size-7'>{icon}</div>
		</div>
	</button>
)

export default PopupProfileButton
