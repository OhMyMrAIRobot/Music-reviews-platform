import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import ComboBox from '../../header/buttons/ComboBox'

interface IProps {
	count: number
}

const SortEnum = Object.freeze({
	NEW: 'Новые',
	OLD: 'Старые',
	POPULAR: 'Популярные',
})

const ReleaseReviewsHeader: FC<IProps> = ({ count }) => {
	const [selectedSort, setSelectedSort] = useState<string>(SortEnum.NEW)

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
					options={Object.values(SortEnum)}
					value={selectedSort}
					onChange={setSelectedSort}
					className='rounded-md border border-zinc-700 relative inline-block'
				/>
			</div>
		</div>
	)
}

const ReleaseReviewsContainer = () => {
	const { id } = useParams()
	const { reviewsStore } = useStore()

	const { execute: fetch } = useLoading(reviewsStore.fetchReleaseReviews)

	useEffect(() => {
		fetch(id)
	}, [])

	return (
		<section className='w-full grid grid-cols-1 mt-5 lg:mt-10'>
			{reviewsStore.releaseReviews.length !== 0 ? (
				<ReleaseReviewsHeader count={reviewsStore.releaseReviews.length} />
			) : (
				<div className='text-center border font-medium border-zinc-950 bg-gradient-to-br from-white/10 rounded-xl text-xs lg:sm w-full lg:max-w-[800px] sm:max-w-[600px] py-2 mx-auto'>
					<span>Нет рецензий!</span>
				</div>
			)}
		</section>
	)
}

export default ReleaseReviewsContainer
