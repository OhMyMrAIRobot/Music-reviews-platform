import { FC } from 'react'

interface IProps {
	checked: boolean
	setChecked: (value: boolean) => void
}

const TickSvgIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='black'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		className='h-4 w-4'
	>
		<path d='M20 6 9 17l-5-5'></path>
	</svg>
)

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
					<TickSvgIcon />
				</span>
			)}
		</button>
	)
}

export default FormCheckbox
