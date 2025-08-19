import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import ComboBox from '../../components/buttons/Combo-box'
import SkeletonLoader from '../../components/utils/Skeleton-loader'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import NominationCarouselContainer from './ui/carousel/Nomination-carousel-container'

const AwardsPage = observer(() => {
	const { awardsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(awardsPageStore.fetchAwards)

	const [year, setYear] = useState<string>('2025')

	useEffect(() => {
		fetch(null, parseInt(year))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [year])

	const items = awardsPageStore.awards

	const { minYear, maxYear } = awardsPageStore

	const yearOptions =
		minYear && maxYear
			? Array.from({ length: minYear ? maxYear - minYear + 1 : 0 }, (_, i) =>
					(maxYear - i).toString()
			  )
			: []

	return (
		<>
			<h1 className='text-lg md:text-xl lg:text-3xl font-semibold'>
				Победители номинаций
			</h1>

			<div className='flex justify-between items-center gap-5 h-15 mt-5'>
				<div className='w-40 bg-white h-full rounded-lg text-black flex items-center justify-center font-medium text-sm px-3 py-2'>
					Номинанты в этом месяце
				</div>

				<div className='w-full rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm flex gap-4 items-center'>
					<span className='hidden sm:block text-white/70 font-bold '>Год:</span>
					<div className='w-full sm:w-55'>
						{!minYear || !maxYear ? (
							<SkeletonLoader className={'w-full h-10 rounded-md'} />
						) : (
							<ComboBox
								options={yearOptions}
								onChange={setYear}
								className='border border-white/10'
								value={year}
								isLoading={isLoading}
							/>
						)}
					</div>
				</div>
			</div>

			{isLoading
				? Array.from({ length: 2 }).map((_, idx) => (
						<div
							className='mt-10 border-b border-white/10 pb-10'
							key={`Carousel-skeleton-${idx}`}
						>
							<NominationCarouselContainer isLoading={true} idx={idx} />
						</div>
				  ))
				: items.map(item => (
						<div
							className='mt-10 border-b border-white/10 pb-10'
							key={item.month}
						>
							<NominationCarouselContainer
								item={item}
								isLoading={false}
								idx={0}
							/>
						</div>
				  ))}
		</>
	)
})

export default AwardsPage
