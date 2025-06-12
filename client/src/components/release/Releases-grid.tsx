import { FC } from 'react'
import { IRelease } from '../../models/release/release'
import Pagination from '../pagination/Pagination'
import ReleaseCard from './Release-card'

interface IProps {
	items: IRelease[]
	isLoading: boolean
	currentPage: number
	setCurrentPage: (val: number) => void
	total: number
	perPage: number
}

const ReleasesGrid: FC<IProps> = ({
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
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xl:gap-5'>
					{isLoading
						? Array.from({
								length:
									total > 0 ? total - (currentPage - 1) * perPage : perPage,
						  }).map((_, idx) => (
								<div
									className='p-2 min-h-72 xs:min-74 md:min-h-80'
									key={`release-skeleton-${idx}`}
								>
									<ReleaseCard isLoading={true} />
								</div>
						  ))
						: items.map(release => (
								<div className='p-2' key={release.id}>
									<ReleaseCard release={release} isLoading={isLoading} />
								</div>
						  ))}
					{items.length === 0 && !isLoading && (
						<p className='text-center text-2xl font-semibold mt-10 absolute w-full'>
							Релизы не найдены!
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
						onPageChange={setCurrentPage}
						idToScroll={'releases'}
					/>
				</div>
			)}
		</>
	)
}

export default ReleasesGrid
