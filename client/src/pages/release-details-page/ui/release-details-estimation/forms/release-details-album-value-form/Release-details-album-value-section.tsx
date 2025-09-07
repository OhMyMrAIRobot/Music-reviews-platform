import { observer } from 'mobx-react-lite'
import { FC, ReactNode } from 'react'

interface IProps {
	pos: number
	title: string
	minMaxText: string
	description: ReactNode
	value: string
	maxValue: string
	children: ReactNode
}

const ReleaseDetailsAlbumValueSection: FC<IProps> = observer(
	({ pos, title, minMaxText, description, value, maxValue, children }) => {
		return (
			<div className='relative'>
				{/* HEADER */}
				<div className='flex items-start space-x-3 mb-4'>
					<div className='size-6 max-md:text-[11px] md:size-8 bg-white/10 rounded-full flex items-center justify-center text-center left-4 top-0'>
						{pos}
					</div>

					{/* HEADER TEXT */}
					<div className='flex justify-between gap-3 items-start lg:items-center w-full'>
						<div>
							<div className='font-bold inline-flex lg:text-xl mb-1.5 cursor-default flex-wrap'>
								<span className='mr-2'>{title}</span>
								<span className='opacity-60'>{minMaxText}</span>
							</div>
							<div className='text-xs lg:text-sm text-zinc-400'>
								{description}
							</div>
						</div>

						<div className='bg-zinc-800 shrink-0 border border-zinc-700 min-w-[55px] rounded-lg flex items-center text-center justify-center px-1.5 lg:px-3 py-1'>
							<span className='lg:text-2xl font-bold mr-1 lg:mr-2'>
								{value}
							</span>
							<span className='opacity-60'>/ {maxValue}</span>
						</div>
					</div>
				</div>

				{/* SLIDERS */}
				{children}
			</div>
		)
	}
)

export default ReleaseDetailsAlbumValueSection
