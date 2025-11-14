import { FC, useEffect, useRef, useState } from 'react'
import CloseSvg from '../svg/Close-svg'
import SkeletonLoader from '../utils/Skeleton-loader'

export interface IMultiSelectValue {
	id: string
	name: string
}

interface IProps {
	id: string
	placeholder: string
	value: IMultiSelectValue[]
	onChange: (value: IMultiSelectValue[]) => void
	loadOptions: (
		search: string,
		limit: number | null
	) => Promise<IMultiSelectValue[]>
}

// TODO: переделать на дженерик
const FormMultiSelect: FC<IProps> = ({
	id,
	placeholder,
	value,
	onChange,
	loadOptions,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const [options, setOptions] = useState<IMultiSelectValue[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const prevSearchRef = useRef<string>('')
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (!isOpen) return
		if (prevSearchRef.current === search) return
		prevSearchRef.current = search

		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}

		setIsLoading(true)
		timerRef.current = setTimeout(async () => {
			try {
				const data = await loadOptions(search, search.trim() === '' ? 10 : null)
				setOptions(data)
			} catch {
				setOptions([])
			} finally {
				setIsLoading(false)
			}
		}, 300)
	}, [isOpen, search, loadOptions])

	useEffect(() => {
		const loadInitialData = async () => {
			setIsLoading(true)
			try {
				const initialData = await loadOptions('', 10)
				setOptions(initialData)
			} catch {
				setOptions([])
			} finally {
				setIsLoading(false)
			}
		}

		loadInitialData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const toggleOption = (option: IMultiSelectValue) => {
		const isSelected = value.some(v => v.id === option.id)

		if (isSelected) {
			onChange(value.filter(v => v.id !== option.id))
		} else {
			onChange([...value, option])
		}
	}

	const removeOption = (option: IMultiSelectValue, e: React.MouseEvent) => {
		e.stopPropagation()
		onChange(value.filter(v => v.id !== option.id))
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (
			containerRef.current &&
			!containerRef.current.contains(event.target as Node)
		) {
			setIsOpen(false)
			setSearch('')
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	const filteredOptions = options.filter(
		option =>
			!value.some(v => v.id === option.id) &&
			option.name.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div ref={containerRef} className='relative w-full'>
			<div
				onClick={() => {
					setIsOpen(true)
					setTimeout(() => inputRef.current?.focus(), 0)
				}}
				className={`w-full min-h-10 rounded-md border px-3 py-2 text-sm outline-none border-white/15 focus:border-white transition-colors flex items-center flex-wrap gap-1 cursor-text ${
					isOpen ? 'border-white' : ''
				}`}
			>
				{value.map(option => (
					<div
						key={option.id}
						className='flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full text-sm'
					>
						<span>{option.name}</span>
						<button
							type='button'
							onClick={e => removeOption(option, e)}
							className='text-red-500 hover:text-red-400 focus:outline-none cursor-pointer'
						>
							<CloseSvg className={'size-4'} />
						</button>
					</div>
				))}

				<input
					ref={inputRef}
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
					{isLoading ? (
						<div className='flex flex-col items-center gap-2 p-2'>
							{Array.from({ length: 3 }).map((_, idx) => (
								<SkeletonLoader
									className='h-10 w-full rounded-md'
									key={`option-skeleton-${idx}`}
								/>
							))}
						</div>
					) : filteredOptions.length > 0 ? (
						filteredOptions.map(option => (
							<div
								key={option.id}
								onClick={() => toggleOption(option)}
								className='p-2 hover:bg-zinc-800 cursor-pointer'
							>
								{option.name}
							</div>
						))
					) : (
						<div className='p-2 text-gray-400'>
							{options.length === 0
								? search.trim() === ''
									? 'Нет доступных опций'
									: 'Ничего не найдено'
								: 'Все опции выбраны'}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default FormMultiSelect
