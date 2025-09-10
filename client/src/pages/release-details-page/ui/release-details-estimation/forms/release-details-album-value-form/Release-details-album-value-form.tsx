import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import AlbumValue from '../../../../../../components/album-value/Album-value'
import TickSvg from '../../../../../../components/svg/Tick-svg'
import Loader from '../../../../../../components/utils/Loader'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useLoading } from '../../../../../../hooks/use-loading'
import { useStore } from '../../../../../../hooks/use-store'
import { getAlbumValueInfluenceMultiplier } from '../../../../../../utils/get-album-value-influence-multiplier'
import ReleaseDetailsEstimationDeleteButton from '../../buttons/Release-details-estimation-delete-button'
import ReleaseDetailsAlbumValueFormDepth from './Release-details-album-value-form-depth'
import ReleaseDetailsAlbumValueFormInfluence from './Release-details-album-value-form-influence'
import ReleaseDetailsAlbumValueFormIntegrity from './Release-details-album-value-form-integrity'
import ReleaseDetailsAlbumValueFormQuality from './Release-details-album-value-form-quality'
import ReleaseDetailsAlbumValueFormRarity from './Release-details-album-value-form-rarity'

interface IProps {
	releaseId: string
}

function round2(value: number): number {
	return Math.round((value + Number.EPSILON) * 100) / 100
}

const ReleaseDetailsAlbumValueForm: FC<IProps> = observer(({ releaseId }) => {
	const { releaseDetailsPageStore, notificationStore } = useStore()

	const { checkAuth } = useAuth()

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

	const userVote = releaseDetailsPageStore.userAlbumValueVote

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

	const { execute: post, isLoading: isPosting } = useLoading(
		releaseDetailsPageStore.postAlbumValueVote
	)

	const { execute: update, isLoading: isUpdating } = useLoading(
		releaseDetailsPageStore.updateAlbumValueVote
	)

	const { execute: _delete, isLoading: isDeleting } = useLoading(
		releaseDetailsPageStore.deleteAlbumValueVote
	)

	const handlePost = async () => {
		if (!checkAuth() || isUpdating || isPosting) return

		const errors = await post(
			releaseId,
			rarityGenre,
			rarityPerformance,
			formatRelease,
			integrityGenre,
			integritySemantic,
			depth,
			rhymes,
			structure,
			styleImplementation,
			individuality,
			authorPopularity,
			releaseAnticip
		)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Вы успешно оставили голос за ценность альбома!'
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	const handleUpdate = async () => {
		if (!checkAuth() || isUpdating || isPosting || !userVote) return

		const errors = await update(
			releaseId,
			userVote.id,
			rarityGenre !== userVote.rarityGenre ? rarityGenre : undefined,
			rarityPerformance !== userVote.rarityPerformance
				? rarityPerformance
				: undefined,
			formatRelease !== userVote.formatReleaseScore ? formatRelease : undefined,
			integrityGenre !== userVote.integrityGenre ? integrityGenre : undefined,
			integritySemantic !== userVote.integritySemantic
				? integritySemantic
				: undefined,
			depth !== userVote.depthScore ? depth : undefined,
			rhymes !== userVote.qualityRhymesImages ? rhymes : undefined,
			structure !== userVote.qualityStructureRhythm ? structure : undefined,
			styleImplementation !== userVote.qualityStyleImpl
				? styleImplementation
				: undefined,
			individuality !== userVote.qualityIndividuality
				? individuality
				: undefined,
			authorPopularity !== userVote.influenceAuthorPopularity
				? authorPopularity
				: undefined,
			releaseAnticip !== userVote.influenceReleaseAnticip
				? releaseAnticip
				: undefined
		)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Вы успешно изменили голос за ценность альбома!'
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	const handleDelete = async () => {
		if (!checkAuth() || isUpdating || isPosting || isDeleting || !userVote)
			return

		const errors = await _delete(userVote.id, releaseId)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили голос за ценность альбома!'
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
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
							disabled={isDeleting || isUpdating}
							isLoading={isDeleting}
							onClick={handleDelete}
						/>
					</div>

					<button
						disabled={isPosting || isUpdating || !hasChanges}
						onClick={() => (userVote ? handleUpdate() : handlePost())}
						className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-200 ${
							isPosting || !hasChanges || isUpdating
								? 'bg-white/60 pointer-events-none'
								: 'cursor-pointer hover:bg-white/70 bg-white'
						}`}
					>
						{isPosting || isUpdating ? (
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
