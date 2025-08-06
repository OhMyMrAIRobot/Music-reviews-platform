import { FC } from 'react'
import { IReleaseRating } from '../../../../models/release/release-rating'
import { IReleaseRatingDetails } from '../../../../models/release/release-rating-details'
import { ReleaseRatingTypesEnum } from '../../../../models/release/release-rating-types-enum'

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
	rating: IReleaseRating
	ratingDetails?: IReleaseRatingDetails
}

const getTitle = (type: string) => {
	switch (type) {
		case ReleaseRatingTypesEnum.MEDIA:
			return 'Средняя оценка Медиа'
		case ReleaseRatingTypesEnum.WITH_TEXT:
			return 'Средняя оценка рецензий пользователей'
		case ReleaseRatingTypesEnum.WITHOUT_TEXT:
			return 'Средняя оценка без рецензий пользователей'
	}
}

const ReleaseDetailsRatingsTooltip: FC<IProps> = ({
	rating,
	ratingDetails,
}) => {
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

export default ReleaseDetailsRatingsTooltip
