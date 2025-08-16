import { FC, useEffect, useRef, useState } from 'react'
import { getRoleColor } from '../../utils/get-role-color'
import ArrowBottomSvg from '../layout/header/svg/Arrow-bottom-svg'
import TickSvg from '../svg/Tick-svg'

interface ComboBoxProps {
	options: string[]
	value?: string
	onChange: (selected: string) => void
	className?: string
	placeholder?: string
}

const ComboBox: FC<ComboBoxProps> = ({
	options,
	value,
	onChange,
	className = '',
	placeholder = '',
}) => {
	if (options.length === 0) {
		throw new Error('ComboBox: options must be a non-empty array.')
	}

	const [isOpen, setIsOpen] = useState(false)
	const comboRef = useRef<HTMLDivElement | null>(null)

	const selected = value ?? placeholder

	const handleClickOutside = (event: MouseEvent) => {
		if (comboRef.current && !comboRef.current.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div
			ref={comboRef}
			className={`relative inline-block w-full h-full bg-zinc-950 rounded-md ${className} select-none`}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				role='combobox'
				className='flex w-full gap-x-1 h-full justify-between items-center px-3 text-sm font-medium text-white cursor-pointer py-2'
			>
				<span
					className={`${getRoleColor(selected)} ${
						selected === placeholder ? 'opacity-50' : ''
					}`}
				>
					{selected}
				</span>
				<ArrowBottomSvg className='h-5 w-4 opacity-70' />
			</button>

			<ul
				className={`absolute left-0 mt-3 z-100 w-full border border-white/10 text-sm font-medium shadow-lg bg-zinc-950 transition-all duration-125 flex flex-col rounded-md max-h-70 overflow-scroll ${
					isOpen
						? 'opacity-100 translate-y-0 pointer-events-auto'
						: 'opacity-0 -translate-y-3 pointer-events-none'
				}`}
			>
				{options.map(option => (
					<li
						key={option}
						className={`flex items-center px-2 py-3 cursor-pointer text-sm font-medium hover:bg-white/10 transition-colors duration-300 ${
							selected === option ? 'bg-white/10' : ''
						} ${getRoleColor(option)}`}
						onClick={() => {
							onChange(option)
							setIsOpen(false)
						}}
					>
						{option}
						<span className='w-full'>
							{selected === option ? (
								<TickSvg className='size-3.5 ml-auto' />
							) : null}
						</span>
					</li>
				))}
			</ul>
		</div>
	)
}

export default ComboBox
