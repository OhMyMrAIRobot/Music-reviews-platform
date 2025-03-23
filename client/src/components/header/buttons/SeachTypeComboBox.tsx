import { useEffect, useRef, useState } from 'react'
import { ArrowBottomSvgIcon, TickSvgIcon } from '../HeaderSvgIcons'

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
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

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
