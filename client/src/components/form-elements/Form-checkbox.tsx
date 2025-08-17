import { FC } from 'react'
import TickSvg from '../svg/Tick-svg'

interface IProps {
	id: string
	checked: boolean
	setChecked: (value: boolean) => void
}

const FormCheckbox: FC<IProps> = ({ id, checked, setChecked }) => {
	return (
		<button
			className={`min-w-4 size-4 rounded-sm border border-white/80 hover:border-white transition-all duration-200 flex items-center justify-center cursor-pointer ${
				checked ? 'bg-white hover:opacity-80' : 'bg-transparent'
			}`}
			onClick={() => setChecked(!checked)}
		>
			<input
				id={id}
				type='checkbox'
				checked={checked}
				onChange={() => setChecked(!checked)}
				className='hidden'
			/>
			{checked && <TickSvg className='text-black size-3.5' />}
		</button>
	)
}

export default FormCheckbox
