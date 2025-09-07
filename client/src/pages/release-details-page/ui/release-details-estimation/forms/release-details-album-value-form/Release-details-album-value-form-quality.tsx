import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider'
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section'

interface IProps {
	rhymes: number
	setRhymes: (val: number) => void
	structure: number
	setStructure: (val: number) => void
	realization: number
	setRealization: (val: number) => void
	individuality: number
	setIndividuality: (val: number) => void
}

const ReleaseDetailsAlbumValueFormQuality: FC<IProps> = observer(
	({
		rhymes,
		setRhymes,
		structure,
		setStructure,
		realization,
		setRealization,
		individuality,
		setIndividuality,
	}) => {
		return (
			<ReleaseDetailsAlbumValueSection
				pos={4}
				title={'Качество'}
				minMaxText={'(в процентах)'}
				description={
					<p>
						Процент реализации релиза по четырем базовым критериям
						(«рифмы/образы», «структура/ритмика», «реализация стиля»,
						«индивидуальность/харизма»), где 1 балл за базовый критерий = 2,5%
					</p>
				}
				value={`${(rhymes + structure + realization + individuality) * 2.5}%`}
				maxValue={'100%'}
			>
				<div className='bg-zinc-800 rounded-lg xl:ml-10 px-5 py-3 border border-zinc-700'>
					<div className='font-bold text-center mb-5'>
						Базовые критерии 90-бальной системы оценивания релизов
						<span className='opacity-60'> (от 4 до 40)</span>
					</div>
					<div className='grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 xl:gap-y-4'>
						<ReleaseDetailsAlbumValueFormSlider
							value={rhymes}
							setValue={setRhymes}
							title='Рифмы / Образы'
							min={1}
							max={10}
							step={1}
							valueTitle={''}
							valueDescription={''}
						/>

						<ReleaseDetailsAlbumValueFormSlider
							value={structure}
							setValue={setStructure}
							title='Структура / Ритмика'
							min={1}
							max={10}
							step={1}
							valueTitle={''}
							valueDescription={''}
						/>

						<ReleaseDetailsAlbumValueFormSlider
							value={realization}
							setValue={setRealization}
							title='Реализация стиля'
							min={1}
							max={10}
							step={1}
							valueTitle={''}
							valueDescription={''}
						/>

						<ReleaseDetailsAlbumValueFormSlider
							value={individuality}
							setValue={setIndividuality}
							title='Индивидуальность / Харизма'
							min={1}
							max={10}
							step={1}
							valueTitle={''}
							valueDescription={''}
						/>
					</div>
				</div>
			</ReleaseDetailsAlbumValueSection>
		)
	}
)

export default ReleaseDetailsAlbumValueFormQuality
