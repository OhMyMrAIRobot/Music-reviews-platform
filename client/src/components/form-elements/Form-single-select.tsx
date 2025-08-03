import { FC, useEffect, useRef, useState } from 'react'
import TickSvg from '../svg/Tick-svg'
import SkeletonLoader from '../utils/Skeleton-loader'

interface IProps {
	id: string
	placeholder: string
	value?: string
	onChange: (value: string) => void
	loadOptions: (search: string) => Promise<string[]>
}

const FormSingleSelect: FC<IProps> = ({
	id,
	placeholder,
	value,
	onChange,
	loadOptions,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const [options, setOptions] = useState<string[]>([])
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
				const data = await loadOptions(search)
				setOptions(data)
			} catch {
				setOptions([])
			} finally {
				setIsLoading(false)
			}
		}, 300)
	}, [isOpen, search, loadOptions])

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
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	const handleSelect = (option: string) => {
		onChange(option)
		setIsOpen(false)
		setSearch('')
	}

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
				{value && (
					<div className='flex items-center gap-1  px-2 py-1 text-sm rounded-md'>
						<span>{value}</span>
					</div>
				)}

				<input
					ref={inputRef}
					id={id}
					type='text'
					value={search}
					onChange={e => setSearch(e.target.value)}
					onClick={() => setIsOpen(true)}
					className='flex-1 min-w-20 bg-transparent outline-none'
					placeholder={!value ? placeholder : ''}
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
					) : options.length > 0 ? (
						options.map(option => (
							<div
								key={option}
								onClick={() => handleSelect(option)}
								className='p-2 hover:bg-zinc-800 cursor-pointer flex items-center gap-2'
							>
								<div
									className={`${
										value === option ? 'opacity-100' : 'opacity-0'
									}`}
								>
									<TickSvg className='size-4' />
								</div>
								<span>{option}</span>
							</div>
						))
					) : (
						<div className='p-2 text-gray-400'>
							{search.trim() === ''
								? placeholder
								: options.length === 0
								? 'Нет доступных опций'
								: 'Ничего не найдено'}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default FormSingleSelect
