import { FC } from 'react'
import AuthorReleaseTypesRatings from '../../../components/author/author-ratings/Author-release-types-ratings'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import { IAuthor } from '../../../models/author/author'
import { ReleaseTypesEnum } from '../../../models/release/release-type/release-types-enum'

interface IProps {
	author?: IAuthor
	isLoading: boolean
}

const AuthorDetailsStats: FC<IProps> = ({ author, isLoading }) => {
	return (
		<section className='grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-5'>
			{isLoading || !author ? (
				<SkeletonLoader className='w-80 h-34 lg:43 rounded-2xl' />
			) : (
				<>
					<div className='col-span-1 bg-zinc-900 px-5 py-3 lg:p-5 rounded-2xl border border-white/10 select-none grid gap-3'>
						<p className='lg:text-xl font-bold lg:mb-4'>Средняя оценка</p>
						<AuthorReleaseTypesRatings
							releaseType={ReleaseTypesEnum.SINGLE}
							stats={author.releaseTypeRatings}
						/>
						<AuthorReleaseTypesRatings
							releaseType={ReleaseTypesEnum.ALBUM}
							stats={author.releaseTypeRatings}
						/>
					</div>

					{author.nominationParticipations.length > 0 && (
						<div className='lg:col-span-3 border-white/10 bg-zinc-900 p-5 rounded-2xl border'>
							<div className='lg:text-xl font-bold mb-2 lg:mb-4'>Номинации</div>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-1 gap-x-4 lg:gap-4'>
								{author.nominationParticipations.map(nomination => (
									<div
										key={nomination.name}
										className='flex items-center lg:bg-zinc-800 lg:px-3 lg:py-2 lg:rounded-xl border-b border-dashed lg:border-none border-white/10 justify-between'
									>
										<span className='text-sm font-medium text-zinc-300'>
											{nomination.name}
										</span>
										<span className='text-lg font-bold'>
											{nomination.count}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</>
			)}
		</section>
	)
}

export default AuthorDetailsStats
