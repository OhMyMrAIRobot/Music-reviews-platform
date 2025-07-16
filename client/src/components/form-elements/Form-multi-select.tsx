import { FC, useEffect, useRef, useState } from 'react'
import CloseSvg from '../svg/Close-svg'

interface IProps {
	id: string
	placeholder: string
	options: string[]
	value: string[]
	onChange: (value: string[]) => void
}

const FormMultiSelect: FC<IProps> = ({
	id,
	placeholder,
	options,
	value,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const containerRef = useRef<HTMLDivElement>(null)

	const filteredOptions = options.filter(
		option =>
			option.toLowerCase().includes(search.toLowerCase()) &&
			!value.includes(option)
	)

	const toggleOption = (option: string) => {
		if (value.includes(option)) {
			onChange(value.filter(v => v !== option))
		} else {
			onChange([...value, option])
		}
	}

	const removeOption = (option: string) => {
		onChange(value.filter(v => v !== option))
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (
			containerRef.current &&
			!containerRef.current.contains(event.target as Node)
		) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div ref={containerRef} className='relative w-full'>
			<div
				onClick={() => setIsOpen(true)}
				className={`w-full min-h-10 rounded-md border px-3 py-2 text-sm outline-none border-white/15 focus:border-white transition-colors flex items-center flex-wrap gap-1 cursor-text ${
					isOpen ? 'border-white' : ''
				}`}
			>
				{value.map(option => (
					<div
						key={option}
						className='flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full text-sm'
					>
						<span>{option}</span>
						<button
							type='button'
							onClick={e => {
								e.stopPropagation()
								removeOption(option)
							}}
							className='text-red-500 hover:text-red-400 focus:outline-none'
						>
							<CloseSvg className={'size-4'} />
						</button>
					</div>
				))}

				<input
					id={id}
					type='text'
					value={search}
					onChange={e => setSearch(e.target.value)}
					onClick={() => setIsOpen(true)}
					className='flex-1 min-w-20 bg-transparent outline-none'
					placeholder={value.length === 0 ? placeholder : ''}
				/>
			</div>

			{isOpen && (
				<div className='absolute top-full left-0 right-0 bg-zinc-950 border border-white/15 rounded-md mt-1 z-10 max-h-60 overflow-y-auto shadow-lg'>
					{filteredOptions.length > 0 ? (
						filteredOptions.map(option => (
							<div
								key={option}
								onClick={() => toggleOption(option)}
								className='p-2 hover:bg-zinc-800 cursor-pointer'
							>
								{option}
							</div>
						))
					) : (
						<div className='p-2 text-gray-400'>
							{options.length === 0
								? 'Нет доступных опций'
								: 'Все опции выбраны или нет совпадений'}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default FormMultiSelect
