import { FC } from 'react'

interface IProps {
	text: string
}

const ReviewToolTip: FC<IProps> = ({ text }) => {
	return (
		<div
			className={`bg-primary border-2 border-gray-600 rounded-full text-white text-xs font-extrabold px-2 py-1 whitespace-nowrap`}
		>
			{text}
		</div>
	)
}

export default ReviewToolTip
