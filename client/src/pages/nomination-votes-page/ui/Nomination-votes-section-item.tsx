import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router'
import FormButton from '../../../components/form-elements/Form-button'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import { useAuth } from '../../../hooks/use-auth'
import { useLoading } from '../../../hooks/use-loading'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { useStore } from '../../../hooks/use-store'
import { NominationCandidate } from '../../../models/nomination/nomination-candidate/nomination-candidate'
import { INominationType } from '../../../models/nomination/nomination-type/nomination-type'

interface IProps {
	isLoading: boolean
	candidate?: NominationCandidate
	nominationType?: INominationType
}

const NominationVotesSectionItem: FC<IProps> = observer(
	({ candidate, isLoading, nominationType }) => {
		const { nominationVotesPageStore, notificationStore } = useStore()

		const { checkAuth } = useAuth()

		const { navigateToReleaseDetails, navigateToAuthorDetails } =
			useNavigationPath()

		const { VITE_SERVER_URL, VITE_DEFAULT_AVATAR, VITE_DEFAULT_COVER } =
			import.meta.env

		const navPath = candidate
			? candidate.entityKind === 'author'
				? navigateToAuthorDetails(candidate.id)
				: navigateToReleaseDetails(candidate.id)
			: '#'

		const { execute: postVote, isLoading: isPosting } = useLoading(
			nominationVotesPageStore.postVote
		)

		const handleClick = async () => {
			if (!checkAuth() || isPosting || !nominationType || !candidate) return

			const errors = await postVote(
				nominationType.id,
				candidate.entityKind,
				candidate.id
			)

			if (errors.length === 0) {
				notificationStore.addSuccessNotification('Вы успешно проголосовали!')
			} else {
				errors.forEach(err => notificationStore.addErrorNotification(err))
			}
		}

		return (
			<div className='flex group justify-between items-center gap-x-5 border border-white/10 rounded-xl pr-4 h-17 overflow-hidden hover:bg-white/5'>
				<Link to={navPath} className='flex items-center gap-x-2'>
					{isLoading || !candidate ? (
						<SkeletonLoader className={'size-17 rounded-xl aspect-square'} />
					) : (
						<div className='h-full aspect-square flex items-center justify-center ml-0.5'>
							<img
								loading='lazy'
								decoding='async'
								src={`${VITE_SERVER_URL}/public/${
									candidate.entityKind === 'author'
										? `authors/avatars/${candidate.img || VITE_DEFAULT_AVATAR}`
										: `releases/${candidate.img || VITE_DEFAULT_COVER}`
								}`}
								className='size-15 group-hover:scale-115 transition-all duration-400 rounded-lg'
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
					<div className='w-40'>
						<FormButton
							title={'Проголосовать'}
							isInvert={true}
							onClick={handleClick}
							disabled={isPosting}
							isLoading={isPosting}
						/>
					</div>
				)}
			</div>
		)
	}
)

export default NominationVotesSectionItem
