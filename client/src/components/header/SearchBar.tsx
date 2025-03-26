import { useState } from 'react'
import SeachTypeComboBox from './buttons/SeachTypeComboBox'
import { SearchSvgIcon } from './HeaderSvgIcons'

const SearchBar = () => {
	const [searchText, setSearchText] = useState<string>('')

	return (
		<div className='max-lg:hidden flex lg:w-[380px] h-10 rounded-md border border-zinc-700 bg-zinc-900'>
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
