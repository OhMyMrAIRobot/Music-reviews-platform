import { FC } from 'react'
import { IProfile } from '../../models/profile/Profile'
import PreferProfileGrid from './PreferProfileGrid'
import ProfileSelectButton from './ProfileSelectButton'

interface IProps {
	profile: IProfile
}

const ProfileRightSection: FC<IProps> = ({ profile }) => {
	return (
		<div className='xl:col-span-7'>
			<div className='relative max-h-[300px] hidden xl:block'>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
						profile.cover
					}`}
					className='object-cover rounded-xl size-full'
				/>
			</div>
			<div className='mt-5 flex gap-1 lg:gap-2 items-center'>
				<ProfileSelectButton
					title={'Предпочтения'}
					isActive={true}
					onClick={() => {}}
				/>
				<ProfileSelectButton
					title={'Рецензии и оценки'}
					isActive={false}
					onClick={() => {}}
				/>
				<ProfileSelectButton
					title={'Понравилось'}
					isActive={false}
					onClick={() => {}}
				/>
			</div>
			<PreferProfileGrid />
		</div>
	)
}

export default ProfileRightSection
