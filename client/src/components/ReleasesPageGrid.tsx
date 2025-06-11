import { FC } from 'react'
import { IRelease } from '../models/release/release'
import Loader from './Loader'
import Pagination from './pagination/Pagination'
import ReleaseCard from './release/Release-card'

interface IProps {
	items: IRelease[]
	isLoading: boolean
	currentPage: number
	setCurrentPage: (val: number) => void
	total: number
	perPage: number
}

const ReleasesPageGrid: FC<IProps> = ({
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
				{!isLoading ? (
					items.length > 0 ? (
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xl:gap-5'>
							{items.map(release => (
								<div className='p-2' key={release.id}>
									<ReleaseCard release={release} />
								</div>
							))}
						</div>
					) : (
						<p className='text-center text-2xl font-semibold mt-30'>
							Релизы не найдены!
						</p>
					)
				) : (
					<div className='mt-30'>
						<Loader size={'size-20'} />
					</div>
				)}
			</section>

			{items.length > 0 && (
				<div className='mt-50'>
					<Pagination
						currentPage={currentPage}
						totalItems={total}
						itemsPerPage={perPage}
						onPageChange={setCurrentPage}
						idToScroll={'releases'}
					/>
				</div>
			)}
		</>
	)
}

export default ReleasesPageGrid
