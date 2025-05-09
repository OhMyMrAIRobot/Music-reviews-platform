import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Loader from '../components/Loader'
import useCustomNavigate from '../hooks/UseCustomNavigate'
import { SearchTypesEnum } from '../models/search/SearchTypesEnum'

const SearchPage = () => {
	const { type } = useParams()
	const { navigateToMain } = useCustomNavigate()
	const [isLoading, setIsloading] = useState<boolean>(true)

	useEffect(() => {
		if (
			!type ||
			!Object.values(SearchTypesEnum).includes(type as SearchTypesEnum)
		) {
			navigateToMain()
		}
		setIsloading(false)
	}, [])

	return isLoading ? <Loader /> : <div>{type}</div>
}

export default SearchPage
