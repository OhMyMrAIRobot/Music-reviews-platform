import { FC } from 'react'

interface IProps {
	onClick: () => void
	title: string
}

const SubmitButton: FC<IProps> = ({ onClick, title }) => {
	return (
		<div className='pt-6 border-t border-white/5'>
			<button
				onClick={onClick}
				className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors text-black bg-white hover:bg-white/70 h-10 px-4 py-2 w-[150px] cursor-pointer'
			>
				{title}
			</button>
		</div>
	)
}

export default SubmitButton
