import { FC } from 'react'
import SliderGroup from './Slider-group'

interface IProps {
	rhymes: number
	setRhymes: (val: number) => void
	structure: number
	setStructure: (val: number) => void
	realization: number
	setRealization: (val: number) => void
	individuality: number
	setIndividuality: (val: number) => void
	atmosphere: number
	setAtmosphere: (val: number) => void
}

const SendReviewFormMarks: FC<IProps> = ({
	rhymes,
	setRhymes,
	structure,
	setStructure,
	realization,
	setRealization,
	individuality,
	setIndividuality,
	atmosphere,
	setAtmosphere,
}) => {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
			<div className='grid col-span-full px-5 pt-3 pb-5 w-full grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-2 lg:gap-y-3 lg:gap-x-5 border border-[rgba(86,118,234)] bg-gradient-to-br from-[rgba(86,118,234)]/20 to-[rgba(86,118,234)]/5 rounded-xl'>
				<SliderGroup
					title={'Рифмы / Образы'}
					value={rhymes}
					onChange={setRhymes}
					beforeColor={
						'bg-gradient-to-br from-[rgba(86,118,234,.5)] to-[rgba(86,118,234,1)]'
					}
					afterColor={''}
				/>
				<SliderGroup
					title={'Структра / Ритмика'}
					value={structure}
					onChange={setStructure}
					beforeColor={
						'bg-gradient-to-br from-[rgba(86,118,234,.5)] to-[rgba(86,118,234,1)]'
					}
					afterColor={''}
				/>
				<SliderGroup
					title={'Реализация стиля'}
					value={realization}
					onChange={setRealization}
					beforeColor={
						'bg-gradient-to-br from-[rgba(86,118,234,.5)] to-[rgba(86,118,234,1)]'
					}
					afterColor={''}
				/>
				<SliderGroup
					title={'Индивидуальность / Харизма'}
					value={individuality}
					onChange={setIndividuality}
					beforeColor={
						'bg-gradient-to-br from-[rgba(86,118,234,.5)] to-[rgba(86,118,234,1)]'
					}
					afterColor={''}
				/>
			</div>
			<div className='col-span-full px-5 pt-3 pb-5 w-full rounded-xl border border-[rgba(160,80,222)] bg-gradient-to-br from-[rgba(160,80,222)]/20 to-[rgba(160,80,222)]/5'>
				<SliderGroup
					title={'Атмосфера / Вайб'}
					value={atmosphere}
					onChange={setAtmosphere}
					beforeColor={
						'bg-gradient-to-br from-[rgba(160,80,222,5)] to-[rgba(160,80,222,1)]'
					}
					afterColor={''}
				/>
			</div>
		</div>
	)
}

export default SendReviewFormMarks
