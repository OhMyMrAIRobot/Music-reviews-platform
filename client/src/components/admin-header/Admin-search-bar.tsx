import { FC } from 'react'
import SearchSvg from '../header/svg/Search-svg'

interface IProps {
	searchText: string
	setSearchText: (val: string) => void
	onSubmit: () => void
	className?: string
}

const AdminSearchBar: FC<IProps> = ({
	searchText,
	setSearchText,
	onSubmit,
	className,
}) => {
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearchClick()
		}
	}

	const handleSearchClick = () => {
		onSubmit()
	}

	return (
		<div
			className={`${className} flex h-10 w-full md:w-75 rounded-md border border-white/10 select-none bg-[#242527]/75 focus-within:border-white/70`}
		>
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
				className='w-full outline-none text-sm font-medium text-white placeholder:text-gray-500 pl-1'
			/>
		</div>
	)
}

export default AdminSearchBar
