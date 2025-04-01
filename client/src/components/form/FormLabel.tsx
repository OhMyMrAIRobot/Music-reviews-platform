import { FC } from 'react'

interface IFormLabelProps {
	name: string
	htmlFor: string
}

const FormLabel: FC<IFormLabelProps> = ({ name, htmlFor }) => {
	return (
		<label
			htmlFor={htmlFor}
			className='text-sm font-bold leading-none select-none flex gap-0.5'
		>
			{name}
			<span className='text-red-500'>*</span>
		</label>
	)
}

export default FormLabel
