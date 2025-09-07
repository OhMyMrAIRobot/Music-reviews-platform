import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import ReleaseDetailsAlbumValueFormIntegrity from './Release-details-album-value-form-integrity'
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
				</div>

				<div className='grid grid-cols-1 gap-1'></div>
			</div>
		</div>
	)
})

export default ReleaseDetailsAlbumValueForm
