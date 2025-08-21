import { FC } from 'react'
import AwardSvg from '../../svg/Award-svg'
import Tooltip from '../../tooltip/Tooltip'
import TooltipSpan from '../../tooltip/Tooltip-span'

interface IProps {
	winsCount: number
	totalCount: number
}

const AuthorNominations: FC<IProps> = ({ winsCount, totalCount }) => {
	return (
		<div className='flex items-center justify-center space-x-1.5 lg:space-x-3'>
			{winsCount > 0 && (
				<>
					<TooltipSpan
						tooltip={<Tooltip>Победы в номинациях</Tooltip>}
						spanClassName='text-white relative flex items-center space-x-1 text-xs lg:text-sm'
						centered={true}
					>
						<img
							loading='lazy'
							decoding='async'
							alt={'rice'}
							src={`${import.meta.env.VITE_SERVER_URL}/public/assets/rice.png`}
							className='w-4'
						/>
						<span>{winsCount}</span>
					</TooltipSpan>

					<div
						data-orientation='vertical'
						role='none'
						className='shrink-0 bg-zinc-600 h-[15px] w-[1px]'
					/>
				</>
			)}
			<TooltipSpan
				tooltip={<Tooltip>Всего номинаций</Tooltip>}
				spanClassName='text-white relative flex items-center space-x-1 text-xs lg:text-sm'
				centered={true}
			>
				<AwardSvg className='w-5' />
				<span>{totalCount}</span>
			</TooltipSpan>
		</div>
	)
}

export default AuthorNominations
