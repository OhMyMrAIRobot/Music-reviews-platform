import { FC, ReactNode } from 'react'

interface IPopupProfileButtonProps {
	text: string
	icon?: ReactNode
	onClick: () => void
}

const PopupProfileButton: FC<IPopupProfileButtonProps> = ({ text, icon }) => (
	<button className='px-2 cursor-pointer text-zinc-400  hover:text-white transition-all'>
		<div className='px-3 py-1.5 hover:bg-white/5 flex w-full justify-between rounded-xl'>
			<p>{text}</p>
			<div className='flex items-center justify-center size-6'>{icon}</div>
		</div>
	</button>
)

export default PopupProfileButton
