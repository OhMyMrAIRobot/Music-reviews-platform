import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import AlbumValue from '../../../../../../components/album-value/Album-value'
import { getAlbumValueInfluenceMultiplier } from '../../../../../../utils/get-album-value-influence-multiplier'
import ReleaseDetailsAlbumValueFormDepth from './Release-details-album-value-form-depth'
import ReleaseDetailsAlbumValueFormInfluence from './Release-details-album-value-form-influence'
import ReleaseDetailsAlbumValueFormIntegrity from './Release-details-album-value-form-integrity'
import ReleaseDetailsAlbumValueFormQuality from './Release-details-album-value-form-quality'
import ReleaseDetailsAlbumValueFormRarity from './Release-details-album-value-form-rarity'

interface IProps {
	releaseId: string
}

const ReleaseDetailsAlbumValueForm: FC<IProps> = observer(() => {
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

	return (
		<div className='bg-zinc-900 rounded-xl border-white/10'>
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
						totalValue={
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
						}
					/>
				</div>
			</div>
		</div>
	)
})

export default ReleaseDetailsAlbumValueForm
