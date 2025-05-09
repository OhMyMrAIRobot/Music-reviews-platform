import { FC, ReactNode } from 'react'

interface IProps {
	title: string
	value: number
	icon: ReactNode
}

const ProfileInfoRow: FC<IProps> = ({ title, value, icon }) => {
	return (
		<div className='flex justify-between items-center'>
			<div className='flex justify-between items-center space-x-1.5'>
				{icon}
				<span className='font-semibold'>{title}</span>
			</div>
			<div className='font-bold'>{value}</div>
		</div>
	)
}

export default ProfileInfoRow
