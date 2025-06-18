import { FC } from 'react'

interface IProps {
	text: string
	isError: boolean
}

const FormInfoField: FC<IProps> = ({ text, isError }) => {
	return (
		<div
			className={`text-sm bg-gradient-to-br border rounded-md px-2 py-1 ${
				isError
					? 'text-red-500 border-red-800 from-red-700/30'
					: 'text-green-500 border-green-800 from-green-700/30'
			}`}
		>
			{text}
		</div>
	)
}

export default FormInfoField
