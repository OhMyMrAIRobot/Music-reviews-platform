import { FC } from 'react'

interface IProps {
	onClick: () => void
}

const SubmitButton: FC<IProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors text-black bg-white hover:bg-white/70 h-10 px-4 py-2 w-[150px] cursor-pointer'
		>
			Отправить
		</button>
	)
}

export default SubmitButton
