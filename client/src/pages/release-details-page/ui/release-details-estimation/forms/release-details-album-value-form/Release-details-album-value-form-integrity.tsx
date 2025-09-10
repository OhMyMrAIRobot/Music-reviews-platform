import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler'
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider'
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section'

interface IProps {
	formatRelease: number
	setFormatRelease: (val: number) => void
	integrityGenre: number
	setIntegrityGenre: (val: number) => void
	integritySemantic: number
	setIntegritySemantic: (val: number) => void
}

const getFormatReleaseValueText = makeStepLabeler(
	[
		'EP (мини-альбом) из 4–6 треков, либо заявленный автором EP (мини-альбом) на бо́льшее количество песен. Делюкс-версия (если не заявлена автором как расширение концепции альбома). Микстейп. Сборник/Компиляция. Переиздание. Акустическая версия. Концертная запись',
		'LP (студийный альбом) от 7 песен, либо заявленный автором концептуальный альбом на меньшее количество песен (от 3-х). Делюкс-версия (если заявлена автором как цельное расширение концепции альбома)',
	],
	0,
	1
)

const getIntegrityGenreValueText = makeStepLabeler(
	[
		'Сборник различных жанровых идей без общей задумки',
		'Релиз из двух-трёх жанровых идей',
		'Все композиции с релиза объединены одной жанровой идеей. Либо цельный звуковой эксперимент, где очередность песен имеет цельную структуру и развитие',
	],
	0.5,
	1
)

const getIntegritySemanticValueText = makeStepLabeler(
	[
		'Релиз не имеет общей смысловой целостности',
		'Все композиции с релиза объединены в целостное смысловое повествование',
	],
	0.5,
	1
)

const ReleaseDetailsAlbumValueFormIntegrity: FC<IProps> = observer(
	({
		formatRelease,
		setFormatRelease,
		integrityGenre,
		setIntegrityGenre,
		integritySemantic,
		setIntegritySemantic,
	}) => {
		return (
			<ReleaseDetailsAlbumValueSection
				pos={2}
				title={'Целостность'}
				minMaxText={'(от 1 до 5)'}
				description={
					<>
						<p>
							Формат релиза, и соблюдение его жанровой и смысловой целостности
						</p>
						<p>
							Рассчитывается как совокупность подкритериев «Формат релиза»,
							«Жанровую целостность» и «Смысловую целостность»
						</p>
					</>
				}
				value={`${formatRelease + integrityGenre + integritySemantic}`}
				maxValue={'5'}
			>
				<div className='grid grid-cols-1 xl:grid-cols-3 gap-x-6 gap-y-2 lg:gap-y-4 xl:pl-10 mt-3'>
					<ReleaseDetailsAlbumValueFormSlider
						value={formatRelease}
						setValue={setFormatRelease}
						title='Формат релиза'
						min={0}
						max={1}
						step={1}
						valueTitle={''}
						valueDescription={getFormatReleaseValueText(formatRelease)}
					/>

					<ReleaseDetailsAlbumValueFormSlider
						value={integrityGenre}
						setValue={setIntegrityGenre}
						title='Жанровая целостность'
						min={0.5}
						max={2.5}
						step={1}
						valueTitle={''}
						valueDescription={getIntegrityGenreValueText(integrityGenre)}
					/>

					<ReleaseDetailsAlbumValueFormSlider
						value={integritySemantic}
						setValue={setIntegritySemantic}
						title='Смысловая целостность'
						min={0.5}
						max={1.5}
						step={1}
						valueTitle={''}
						valueDescription={getIntegritySemanticValueText(integritySemantic)}
					/>
				</div>
			</ReleaseDetailsAlbumValueSection>
		)
	}
)

export default ReleaseDetailsAlbumValueFormIntegrity
