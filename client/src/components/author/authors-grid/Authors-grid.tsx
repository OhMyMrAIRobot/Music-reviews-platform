import { FC } from 'react'
import { IAuthorData } from '../../../models/author/authors-response'
import Pagination from '../../pagination/Pagination'
import AuthorCard from './Author-card'

interface IProps {
	items: IAuthorData[]
	isLoading: boolean
	currentPage: number
	setCurrentPage: (val: number) => void
	total: number
	perPage: number
}

const AuthorsGrid: FC<IProps> = ({
	items,
	isLoading,
	currentPage,
	setCurrentPage,
	total,
	perPage,
}) => {
	return (
		<>
			<section className='mt-5 overflow-hidden'>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6'>
					{isLoading
						? Array.from({ length: perPage }).map((_, idx) => (
								<AuthorCard
									key={`author-skeleton-${idx}`}
									isLoading={isLoading}
								/>
						  ))
						: items.map(author => (
								<AuthorCard
									key={author.id}
									author={author}
									isLoading={isLoading}
								/>
						  ))}

					{items.length === 0 && !isLoading && (
						<p className='text-center text-2xl font-semibold mt-10 absolute w-full'>
							Авторы не найдены!
						</p>
					)}
				</div>
			</section>

			{items.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={total}
						itemsPerPage={perPage}
						setCurrentPage={setCurrentPage}
						idToScroll={'authors'}
					/>
				</div>
			)}
		</>
	)
}

export default AuthorsGrid
