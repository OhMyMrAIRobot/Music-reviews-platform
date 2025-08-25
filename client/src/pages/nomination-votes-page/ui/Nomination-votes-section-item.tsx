import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { NominationCandidate } from '../../../models/nomination/nomination-candidate/nomination-candidate'

interface IProps {
	isLoading: boolean
	candidate?: NominationCandidate
}

const NominationVotesSectionItem: FC<IProps> = observer(
	({ candidate, isLoading }) => {
		const { navigateToReleaseDetails, navigateToAuthorDetails } =
			useNavigationPath()

		const { VITE_SERVER_URL, VITE_DEFAULT_AVATAR, VITE_DEFAULT_COVER } =
			import.meta.env

		const navPath = candidate
			? candidate.entityKind === 'author'
				? navigateToAuthorDetails(candidate.id)
				: navigateToReleaseDetails(candidate.id)
			: '#'

		return (
			<div className='flex group justify-between items-center gap-x-5'>
				<Link to={navPath} className='flex items-center gap-x-2'>
					{isLoading || !candidate ? (
						<SkeletonLoader className={'size-17 rounded-xl aspect-square'} />
					) : (
						<div className='size-17 border border-white/10 flex items-center justify-center rounded-xl overflow-hidden'>
							<img
								loading='lazy'
								decoding='async'
								src={`${VITE_SERVER_URL}/public/${
									candidate.entityKind === 'author'
										? `authors/avatars/${candidate.img || VITE_DEFAULT_AVATAR}`
										: `releases/${candidate.img || VITE_DEFAULT_COVER}`
								}`}
								className='size-15 group-hover:scale-110 transition-all duration-400 rounded-lg'
							/>
						</div>
					)}

					{isLoading || !candidate ? (
						<SkeletonLoader className={'w-60 rounded-xl h-8'} />
					) : (
						<div className='flex flex-col'>
							<span className='font-medium opacity-90 hover:opacity-100 hover:underline underline-offset-4 transition-all duration-200'>
								{candidate.entityKind === 'author'
									? candidate.name
									: candidate.title}
							</span>
							{candidate.entityKind === 'release' && (
								<span className='font-medium opacity-40'>
									{candidate.authors.join(', ')}
								</span>
							)}
						</div>
					)}
				</Link>

				{isLoading ? (
					<SkeletonLoader className={'w-40 h-10 rounded-lg'} />
				) : (
					<button className='flex items-center justify-center h-10 px-4 py-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white hover:text-black transition-all duration-400 text-sm font-medium'>
						Проголосовать
					</button>
				)}
			</div>
		)
	}
)

export default NominationVotesSectionItem
