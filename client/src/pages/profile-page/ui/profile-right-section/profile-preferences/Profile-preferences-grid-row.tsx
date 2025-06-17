import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { FC } from 'react'
import { IPreferredItem } from '../../../../../models/profile/preferred-item'
import ProfilePreferencesItem from './Profile-preferences-item'

interface IProps {
	title: string
	items: IPreferredItem[]
	isAuthor: boolean
	isLoading: boolean
}

const ProfilePreferencesGridRow: FC<IProps> = ({
	title,
	items,
	isAuthor,
	isLoading,
}) => {
	const options: EmblaOptionsType = { dragFree: true, align: 'start' }
	const [emblaRef] = useEmblaCarousel(options)

	return (
		<div className='w-full overflow-hidden'>
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
						{isLoading
							? Array.from({ length: 5 }).map((_, idx) => (
									<ProfilePreferencesItem
										key={`Profile-preferences-skeleton-${idx}-${Math.random}`}
										isAuthor={isAuthor}
										isLoading={isLoading}
									/>
							  ))
							: items.map(item => (
									<ProfilePreferencesItem
										key={item.id}
										item={item}
										isAuthor={isAuthor}
										isLoading={isLoading}
									/>
							  ))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilePreferencesGridRow
