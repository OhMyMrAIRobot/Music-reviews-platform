import { FC } from 'react'
import ComboBox from '../../../components/buttons/Combo-box'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import {
	MonthEnumType,
	MonthsEnum,
} from '../../../types/common/enums/months-enum'

interface IProps {
	selectedMonth: number
	setSelectedMonth: (value: number) => void
	selectedYear: number | null
	setSelectedYear: (value: number | null) => void
	minYear: number
	maxYear: number
	isLoading: boolean
}

const ReleasesRatingPageHeader: FC<IProps> = ({
	selectedMonth,
	setSelectedMonth,
	selectedYear,
	setSelectedYear,
	minYear,
	maxYear,
	isLoading,
}) => {
	const handleMonthChange = (value: string) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const entry = Object.entries(MonthsEnum).find(([_, name]) => name === value)
		const month = entry ? parseInt(entry[0], 10) : selectedMonth
		setSelectedMonth(month)
	}

	const yearOptions = [
		'Все время',
		...Array.from({ length: minYear ? maxYear - minYear + 1 : 0 }, (_, i) =>
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
			<h1 className='text-2xl lg:text-3xl font-semibold'>Рейтинг релизов</h1>

			<div className='rounded-lg border border-white/10 p-3 bg-zinc-900 mt-4 lg:mt-8 md:flex md:items-center'>
				<p className='font-bold text-gray-400 text-sm md:text-base md:mr-5 max-md:mb-2'>
					Фильтр
				</p>
				<div className='flex flex-col gap-y-2 md:flex-row md:gap-x-5'>
					<div className='w-50 h-10'>
						{isLoading ? (
							<SkeletonLoader className='size-full rounded-md' />
						) : (
							<ComboBox
								options={yearOptions}
								onChange={handleYearChange}
								className='border border-white/10'
								value={
									selectedYear === null
										? yearOptions[0]
										: selectedYear.toString()
								}
							/>
						)}
					</div>
					{selectedYear !== null && (
						<div className='w-50 h-10'>
							{isLoading ? (
								<SkeletonLoader className='size-full rounded-md' />
							) : (
								<ComboBox
									options={Object.values(MonthsEnum)}
									onChange={handleMonthChange}
									className='border border-white/10'
									value={
										MonthsEnum[selectedMonth as MonthEnumType] ?? 'Неизвестно'
									}
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default ReleasesRatingPageHeader
