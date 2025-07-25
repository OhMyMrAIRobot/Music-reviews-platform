import { FC } from 'react'

interface IProps {
	id: string
	placeholder: string
	value: string
	setValue: (value: string) => void
	className?: string
}

const FormTextbox: FC<IProps> = ({
	id,
	placeholder,
	value,
	setValue,
	className,
}) => {
	return (
		<textarea
			id={id}
			placeholder={placeholder}
			value={value}
			onChange={e => setValue(e.target.value)}
			className={`w-full rounded-md border px-3 py-2 text-sm outline-none border-white/15 focus:border-white transition-colors resize-none ${className}`}
		/>
	)
}

export default FormTextbox
