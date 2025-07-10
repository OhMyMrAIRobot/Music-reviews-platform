import { FC } from 'react'
import { getLevelConfig, getUserLevel } from '../../../utils/user-level'

interface IProps {
	nickname: string
	img: string
	points: number
}

const ReviewUserImage: FC<IProps> = ({ nickname, img, points }) => {
	const level = getUserLevel(points)

	return (
		<div className='relative'>
			<img
				loading='lazy'
				decoding='async'
				alt={nickname}
				src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
					img === '' ? import.meta.env.VITE_DEFAULT_AVATAR : img
				}`}
				className='rounded-full border border-white/10 min-w-10 size-10 lg:size-11 cursor-pointer aspect-square'
			/>
			{level && (
				<img
					alt={'level'}
					src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
						getLevelConfig(level).image
					}`}
					className='size-7 absolute -bottom-1.5 -right-2.5'
				/>
			)}
		</div>
	)
}

export default ReviewUserImage
