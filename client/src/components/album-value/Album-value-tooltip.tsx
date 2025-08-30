import { FC } from 'react'
import { IAlbumValue } from '../../models/album-value/album-value'
import {
	getAlbumValueTier,
	getAlbumValueTierConfig,
} from '../../utils/album-value-config'

interface IProps {
	value: IAlbumValue
	className?: string
}

const AlbumValueTooltip: FC<IProps> = ({ value, className = '' }) => {
	const level = getAlbumValueTier(value.totalValue)

	if (!level) return null

	const config = getAlbumValueTierConfig(level)

	return (
		<div
			className={`text-left rounded-xl z-2000 px-2 py-1.5 relative overflow-hidden border ${config.borderColor} ${className} shadow-md opacity-95`}
		>
			<div
				className={`absolute inset-0 opacity-20 bg-gradient-to-br pointer-events-none ${config.gradient}`}
			/>
			<div className='font-semibold bg-black/20 p-1 text-center rounded-md border border-black/30 relative z-10 mb-2'>
				{config.name}
			</div>
			<div className='flex flex-col gap-1'>
				<div className='flex justify-between relative z-10'>
					<span>Редкость</span>
					<span className='font-semibold'>{value.rarity.total}</span>
				</div>
				<div className='flex justify-between relative z-10'>
					<span>Целостность</span>
					<span className='font-semibold'>{value.integrity.total}</span>
				</div>
				<div className='flex justify-between relative z-10'>
					<span>Глубина</span>
					<span className='font-semibold'>{value.depth}</span>
				</div>
				<div className='flex justify-between relative z-10'>
					<span>Качество</span>
					<span className='font-semibold'>{value.quality.factor * 100}%</span>
				</div>
				<div className='flex justify-between relative z-10'>
					<span>Влияние</span>
					<span className='font-semibold'>{value.influence.multiplier}</span>
				</div>
			</div>
		</div>
	)
}

export default AlbumValueTooltip
