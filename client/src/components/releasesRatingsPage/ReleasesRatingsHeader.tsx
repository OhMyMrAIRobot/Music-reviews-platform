import { FC } from 'react'
import ComboBox from '../header/buttons/ComboBox'

const MonthEnum = Object.freeze({
	1: 'Январь',
	2: 'Февраль',
	3: 'Март',
	4: 'Апрель',
	5: 'Май',
	6: 'Июнь',
	7: 'Июль',
	8: 'Август',
	9: 'Сентябрь',
	10: 'Октябрь',
	11: 'Ноябрь',
	12: 'Декабрь',
})

type MonthEnumType = keyof typeof MonthEnum

interface IProps {
	selectedMonth: number
	setSelectedMonth: (value: number) => void
	selectedYear: number | null
	setSelectedYear: (value: number | null) => void
	minYear: number
	maxYear: number
}

const ReleasesRatingsHeader: FC<IProps> = ({
	selectedMonth,
	setSelectedMonth,
	selectedYear,
	setSelectedYear,
	minYear,
	maxYear,
}) => {
	const handleMonthChange = (value: string) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const entry = Object.entries(MonthEnum).find(([_, name]) => name === value)
		const month = entry ? parseInt(entry[0], 10) : selectedMonth
		setSelectedMonth(month)
	}

	const yearOptions = [
		'Все время',
		...Array.from({ length: maxYear - minYear + 1 }, (_, i) =>
			(maxYear - i).toString()
		),
	]

	const handleYearChange = (selectedValue: string) => {
		if (selectedValue === yearOptions[0]) {
			setSelectedYear(null)
		} else {
			setSelectedYear(parseInt(selectedValue, 10))
		}
	}

	return (
		<>
			<h1 className='text-lg mg:text-xl lg:text-3xl font-bold'>
				Рейтинг релизов
			</h1>

			<div className='rounded-lg border border-white/10 p-3 bg-zinc-900 mt-4 lg:mt-8 md:flex md:items-center'>
				<p className='font-bold text-gray-400 text-sm md:text-base md:mr-5 max-md:mb-2'>
					Фильтр
				</p>
				<div className='flex flex-col gap-y-2 md:flex-row md:gap-x-5'>
					<div className='w-50'>
						<ComboBox
							options={yearOptions}
							onChange={handleYearChange}
							className='border border-white/10'
							value={
								selectedYear === null ? yearOptions[0] : selectedYear.toString()
							}
						/>
					</div>
					{selectedYear !== null && (
						<div className='w-50'>
							<ComboBox
								options={Object.values(MonthEnum)}
								onChange={handleMonthChange}
								className='border border-white/10'
								value={
									MonthEnum[selectedMonth as MonthEnumType] ?? 'Неизвестно'
								}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default ReleasesRatingsHeader
