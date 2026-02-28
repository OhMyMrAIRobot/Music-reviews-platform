import {
	InvalidateQueryFilters,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import { AlbumValueAPI } from '../../../../../../api/album-value-api'
import AlbumValue from '../../../../../../components/album-value/Album-value'
import TickSvg from '../../../../../../components/svg/Tick-svg'
import Loader from '../../../../../../components/utils/Loader'
import { useCreateAlbumValueMutation } from '../../../../../../hooks/mutations'
import { useApiErrorHandler } from '../../../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useStore } from '../../../../../../hooks/use-store'
import { albumValuesKeys } from '../../../../../../query-keys/album-values-keys'
import { leaderboardKeys } from '../../../../../../query-keys/leaderboard-keys'
import { profilesKeys } from '../../../../../../query-keys/profiles-keys'
import { UpdateAlbumValueVoteData } from '../../../../../../types/album-value'
import { Release, ReleaseTypesEnum } from '../../../../../../types/release'
import { getAlbumValueInfluenceMultiplier } from '../../../../../../utils/get-album-value-influence-multiplier'
import { round2 } from '../../../../../../utils/round2'
import ReleaseDetailsEstimationDeleteButton from '../../buttons/Release-details-estimation-delete-button'
import ReleaseDetailsAlbumValueFormDepth from './Release-details-album-value-form-depth'
import ReleaseDetailsAlbumValueFormInfluence from './Release-details-album-value-form-influence'
import ReleaseDetailsAlbumValueFormIntegrity from './Release-details-album-value-form-integrity'
import ReleaseDetailsAlbumValueFormQuality from './Release-details-album-value-form-quality'
import ReleaseDetailsAlbumValueFormRarity from './Release-details-album-value-form-rarity'

interface IProps {
	release: Release
}

const ReleaseDetailsAlbumValueForm: FC<IProps> = observer(({ release }) => {
	/** HOOKS */
	const { notificationStore, authStore } = useStore()
	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	/** STATES */
	const [rarityGenre, setRarityGenre] = useState<number>(0.5)
	const [rarityPerformance, setRarityPerformance] = useState<number>(0.5)
	const [formatRelease, setFormatRelease] = useState<number>(0)
	const [integrityGenre, setIntegrityGenre] = useState<number>(0.5)
	const [integritySemantic, setIntegritySemantic] = useState<number>(0.5)
	const [depth, setDepth] = useState<number>(1)
	const [rhymes, setRhymes] = useState<number>(5)
	const [structure, setStructure] = useState<number>(5)
	const [styleImplementation, setStyleImplementation] = useState<number>(5)
	const [individuality, setIndividuality] = useState<number>(5)
	const [authorPopularity, setAuthorPopularity] = useState<number>(0.5)
	const [releaseAnticip, setReleaseAnticip] = useState(0.5)

	/**
	 * Fetch user's album value vote for the release
	 */
	const { data: userAlbumValueVote } = useQuery({
		queryKey: albumValuesKeys.user({
			releaseId: release.id,
			userId: authStore.user?.id ?? 'unknown',
		}),
		queryFn: () => AlbumValueAPI.findUserAlbumValueVote(release.id),
		enabled:
			authStore.isAuth && release.releaseType.type === ReleaseTypesEnum.ALBUM,
		staleTime: 1000 * 60 * 5,
		retry: false,
	})

	/** User's album value vote for this release */
	const userVote = userAlbumValueVote

	/** EFFECTS */
	useEffect(() => {
		setRarityGenre(userVote?.rarityGenre ?? 0.5)
		setRarityPerformance(userVote?.rarityPerformance ?? 0.5)
		setFormatRelease(userVote?.formatReleaseScore ?? 0)
		setIntegrityGenre(userVote?.integrityGenre ?? 0.5)
		setIntegritySemantic(userVote?.integritySemantic ?? 0.5)
		setDepth(userVote?.depthScore ?? 1)
		setRhymes(userVote?.qualityRhymesImages ?? 5)
		setStructure(userVote?.qualityStructureRhythm ?? 5)
		setStyleImplementation(userVote?.qualityStyleImpl ?? 5)
		setIndividuality(userVote?.qualityIndividuality ?? 5)
		setAuthorPopularity(userVote?.influenceAuthorPopularity ?? 0.5)
		setReleaseAnticip(userVote?.influenceReleaseAnticip ?? 0.5)
	}, [userVote])

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: albumValuesKeys.all },
			{ queryKey: profilesKeys.profile(authStore.user?.id || 'unknown') },
			{ queryKey: leaderboardKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	const { mutateAsync: createAsync, isPending: isCreating } =
		useCreateAlbumValueMutation()

	/**
	 * Update mutation for updating an existing album value vote
	 */
	const { mutateAsync: updateAsync, isPending: isUpdating } = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: UpdateAlbumValueVoteData
		}) => AlbumValueAPI.updateAlbumValueVote(id, data),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно изменили голос за ценность альбома!',
			)

			invalidateRelatedQueries()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Не удалось изменить голос за ценность альбома.')
		},
	})

	/**
	 * Delete mutation for deleting an existing album value vote
	 */
	const { mutateAsync: deleteAsync, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => AlbumValueAPI.deleteAlbumValueVote(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили голос за ценность альбома!',
			)

			invalidateRelatedQueries()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Не удалось удалить голос за ценность альбома.')
		},
	})

	/**
	 * Indicates if any mutation is in progress
	 *
	 * @returns {boolean} True if any mutation is pending, false otherwise
	 */
	const isPending = useMemo(
		() => isCreating || isUpdating || isDeleting,
		[isCreating, isUpdating, isDeleting],
	)

	/**
	 * Check if there are any changes compared to the user's existing vote
	 *
	 * @returns {boolean} True if there are changes, false otherwise
	 */
	const hasChanges = useMemo(() => {
		if (!userVote) return true
		return (
			rarityGenre !== userVote.rarityGenre ||
			rarityPerformance !== userVote.rarityPerformance ||
			formatRelease !== userVote.formatReleaseScore ||
			integrityGenre !== userVote.integrityGenre ||
			integritySemantic !== userVote.integritySemantic ||
			depth !== userVote.depthScore ||
			rhymes !== userVote.qualityRhymesImages ||
			structure !== userVote.qualityStructureRhythm ||
			styleImplementation !== userVote.qualityStyleImpl ||
			individuality !== userVote.qualityIndividuality ||
			authorPopularity !== userVote.influenceAuthorPopularity ||
			releaseAnticip !== userVote.influenceReleaseAnticip
		)
	}, [
		authorPopularity,
		depth,
		formatRelease,
		individuality,
		integrityGenre,
		integritySemantic,
		rarityGenre,
		rarityPerformance,
		releaseAnticip,
		rhymes,
		structure,
		styleImplementation,
		userVote,
	])

	/**
	 * Handle posting a new album value vote
	 */
	const handlePost = async () => {
		if (!checkAuth() || isPending) return

		return createAsync({
			releaseId: release.id,
			rarityGenre,
			rarityPerformance,
			formatReleaseScore: formatRelease,
			integrityGenre,
			integritySemantic,
			depthScore: depth,
			qualityRhymesImages: rhymes,
			qualityStructureRhythm: structure,
			qualityStyleImpl: styleImplementation,
			qualityIndividuality: individuality,
			influenceAuthorPopularity: authorPopularity,
			influenceReleaseAnticip: releaseAnticip,
		})
	}

	/**
	 * Handle updating an existing album value vote
	 */
	const handleUpdate = async () => {
		if (!checkAuth() || isPending || !userVote) return

		return updateAsync({
			id: userVote.id,
			data: {
				rarityGenre:
					rarityGenre !== userVote.rarityGenre ? rarityGenre : undefined,
				rarityPerformance:
					rarityPerformance !== userVote.rarityPerformance
						? rarityPerformance
						: undefined,
				formatReleaseScore:
					formatRelease !== userVote.formatReleaseScore
						? formatRelease
						: undefined,
				integrityGenre:
					integrityGenre !== userVote.integrityGenre
						? integrityGenre
						: undefined,
				integritySemantic:
					integritySemantic !== userVote.integritySemantic
						? integritySemantic
						: undefined,
				depthScore: depth !== userVote.depthScore ? depth : undefined,
				qualityRhymesImages:
					rhymes !== userVote.qualityRhymesImages ? rhymes : undefined,
				qualityStructureRhythm:
					structure !== userVote.qualityStructureRhythm ? structure : undefined,
				qualityStyleImpl:
					styleImplementation !== userVote.qualityStyleImpl
						? styleImplementation
						: undefined,
				qualityIndividuality:
					individuality !== userVote.qualityIndividuality
						? individuality
						: undefined,
				influenceAuthorPopularity:
					authorPopularity !== userVote.influenceAuthorPopularity
						? authorPopularity
						: undefined,
				influenceReleaseAnticip:
					releaseAnticip !== userVote.influenceReleaseAnticip
						? releaseAnticip
						: undefined,
			},
		})
	}

	/**
	 * Handle deleting an existing album value vote
	 */
	const handleDelete = async () => {
		if (!checkAuth() || isPending || !userVote) return

		return deleteAsync(userVote.id)
	}

	return (
		<div className='bg-zinc-900 rounded-xl border-white/10'>
			{userVote && (
				<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 mb-4 font-medium'>
					Вы уже оценивали ценность данного альбома. Вы можете изменить ее,
					заполнив форму ниже!
				</div>
			)}

			<div className='p-1.5 md:p-3 grid grid-cols-1 items-start'>
				<div className='grid grid-cols-1 gap-8'>
					<ReleaseDetailsAlbumValueFormRarity
						rarityGenre={rarityGenre}
						rarityPerformance={rarityPerformance}
						setRarityGenre={setRarityGenre}
						setRarityPerformance={setRarityPerformance}
					/>

					<ReleaseDetailsAlbumValueFormIntegrity
						formatRelease={formatRelease}
						setFormatRelease={setFormatRelease}
						integrityGenre={integrityGenre}
						setIntegrityGenre={setIntegrityGenre}
						integritySemantic={integritySemantic}
						setIntegritySemantic={setIntegritySemantic}
					/>

					<ReleaseDetailsAlbumValueFormDepth
						depth={depth}
						setDepth={setDepth}
					/>

					<ReleaseDetailsAlbumValueFormQuality
						rhymes={rhymes}
						setRhymes={setRhymes}
						structure={structure}
						setStructure={setStructure}
						realization={styleImplementation}
						setRealization={setStyleImplementation}
						individuality={individuality}
						setIndividuality={setIndividuality}
					/>

					<ReleaseDetailsAlbumValueFormInfluence
						authorPopularity={authorPopularity}
						setAuthorPopularity={setAuthorPopularity}
						releaseAnticip={releaseAnticip}
						setReleaseAnticip={setReleaseAnticip}
					/>
				</div>

				<div className='grid grid-cols-1 gap-1'>
					<AlbumValue
						rarity={{
							total: rarityGenre + rarityPerformance,
							rarityGenre: rarityGenre,
							rarityPerformance: rarityPerformance,
						}}
						integrity={{
							total: formatRelease + integrityGenre + integritySemantic,
							formatRelease: formatRelease,
							integrityGenre: integrityGenre,
							integritySemantic: integritySemantic,
						}}
						depth={depth}
						quality={{
							total: rhymes + structure + individuality + styleImplementation,
							factor:
								(rhymes + structure + individuality + styleImplementation) *
								0.025,
							rhymes: rhymes,
							structure: structure,
							individuality: individuality,
							styleImplementation: styleImplementation,
						}}
						influence={{
							total: releaseAnticip + authorPopularity,
							multiplier: getAlbumValueInfluenceMultiplier(
								releaseAnticip + authorPopularity,
							),
							releaseAnticip: releaseAnticip,
							authorPopularity: authorPopularity,
						}}
						totalValue={round2(
							(rarityGenre +
								rarityPerformance +
								formatRelease +
								integrityGenre +
								integritySemantic +
								depth) *
								(rhymes + structure + individuality + styleImplementation) *
								0.025 *
								getAlbumValueInfluenceMultiplier(
									releaseAnticip + authorPopularity,
								),
						)}
					/>
				</div>

				<div className='grid sm:flex items-center space-y-3 space-x-10 sm:justify-between mt-3'>
					<div className='w-full sm:w-45'>
						<ReleaseDetailsEstimationDeleteButton
							title={'Удалить'}
							disabled={!userVote || isPending}
							isLoading={isDeleting}
							onClick={handleDelete}
						/>
					</div>

					<button
						disabled={isPending || !hasChanges}
						onClick={() => (userVote ? handleUpdate() : handlePost())}
						className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-200 ${
							isPending || !hasChanges
								? 'bg-white/60 pointer-events-none'
								: 'cursor-pointer hover:bg-white/70 bg-white'
						}`}
					>
						{isUpdating || isCreating ? (
							<Loader className={'size-8'} />
						) : (
							<TickSvg className='size-8' />
						)}
					</button>
				</div>
			</div>
		</div>
	)
})

export default ReleaseDetailsAlbumValueForm
