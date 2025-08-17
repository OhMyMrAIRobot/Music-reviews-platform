import { FC, ReactNode } from 'react'
import { Link } from 'react-router'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'

interface IProps {
	isLoading: boolean
	title: string
	value: number
	svg: ReactNode
	link?: string
}

const PlatformStatisticsRow: FC<IProps> = ({
	isLoading,
	title,
	value,
	link,
	svg,
}) => {
	return isLoading ? (
		<SkeletonLoader className={'w-full rounded-lg h-8'} />
	) : (
		<Link
			to={link ?? '#'}
			className={`flex items-center justify-between gap-3 ${
				link ? '' : 'pointer-events-none'
			}`}
		>
			{svg}
			<div
				className={`text-sm lg:text-base ${
					link
						? 'border-b border-b-white/30 hover:border-b-white/40 transition-colors duration-200'
						: ''
				}`}
			>
				{title}
			</div>
			<div className='text-lg lg:text-2xl font-bold ml-auto'>{value}</div>
		</Link>
	)
}

export default PlatformStatisticsRow
