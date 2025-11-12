import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FC, useEffect, useMemo, useState } from 'react'
import { AlbumValueAPI } from '../../../../../../api/album-value-api'
import AlbumValue from '../../../../../../components/album-value/Album-value'
import TickSvg from '../../../../../../components/svg/Tick-svg'
import Loader from '../../../../../../components/utils/Loader'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useStore } from '../../../../../../hooks/use-store'
import { IReleaseDetails } from '../../../../../../models/release/release-details/release-details'
import { ReleaseTypesEnum } from '../../../../../../models/release/release-type/release-types-enum'
import { albumValuesKeys } from '../../../../../../query-keys/album-values-keys'
import { leaderboardKeys } from '../../../../../../query-keys/leaderboard-keys'
import { profileKeys } from '../../../../../../query-keys/profile-keys'
import { releaseDetailsKeys } from '../../../../../../query-keys/release-details-keys'
import authStore from '../../../../../../stores/auth-store'
import { getAlbumValueInfluenceMultiplier } from '../../../../../../utils/get-album-value-influence-multiplier'
import ReleaseDetailsEstimationDeleteButton from '../../buttons/Release-details-estimation-delete-button'
import ReleaseDetailsAlbumValueFormDepth from './Release-details-album-value-form-depth'
import ReleaseDetailsAlbumValueFormInfluence from './Release-details-album-value-form-influence'
import ReleaseDetailsAlbumValueFormIntegrity from './Release-details-album-value-form-integrity'
import ReleaseDetailsAlbumValueFormQuality from './Release-details-album-value-form-quality'
import ReleaseDetailsAlbumValueFormRarity from './Release-details-album-value-form-rarity'

interface IProps {
	release: IReleaseDetails
}

function round2(value: number): number {
	return Math.round((value + Number.EPSILON) * 100) / 100
}

const ReleaseDetailsAlbumValueForm: FC<IProps> = ({ release }) => {
	const { notificationStore } = useStore()

	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()

	const invalidateRelatedQueries = () => {
		const keys = [
			releaseDetailsKeys.userAlbumValueVote(release.id),
			albumValuesKeys.all,
			albumValuesKeys.byRelease(release.id),
			profileKeys.profile(authStore.user?.id || 'unknown'),
			leaderboardKeys.all,
		]
		keys.forEach(key => queryClient.invalidateQueries({ queryKey: key }))
	}

	const createMutation = useMutation({
		mutationFn: (data: {
			rarityGenre: number
			rarityPerformance: number
			formatReleaseScore: number
			integrityGenre: number
			integritySemantic: number
			depthScore: number
			qualityRhymesImages: number
			qualityStructureRhythm: number
			qualityStyleImpl: number
			qualityIndividuality: number
			influenceAuthorPopularity: number
			influenceReleaseAnticip: number
		}) =>
			AlbumValueAPI.postAlbumValue(
				release.id,
				data.rarityGenre,
				data.rarityPerformance,
				data.formatReleaseScore,
				data.integrityGenre,
				data.integritySemantic,
				data.depthScore,
				data.qualityRhymesImages,
				data.qualityStructureRhythm,
				data.qualityStyleImpl,
				data.qualityIndividuality,
				data.influenceAuthorPopularity,
				data.influenceReleaseAnticip
			),
		onSuccess: data => {
			invalidateRelatedQueries()
			queryClient.setQueryData(
				releaseDetailsKeys.userAlbumValueVote(release.id),
				data
			)
		},
	})

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: Partial<{
				rarityGenre: number
				rarityPerformance: number
				formatReleaseScore: number
				integrityGenre: number
				integritySemantic: number
				depthScore: number
				qualityRhymesImages: number
				qualityStructureRhythm: number
				qualityStyleImpl: number
				qualityIndividuality: number
				influenceAuthorPopularity: number
				influenceReleaseAnticip: number
			}>
		}) =>
			AlbumValueAPI.updateAlbumValue(
				id,
				data.rarityGenre,
				data.rarityPerformance,
				data.formatReleaseScore,
				data.integrityGenre,
				data.integritySemantic,
				data.depthScore,
				data.qualityRhymesImages,
				data.qualityStructureRhythm,
				data.qualityStyleImpl,
				data.qualityIndividuality,
				data.influenceAuthorPopularity,
				data.influenceReleaseAnticip
			),
		onSuccess: data => {
			invalidateRelatedQueries()
			queryClient.setQueryData(
				releaseDetailsKeys.userAlbumValueVote(release.id),
				data
			)
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => AlbumValueAPI.deleteAlbumValueVote(id),
		onSuccess: () => {
			invalidateRelatedQueries()
			queryClient.setQueryData(
				releaseDetailsKeys.userAlbumValueVote(release.id),
				undefined
			)
		},
	})

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

	const { data: userAlbumValueVote } = useQuery({
		queryKey: releaseDetailsKeys.userAlbumValueVote(release.id),
		queryFn: () => AlbumValueAPI.fetchUserAlbumValueVote(release.id),
		enabled: authStore.isAuth && release.releaseType === ReleaseTypesEnum.ALBUM,
		staleTime: 1000 * 60 * 5,
		retry: false,
	})

	const userVote = userAlbumValueVote

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

	const handlePost = async () => {
		if (
			!checkAuth() ||
			createMutation.isPending ||
			updateMutation.isPending ||
			deleteMutation.isPending
		)
			return

		try {
			await createMutation.mutateAsync({
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

			notificationStore.addSuccessNotification(
				'Вы успешно оставили голос за ценность альбома!'
			)
		} catch (error: unknown) {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		}
	}

	const handleUpdate = async () => {
		if (
			!checkAuth() ||
			createMutation.isPending ||
			updateMutation.isPending ||
			deleteMutation.isPending ||
			!userVote
		)
			return

		try {
			await updateMutation.mutateAsync({
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
						structure !== userVote.qualityStructureRhythm
							? structure
							: undefined,
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

			notificationStore.addSuccessNotification(
				'Вы успешно изменили голос за ценность альбома!'
			)
		} catch (error: unknown) {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		}
	}

	const handleDelete = async () => {
		if (
			!checkAuth() ||
			createMutation.isPending ||
			updateMutation.isPending ||
			deleteMutation.isPending ||
			!userVote
		)
			return

		try {
			await deleteMutation.mutateAsync(userVote.id)
			notificationStore.addSuccessNotification(
				'Вы успешно удалили голос за ценность альбома!'
			)
		} catch (error: unknown) {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		}
	}

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
								releaseAnticip + authorPopularity
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
									releaseAnticip + authorPopularity
								)
						)}
					/>
				</div>

				<div className='grid sm:flex items-center space-y-3 space-x-10 sm:justify-between mt-3'>
					<div className='w-full sm:w-45'>
						<ReleaseDetailsEstimationDeleteButton
							title={'Удалить'}
							disabled={
								!userVote ||
								createMutation.isPending ||
								updateMutation.isPending ||
								deleteMutation.isPending
							}
							isLoading={deleteMutation.isPending}
							onClick={handleDelete}
						/>
					</div>

					<button
						disabled={deleteMutation.isPending || !hasChanges}
						onClick={() => (userVote ? handleUpdate() : handlePost())}
						className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-200 ${
							deleteMutation.isPending ||
							updateMutation.isPending ||
							createMutation.isPending ||
							!hasChanges
								? 'bg-white/60 pointer-events-none'
								: 'cursor-pointer hover:bg-white/70 bg-white'
						}`}
					>
						{updateMutation.isPending || createMutation.isPending ? (
							<Loader className={'size-8'} />
						) : (
							<TickSvg className='size-8' />
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ReleaseDetailsAlbumValueForm
