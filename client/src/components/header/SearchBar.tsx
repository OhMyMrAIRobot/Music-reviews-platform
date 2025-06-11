import { useState } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { SearchTypesEnum } from '../../model/search/search-types-enum'
import { SearchSvgIcon } from './HeaderSvgIcons'
import ComboBox from './buttons/ComboBox'

const SearchBar = () => {
	const SearchTypeValues = Object.freeze({
		AUTHORS: 'Авторы',
		RELEASES: 'Релизы',
		USERS: 'Пользователи',
	})

	const [searchText, setSearchText] = useState<string>('')
	const [selectedType, setSelectedType] = useState<string>(
		SearchTypeValues.AUTHORS
	)

	const { navigateToSearch } = useCustomNavigate()

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearchClick()
		}
	}

	const handleSearchClick = () => {
		let typeKey: SearchTypesEnum

		switch (selectedType) {
			case SearchTypeValues.AUTHORS:
				typeKey = SearchTypesEnum.AUTHORS
				break
			case SearchTypeValues.RELEASES:
				typeKey = SearchTypesEnum.RELEASES
				break
			case SearchTypeValues.USERS:
				typeKey = SearchTypesEnum.USERS
				break
			default:
				typeKey = SearchTypesEnum.AUTHORS
		}
		navigateToSearch(typeKey, searchText)
	}

	return (
		<div className='max-lg:hidden flex lg:w-[400px] h-10 rounded-md border border-zinc-700 bg-zinc-900'>
			<button
				onClick={handleSearchClick}
				className='w-10 h-full px-3 text-sm rounded-md cursor-pointer font-medium text-gray-500 transition-colors bg-zinc-900 hover:bg-white/10 hover:text-white duration-200'
			>
				<SearchSvgIcon />
			</button>

			<input
				onKeyDown={handleKeyPress}
				type='text'
				value={searchText}
				onChange={e => setSearchText(e.target.value)}
				placeholder='Поиск...'
				className='w-[180px] bg-zinc-900 outline-none text-sm font-medium text-white placeholder:text-gray-500'
			/>

			<ComboBox
				options={Object.values(SearchTypeValues)}
				value={selectedType}
				onChange={setSelectedType}
				className='rounded-md border-l border-zinc-700 relative inline-block'
			/>
		</div>
	)
}

export default SearchBar
