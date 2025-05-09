import { FC } from 'react'
import { IAuthorData } from '../../models/author/AuthorsResponse'
import Loader from '../Loader'
import Pagination from '../pagination/Pagination'
import AuthorItem from './AuthorItem'

interface IProps {
	items: IAuthorData[]
	isLoading: boolean
	currentPage: number
	setCurrentPage: (val: number) => void
	total: number
}

const AuthorsPageGrid: FC<IProps> = ({
	items,
	isLoading,
	currentPage,
	setCurrentPage,
	total,
}) => {
	return (
		<>
			<section className='mt-5'>
				{!isLoading ? (
					items.length > 0 ? (
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6'>
							{items.map(author => (
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

			{items.length > 0 && (
				<div className='mt-50'>
					<Pagination
						currentPage={currentPage}
						totalItems={total}
						itemsPerPage={5}
						onPageChange={setCurrentPage}
						idToScroll={'authors'}
					/>
				</div>
			)}
		</>
	)
}

export default AuthorsPageGrid
