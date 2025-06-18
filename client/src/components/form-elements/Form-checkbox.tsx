import { FC } from 'react'
import TickSvg from '../svg/Tick-svg'

interface IProps {
	checked: boolean
	setChecked: (value: boolean) => void
}

const FormCheckbox: FC<IProps> = ({ checked, setChecked }) => {
	return (
		<button
			onClick={() => setChecked(!checked)}
			className={`size-4 rounded-sm border border-white ${
				checked ? 'bg-white' : ''
			}`}
		>
			{checked && (
				<span className='flex items-center justify-center'>
					<TickSvg className={'text-black size-3.5 '} />
				</span>
			)}
		</button>
	)
}

export default FormCheckbox
