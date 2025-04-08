import { FC } from 'react'
import { ReleaseRatingTypesEnum } from '../../../models/release/ReleaseRatingTypes'

const DetailRow: FC<{ title: string; total: string; color: string }> = ({
	title,
	total,
	color,
}) => {
	return (
		<div className='flex w-full justify-between items-center border-b-2 border-white/20 border-dashed'>
			<p className='text-xs font-bold'>{title}</p>
			<span className={`${color} font-bold text-lg`}>{total}</span>
		</div>
	)
}

interface IProps {
	rating: {
		type: string
		total: number
	}
	ratingDetails:
		| {
				type: string
				details: {
					rhymes: number
					structure: number
					atmosphere: number
					realization: number
					individuality: number
					release_rating_id: string
				}
		  }
		| undefined
}

const RatingDetailsTooltip: FC<IProps> = ({ rating, ratingDetails }) => {
	const getTitle = (type: string) => {
		switch (type) {
			case ReleaseRatingTypesEnum.SUPER_USER:
				return 'Средняя оценка супер-пользователей'
			case ReleaseRatingTypesEnum.WITH_TEXT:
				return 'Средняя оценка рецензий пользователей'
			case ReleaseRatingTypesEnum.NO_TEXT:
				return 'Средняя оценка без рецензий пользователей'
		}
	}

	return (
		ratingDetails && (
			<div className='w-70 flex flex-col bg-primary border border-gray-600 rounded-lg p-2 gap-y-1'>
				<p className='text-white font-bold p-1.5 rounded-lg bg-white/30 text-left text-sm'>
					{getTitle(rating.type)}
				</p>
				<DetailRow
					title={'Рифмы / Образы'}
					total={`${ratingDetails.details.rhymes}`}
					color={'text-[rgba(35,101,199)]'}
				/>
				<DetailRow
					title={'Структура / Ритмика'}
					total={`${ratingDetails.details.structure}`}
					color={'text-[rgba(35,101,199)]'}
				/>
				<DetailRow
					title={'Реализация стиля'}
					total={`${ratingDetails.details.realization}`}
					color={'text-[rgba(35,101,199)]'}
				/>
				<DetailRow
					title={'Индивидуальность / Харизма'}
					total={`${ratingDetails.details.individuality}`}
					color={'text-[rgba(35,101,199)]'}
				/>
				<DetailRow
					title={'Атмосфера / Вайб'}
					total={`${ratingDetails.details.atmosphere}`}
					color={'text-[rgba(160,80,222)]'}
				/>
			</div>
		)
	)
}

export default RatingDetailsTooltip
