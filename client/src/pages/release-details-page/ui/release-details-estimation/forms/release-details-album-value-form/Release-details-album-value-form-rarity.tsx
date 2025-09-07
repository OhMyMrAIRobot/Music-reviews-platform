import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler'
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider'

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
			<div className='relative'>
				{/* HEADER */}
				<div className='flex items-start space-x-3 mb-4'>
					<div className='size-6 max-md:text-[11px] md:size-8 bg-white/10 rounded-full flex items-center justify-center text-center left-4 top-0'>
						1
					</div>

					{/* HEADER TEXT */}
					<div className='flex justify-between gap-3 items-start lg:items-center w-full'>
						<div>
							<div className='font-bold inline-flex lg:text-xl mb-1.5 cursor-default flex-wrap'>
								<span className='mr-2'>Редкость</span>
								<span className='opacity-60'>(от 1 до 5)</span>
							</div>
							<div className='text-xs lg:text-sm text-zinc-400'>
								<p>
									Распространенность музыкального жанра и формата его исполнения
									в индустрии
								</p>
								<p>
									Рассчитывается как совокупность подкритериев «Редкость жанра»
									и «Редкость формата исполнения»
								</p>
							</div>
						</div>

						<div className='bg-zinc-800 shrink-0 border border-zinc-700 min-w-[55px] rounded-lg flex items-center text-center justify-center px-1.5 lg:px-3 py-1'>
							<span className='lg:text-2xl font-bold mr-1 lg:mr-2'>
								{rarityGenre + rarityPerformance}
							</span>
							<span className='opacity-60'>/ 5</span>
						</div>
					</div>
				</div>

				{/* SLIDERS */}
				<div className='grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 lg:gap-y-4 lg:pl-10 mt-3'>
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
			</div>
		)
	}
)

export default ReleaseDetailsAlbumValueFormRarity
