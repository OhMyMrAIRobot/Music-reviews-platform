import { FC } from 'react'
import ComboBox from '../../../../components/buttons/Combo-box'
import { ReleaseReviewSortField } from '../../../../models/review/release-review/release-review-sort-fields'

interface IProps {
	count: number
	selectedSort: string
	setSelectedSort: (val: string) => void
}

const ReleaseDetailsReviewsHeader: FC<IProps> = ({
	count,
	selectedSort,
	setSelectedSort,
}) => {
	return (
		<div className='w-full flex flex-col gap-y-5 lg:gap-y-0 lg:items-center lg:flex-row lg:justify-between lg:mt-10 mt-5'>
			<div className='font-bold flex items-center gap-x-5 h-full'>
				<p className='text-xl xl:text-2xl '>Рецензий пользователей</p>

				<div className='inline-flex items-center justify-center rounded-full size-10 lg:size-12 bg-white/5 select-none'>
					{count}
				</div>
			</div>

			<div className='whitespace-nowrap rounded-lg border border-white/5 bg-zinc-900 p-3 lg:p-2 flex gap-4 items-center font-bold w-full sm:w-1/2 lg:w-1/3 select-none'>
				<p className='hidden text-white/70 md:block text-sm md:text-base '>
					Сортировать по:
				</p>

				<ComboBox
					options={Object.values(ReleaseReviewSortField)}
					value={selectedSort}
					onChange={setSelectedSort}
					className='rounded-md border border-zinc-700 relative inline-block'
				/>
			</div>
		</div>
	)
}

export default ReleaseDetailsReviewsHeader
