import { FC } from 'react'
import ComboBox from '../../header/buttons/ComboBox'
import { ReleaseReviewsSortEnum } from './ReleaseReviewsContainer'

interface IProps {
	count: number
	selectedSort: string
	setSelectedSort: (val: string) => void
}

const ReleaseReviewsHeader: FC<IProps> = ({
	count,
	selectedSort,
	setSelectedSort,
}) => {
	return (
		<div className='w-full flex flex-col gap-y-5 lg:gap-y-0 lg:items-center lg:flex-row lg:justify-between lg:mt-10 mt-5'>
			<div className='font-bold flex items-center gap-x-5'>
				<p className='text-xl xl:text-2xl '>Рецензий пользователей</p>
				<div className='inline-flex items-center justify-center rounded-full px-2.5 py-0.5 bg-secondary'>
					{count}
				</div>
			</div>

			<div className='whitespace-nowrap rounded-lg border border-white/5 bg-zinc-900 p-3 lg:p-2 flex gap-4 items-center font-bold w-full sm:w-1/2 lg:w-1/3'>
				<p className='hidden text-white/70 md:block text-sm md:text-base '>
					Сортировать по:
				</p>
				<ComboBox
					options={Object.values(ReleaseReviewsSortEnum)}
					value={selectedSort}
					onChange={setSelectedSort}
					className='rounded-md border border-zinc-700 relative inline-block'
				/>
			</div>
		</div>
	)
}

export default ReleaseReviewsHeader
