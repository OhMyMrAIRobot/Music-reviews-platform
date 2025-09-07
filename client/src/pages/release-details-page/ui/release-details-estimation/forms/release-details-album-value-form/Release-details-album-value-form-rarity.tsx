import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler'
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider'
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section'

interface IProps {
	rarityGenre: number
	setRarityGenre: (val: number) => void
	rarityPerformance: number
	setRarityPerformance: (val: number) => void
}

const getRarityGenreValueTitle = makeStepLabeler(
	['Распространённый жанр', 'Редкий жанр', 'Уникальный жанр'],
	0.5,
	1
)

const getRarityGenreValueText = makeStepLabeler(
	[
		'Активно представлен в русскоязычной индустрии, часто воспроизводим разными артистами и хорошо узнаваем',
		'Присутствует ограниченно, нишевый, на узкий круг слушателей. Возможен как большой перегруз элементами, так и кричащий нарочитый минимализм',
		'Почти или полностью отсутствует в русскоязычном поле, требует особого контекста. Арт-объект, шумовая импровизация, антиформа',
	],
	0.5,
	1
)

const getRarityPerfomanceValueTitle = makeStepLabeler(
	[
		'Распространённый формат исполнения',
		'Редкий формат исполнения',
		'Уникальный формат исполнения',
	],
	0.5,
	1
)

const getRarityPerfomanceValueText = makeStepLabeler(
	[
		'Классический флоу или формат пения. Распространенная и/или академическая форма реализации, применимая в популярной музыке',
		'Нетипичный флоу или рисунок вокала, уникальный тембр артиста. Редкий подход в саунд-дизайне, акапеллы',
		'Импровизация, разрушение формы, фрагментированность, перформативные элементы. Созданный автором уникальный стиль',
	],
	0.5,
	1
)

const ReleaseDetailsAlbumValueFormRarity: FC<IProps> = observer(
	({
		rarityGenre,
		rarityPerformance,
		setRarityGenre,
		setRarityPerformance,
	}) => {
		return (
			<ReleaseDetailsAlbumValueSection
				pos={1}
				title={'Редкость'}
				minMaxText={'(от 1 до 5)'}
				description={
					<>
						<p>
							Распространенность музыкального жанра и формата его исполнения в
							индустрии
						</p>
						<p>
							Рассчитывается как совокупность подкритериев «Редкость жанра» и
							«Редкость формата исполнения»
						</p>
					</>
				}
				value={`${rarityGenre + rarityPerformance}`}
				maxValue={'5'}
			>
				<div className='grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 xl:gap-y-4 xl:pl-10 mt-3'>
					<ReleaseDetailsAlbumValueFormSlider
						value={rarityGenre}
						setValue={setRarityGenre}
						title='Редкость жанра'
						min={0.5}
						max={2.5}
						step={1}
						valueTitle={getRarityGenreValueTitle(rarityGenre)}
						valueDescription={getRarityGenreValueText(rarityGenre)}
					/>
					<ReleaseDetailsAlbumValueFormSlider
						value={rarityPerformance}
						setValue={setRarityPerformance}
						title='Редкость формата испонения'
						min={0.5}
						max={2.5}
						step={1}
						valueTitle={getRarityPerfomanceValueTitle(rarityPerformance)}
						valueDescription={getRarityPerfomanceValueText(rarityPerformance)}
					/>
				</div>
			</ReleaseDetailsAlbumValueSection>
		)
	}
)

export default ReleaseDetailsAlbumValueFormRarity
