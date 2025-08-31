import { FC } from 'react'

interface IProps {
	title: string
	value: string
	maxValue?: string
	isSectionTitle: boolean
}

const ReleaseDetailsAlbumValueRow: FC<IProps> = ({
	title,
	value,
	maxValue,
	isSectionTitle,
}) => {
	return (
		<div
			className={`flex items-baseline justify-between ${
				!isSectionTitle ? 'text-white/80' : ''
			}`}
		>
			<div className={`${isSectionTitle ? 'font-bold text-base' : ''}`}>
				{title}
			</div>
			<div className='text-right'>
				<span className={`font-bold ${!isSectionTitle ? 'text-xs' : ''}`}>
					{value}
				</span>
				{maxValue !== undefined && (
					<span className='text-white/50 text-xs'> / {maxValue}</span>
				)}
			</div>
		</div>
	)
}

export default ReleaseDetailsAlbumValueRow
