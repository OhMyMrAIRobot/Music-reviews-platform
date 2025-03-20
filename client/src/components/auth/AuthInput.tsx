import { FC } from 'react'

interface AuthInputProps {
	id: string
	placeholder: string
	type: string
	value: string
	setValue: (value: string) => void
}

const AuthInput: FC<AuthInputProps> = ({
	id,
	placeholder,
	type,
	value,
	setValue,
}) => {
	return (
		<input
			id={id}
			placeholder={placeholder}
			type={type}
			value={value}
			onChange={e => setValue(e.target.value)}
			className='w-full h-10 rounded-md border px-3 py-2 text-sm outline-none border-white/15 focus:border-white transition-colors'
		/>
	)
}

export default AuthInput
