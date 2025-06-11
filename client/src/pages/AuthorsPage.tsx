import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AuthorsPageGrid from '../components/authorsPage/AuthorsPageGrid'
import ComboBox from '../components/header/buttons/ComboBox'
import Loader from '../components/Loader'
import { useLoading } from '../hooks/use-loading'
import { useStore } from '../hooks/use-store'

const AuthorsPage = observer(() => {
	const { authorsStore } = useStore()
	const [selectedAuthorType, setSelectedAuthorType] = useState<string>()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const perPage = 10
	useEffect(() => {
		fetchTypes()
	}, [])

	useEffect(() => {
		const type = authorsStore.authorTypes.find(
			entry => entry.type === selectedAuthorType
		)
		fetchAuthors(type ? type.id : null, perPage, (currentPage - 1) * perPage)
	}, [selectedAuthorType, currentPage])

	const { execute: fetchAuthors, isLoading: isAuthorsLoading } = useLoading(
		authorsStore.fetchAuthors
	)
	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		authorsStore.fetchAuthorTypes
	)

	return (
		<>
			<h1 id='authors' className='text-lg md:text-xl lg:text-3xl font-semibold'>
				Авторы
			</h1>
			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5'>
				<div className='w-full sm:w-55'>
					{!isTypesLoading && authorsStore.authorTypes.length > 0 ? (
						<ComboBox
							options={authorsStore.authorTypes.map(entry => entry.type)}
							onChange={setSelectedAuthorType}
							className='border border-white/10'
							placeholder='Выберите тип автора'
							value={selectedAuthorType}
						/>
					) : (
						<Loader size={'size-20'} />
					)}
				</div>
			</div>

			<AuthorsPageGrid
				items={authorsStore.authors}
				isLoading={isAuthorsLoading}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				total={authorsStore.authorsCount}
				perPage={perPage}
			/>
		</>
	)
})

export default AuthorsPage
