import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router'
import FormButton from '../../../components/form-elements/Form-button'
import TickRoundedSvg from '../../../components/svg/Tick-rounded-svg'
import Tooltip from '../../../components/tooltip/Tooltip'
import TooltipSpan from '../../../components/tooltip/Tooltip-span'
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
	voted?: boolean
	setVoted?: (val: boolean) => void
}

const NominationVotesSectionItem: FC<IProps> = observer(
	({ candidate, isLoading, nominationType, voted, setVoted }) => {
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
				setVoted?.(true)
			} else {
				errors.forEach(err => notificationStore.addErrorNotification(err))
			}
		}

		return (
			<div className='flex w-full items-center gap-x-5 border border-white/10 rounded-xl pr-4 h-17 hover:bg-white/5 group'>
				<Link
					to={navPath}
					className='flex items-center gap-x-2 h-full flex-1 min-w-0 overflow-hidden'
				>
					{isLoading || !candidate ? (
						<SkeletonLoader className='size-17 rounded-xl aspect-square shrink-0' />
					) : (
						<div className='h-full aspect-square overflow-hidden flex items-center justify-center rounded-xl shrink-0'>
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
						<SkeletonLoader className='w-60 rounded-xl h-8' />
					) : (
						<div className='flex flex-col min-w-0'>
							<span className='font-medium opacity-90 hover:opacity-100 hover:underline underline-offset-4 transition-all duration-200 truncate'>
								{candidate.entityKind === 'author'
									? candidate.name
									: candidate.title}
							</span>
							{candidate.entityKind === 'release' && (
								<span className='font-medium opacity-40 truncate'>
									{candidate.authors.join(', ')}
								</span>
							)}
						</div>
					)}
				</Link>

				{isLoading ? (
					<SkeletonLoader className='w-28 sm:w-40 h-10 rounded-lg ml-auto shrink-0' />
				) : (
					<div className='flex gap-x-2 items-center ml-auto shrink-0'>
						{nominationVotesPageStore.userVotes.some(v => {
							return (
								v.nominationType.type === nominationType?.type &&
								v.entityId === candidate?.id
							)
						}) && (
							<TooltipSpan
								tooltip={
									<Tooltip>
										Вы проголосовали за{' '}
										{candidate?.entityKind === 'author'
											? 'данного автора!'
											: 'данный релиз!'}
									</Tooltip>
								}
								spanClassName='relative'
								centered={true}
							>
								<TickRoundedSvg className='size-7 text-green-500 shrink-0' />
							</TooltipSpan>
						)}

						<FormButton
							title='Проголосовать'
							isInvert={true}
							onClick={handleClick}
							disabled={isPosting || voted === true}
							isLoading={isPosting}
						/>
					</div>
				)}
			</div>
		)
	}
)

export default NominationVotesSectionItem
