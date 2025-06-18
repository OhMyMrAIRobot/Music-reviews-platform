import { useState } from 'react'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { SearchBarOptions } from '../../models/search/search-bar-options'
import { SearchTypesEnum } from '../../models/search/search-types-enum'
import ComboBox from '../buttons/Combo-box'
import SearchSvg from './svg/Search-svg'

const SearchBar = () => {
	const { navigateToSearch } = useCustomNavigate()

	const [searchText, setSearchText] = useState<string>('')
	const [selectedType, setSelectedType] = useState<string>(
		SearchBarOptions.AUTHORS
	)

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearchClick()
		}
	}

	const handleSearchClick = () => {
		let typeKey: SearchTypesEnum

		switch (selectedType) {
			case SearchBarOptions.AUTHORS:
				typeKey = SearchTypesEnum.AUTHORS
				break
			case SearchBarOptions.RELEASES:
				typeKey = SearchTypesEnum.RELEASES
				break
			default:
				typeKey = SearchTypesEnum.AUTHORS
		}
		navigateToSearch(typeKey, searchText)
	}

	return (
		<div className='hidden lg:flex lg:w-[400px] h-10 rounded-md border border-white/10 select-none bg-[#242527]/75 focus-within:border-white/70'>
			<button
				onClick={handleSearchClick}
				className='w-10 h-full px-3 text-sm rounded-md cursor-pointer font-medium text-gray-500 transition-colors hover:bg-white/15 hover:text-white duration-200'
			>
				<SearchSvg className={'size-4'} />
			</button>

			<input
				onKeyDown={handleKeyPress}
				type='text'
				value={searchText}
				onChange={e => setSearchText(e.target.value)}
				placeholder='Поиск...'
				className='w-[180px] outline-none text-sm font-medium text-white placeholder:text-gray-500 pl-1'
			/>

			<ComboBox
				options={Object.values(SearchBarOptions)}
				value={selectedType}
				onChange={setSelectedType}
				className='rounded-md border-l border-white/10 relative inline-block'
			/>
		</div>
	)
}

export default SearchBar
