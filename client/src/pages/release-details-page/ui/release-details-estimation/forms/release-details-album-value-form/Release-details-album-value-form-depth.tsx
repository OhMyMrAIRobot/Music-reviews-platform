import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler'
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider'
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section'

interface IProps {
	depth: number
	setDepth: (val: number) => void
}

const getDepthValueText = makeStepLabeler(
	[
		'Музыка без слов или слова как повторяющийся набор звуков (чаще электронная музыка)',
		'Незамысловатый развлекательный посыл с заурядными драмами и конфликтами (репрезенты, диссы, карикатура, пародия или юмор)',
		'Чувственная саморефлексия о позиционировании личности в современном обществе или о переживании личной драмы',
		'Глубокие рассуждения об общественной жизни и текущих явлениях социума',
		'Осознанное донесение вневременных или высоких смыслов как суть релиза (религия, Вселенная, жизнь и смерть, исторические процессы)',
	],
	1,
	1
)

const ReleaseDetailsAlbumValueFormDepth: FC<IProps> = observer(
	({ depth, setDepth }) => {
		return (
			<ReleaseDetailsAlbumValueSection
				pos={3}
				title={'Глубина'}
				minMaxText={'(от 1 до 5)'}
				description={
					<>
						<p>
							Вертикаль смысла: от игры со звуком и инстинкта к личной
							рефлексии, общественной мысли и вневременному смыслу
						</p>
					</>
				}
				value={`${depth}`}
				maxValue={'5'}
			>
				<div className='xl:pl-10'>
					<ReleaseDetailsAlbumValueFormSlider
						value={depth}
						setValue={setDepth}
						title='Глубина'
						min={1}
						max={5}
						step={1}
						valueTitle={''}
						valueDescription={getDepthValueText(depth)}
					/>
				</div>
			</ReleaseDetailsAlbumValueSection>
		)
	}
)

export default ReleaseDetailsAlbumValueFormDepth
