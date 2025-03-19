import { useState } from 'react'
import SeachTypeComboBox from './buttons/SeachTypeComboBox'

const SearchBar = () => {
	const [searchText, setSearchText] = useState<string>('')

	const SearchSvgIcon = () => (
		<svg
			stroke='currentColor'
			fill='currentColor'
			strokeWidth='0'
			viewBox='0 0 512 512'
			className='size-4'
			height='1em'
			width='1em'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path d='M337.509 305.372h-17.501l-6.571-5.486c20.791-25.232 33.922-57.054 33.922-93.257C347.358 127.632 283.896 64 205.135 64 127.452 64 64 127.632 64 206.629s63.452 142.628 142.225 142.628c35.011 0 67.831-13.167 92.991-34.008l6.561 5.487v17.551L415.18 448 448 415.086 337.509 305.372zm-131.284 0c-54.702 0-98.463-43.887-98.463-98.743 0-54.858 43.761-98.742 98.463-98.742 54.7 0 98.462 43.884 98.462 98.742 0 54.856-43.762 98.743-98.462 98.743z'></path>
		</svg>
	)

	return (
		<div className='max-lg:hidden flex lg:w-[380px] h-10 rounded-md border border-zinc-700'>
			<button className='w-10 h-full px-3 text-sm rounded-md cursor-pointer font-medium text-gray-500 transition-colors bg-zinc-900'>
				<SearchSvgIcon />
			</button>
			<input
				type='text'
				value={searchText}
				onChange={e => setSearchText(e.target.value)}
				placeholder='Поиск...'
				className='w-[180px] bg-zinc-900 outline-none text-sm font-medium text-white placeholder:text-gray-500'
			/>

			<SeachTypeComboBox />
		</div>
	)
}

export default SearchBar
