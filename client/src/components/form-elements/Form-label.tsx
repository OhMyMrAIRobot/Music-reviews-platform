import { FC } from 'react'

interface IProps {
	name: string
	htmlFor: string
	isRequired?: boolean
}

const FormLabel: FC<IProps> = ({ name, htmlFor, isRequired = true }) => {
	return (
		<label
			htmlFor={htmlFor}
			className='text-sm font-bold leading-none select-none inline-block'
		>
			{name}
			{isRequired && <span className='text-red-500'>{` *`}</span>}
		</label>
	)
}

export default FormLabel
