import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { FC } from 'react'
import { IPreferredItem } from '../../models/profile/preferred-item'
import PreferItem from './PreferItem'

interface IProps {
	title: string
	items: IPreferredItem[]
	isAuthor: boolean
}

const PreferProfileGridItem: FC<IProps> = ({ title, items, isAuthor }) => {
	const options: EmblaOptionsType = { dragFree: true, align: 'start' }
	const [emblaRef] = useEmblaCarousel(options)

	return (
		<div>
			<div className='text-lg font-semibold mb-2 relative'>
				<div className='relative max-lg:text-sm z-10 bg-gradient-to-r from-zinc-950 from-80% to-zinc-950/0 inline-flex pr-10 '>
					{title}
				</div>
				<div
					data-orientation='horizontal'
					className='shrink-0 h-[1px] w-full absolute top-1/2 bg-zinc-700'
				></div>
			</div>
			<div className='embla w-full'>
				<div className='embla__viewport w-full' ref={emblaRef}>
					<div className='grid grid-flow-col auto-cols-[20%] w-full'>
						{
							// [...Array(10)].flatMap(() =>
							items.map(item => (
								<div
									className='aspect-square'
									key={`${item.id}-${Math.random()}`}
								>
									<PreferItem item={item} isAuthor={isAuthor} />
								</div>
							))
							// )
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default PreferProfileGridItem
