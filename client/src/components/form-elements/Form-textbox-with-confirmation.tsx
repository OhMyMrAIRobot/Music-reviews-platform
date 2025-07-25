import { FC, useEffect, useState } from 'react'
import TickSvg from '../svg/Tick-svg'
import FormLabel from './Form-label'
import FormTextbox from './Form-textbox'

interface IProps {
	label: string
	initialValue: string
	onClick: (val: string) => void
	isLoading: boolean
	isRequired?: boolean
}

const FormTextboxWithConfirmation: FC<IProps> = ({
	label,
	initialValue,
	onClick,
	isLoading,
	isRequired,
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
					name={'Описание'}
					htmlFor={`form-text-confirm-${label}`}
					isRequired={isRequired}
				/>

				<FormTextbox
					id={`form-text-confirm-${label}`}
					placeholder={label}
					value={value}
					setValue={setValue}
					className='h-30'
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

export default FormTextboxWithConfirmation
