import { FC, ReactNode } from 'react'

interface IProps {
	title: string
	value: number
	icon: ReactNode
}

const ProfileStatsRow: FC<IProps> = ({ title, value, icon }) => {
	return (
		<div className='flex justify-between items-center select-none'>
			<div className='flex justify-between items-center space-x-1.5'>
				{icon}
				<span className='font-semibold'>{title}</span>
			</div>
			<div className='font-bold'>{value}</div>
		</div>
	)
}

export default ProfileStatsRow
