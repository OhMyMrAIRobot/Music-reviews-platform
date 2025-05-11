import { FC } from 'react'

interface IFormTextboxProps {
	id: string
	placeholder: string
	value: string
	setValue: (value: string) => void
}

const FormTextbox: FC<IFormTextboxProps> = ({
	id,
	placeholder,
	value,
	setValue,
}) => {
	return (
		<textarea
			id={id}
			placeholder={placeholder}
			value={value}
			onChange={e => setValue(e.target.value)}
			className='w-full h-30 rounded-md border px-3 py-2 text-sm outline-none border-white/15 focus:border-white transition-colors resize-none'
		/>
	)
}

export default FormTextbox
