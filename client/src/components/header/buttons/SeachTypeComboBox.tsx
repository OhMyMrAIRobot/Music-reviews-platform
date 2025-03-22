import { useEffect, useRef, useState } from 'react'

const SearchTypeEnum = Object.freeze({
	FIRST: 'Авторы и релизы',
	SECOND: 'Пользователи',
})

const SeachTypeComboBox = () => {
	const [selected, setSelected] = useState<string>(SearchTypeEnum.FIRST)
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const comboRef = useRef<HTMLDivElement | null>(null)

	const searchOptions = Object.values(SearchTypeEnum)

	const handleClickOutside = (event: MouseEvent) => {
		if (comboRef.current && !comboRef.current.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)
		return document.removeEventListener('click', handleClickOutside)
	})

	const ArrowBottomSvgIcon = () => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-chevron-down h-5 w-4 opacity-50'
			aria-hidden='true'
		>
			<path d='m6 9 6 6 6-6'></path>
		</svg>
	)

	const TickSvgIcon = () => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 16 16'
			fill='currentColor'
			className='w-4 h-4 text-white flex items-center justify-center'
		>
			<path
				fillRule='evenodd'
				d='M16.293 5.293a1 1 0 011.414 1.414L9 13.414 5.293 9.707a1 1 0 111.414-1.414L9 10.586l7.293-7.293z'
				clipRule='evenodd'
			/>
		</svg>
	)

	return (
		<div
			ref={comboRef}
			className='relative inline-block w-[160px] bg-primary rounded-md'
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				role='combobox'
				className='flex w-full gap-x-1 h-full items-center pl-3 text-sm font-medium text-white rounded-md border-l border-zinc-700 cursor-pointer'
			>
				<span>{selected}</span>
				<ArrowBottomSvgIcon />
			</button>

			{isOpen && (
				<ul className='absolute left-0 mt-2 py-1 px-2 w-full bg-white border border-zinc-700 text-sm font-medium rounded-md shadow-lg bg-primary'>
					{searchOptions.map(option => (
						<li
							key={option}
							className='flex items-center py-2 cursor-pointer text-sm font-medium'
							onClick={() => {
								setSelected(option)
								setIsOpen(false)
							}}
						>
							<span className='w-5'>
								{selected === option ? <TickSvgIcon /> : null}
							</span>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default SeachTypeComboBox
