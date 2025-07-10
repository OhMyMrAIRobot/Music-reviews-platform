import { FC, useEffect, useState } from 'react'
import TickSvg from '../svg/Tick-svg'
import FormInput from './Form-input'
import FormLabel from './Form-label'

interface IProps {
	label: string
	initialValue: string
	onClick: (val: string) => void
	isLoading: boolean
	isRequired?: boolean
}

const FormInputWithConfirmation: FC<IProps> = ({
	label,
	initialValue,
	onClick,
	isLoading,
	isRequired = false,
}) => {
	const [value, setValue] = useState<string>(initialValue)
	const [show, setShow] = useState<boolean>(false)

	useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	useEffect(() => {
		setTimeout(() => setShow(true), 300)
	}, [])

	return (
		<div className='w-full flex items-end justify-end gap-x-1'>
			<div className={`grid gap-2 w-full`}>
				<FormLabel
					name={label}
					htmlFor={`form-input-confirm-${label}`}
					isRequired={isRequired}
				/>

				<FormInput
					id={`form-input-confirm-${label}`}
					placeholder={label}
					type={'text'}
					value={value}
					setValue={setValue}
				/>
			</div>

			<button
				disabled={isLoading}
				onClick={() => onClick(value)}
				className={`absolute flex ml-auto size-10 items-center justify-center cursor-pointer overflow-hidden p-1.5 select-none ${
					isLoading ? 'pointer-events-none' : ''
				} ${value === initialValue ? 'animate-slideOut' : 'animate-slideIn'}`}
			>
				<div
					className={`relative bg-green-500 flex items-center justify-center size-full rounded-md hover:bg-green-500/85 duration-200 ${
						isLoading ? 'opacity-50' : ''
					} ${show ? '' : 'opacity-0'}`}
				>
					<TickSvg className={'size-5'} />
				</div>
			</button>
		</div>
	)
}

export default FormInputWithConfirmation
