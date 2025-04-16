import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AuthorItem from '../components/authorsPage/AuthorItem'
import ComboBox from '../components/header/buttons/ComboBox'
import Loader from '../components/Loader'
import Pagination from '../components/pagination/Pagination'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

const AuthorsPage = observer(() => {
	const { authorsStore } = useStore()
	const [selectedAuthorType, setSelectedAuthorType] = useState<string>()
	const [currentPage, setCurrentPage] = useState<number>(1)

	useEffect(() => {
		fetchTypes()
	}, [])

	useEffect(() => {
		const type = authorsStore.authorTypes.find(
			entry => entry.type === selectedAuthorType
		)
		fetchAuthors(type ? type.id : null, 5, (currentPage - 1) * 5)
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
						<Loader size={10} />
					)}
				</div>
			</div>

			<section className='mt-5'>
				{!isAuthorsLoading ? (
					authorsStore.authors.length > 0 ? (
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6'>
							{authorsStore.authors.map(author => (
								<AuthorItem key={author.id} author={author} />
							))}
						</div>
					) : (
						<p className='text-center text-2xl font-semibold mt-30'>
							Авторы не найдены!
						</p>
					)
				) : (
					<div className='mt-30'>
						<Loader size={20} />
					</div>
				)}
			</section>

			{authorsStore.authors.length > 0 && (
				<div className='mt-50'>
					<Pagination
						currentPage={currentPage}
						totalItems={authorsStore.authorsCount}
						itemsPerPage={5}
						onPageChange={setCurrentPage}
						idToScroll={'authors'}
					/>
				</div>
			)}
		</>
	)
})

export default AuthorsPage
