import { FC } from 'react'
import { IProfile } from '../../models/profile/profile'
import ProfileBio from './ProfileBio'
import ProfileStats from './ProfileStats'

interface IProps {
	profile: IProfile
}

const ProfileLeftSection: FC<IProps> = ({ profile }) => {
	return (
		<div className='flex flex-col xl:col-span-3 gap-y-3'>
			<div className='relative xl:hidden h-[140px] md:h-[270px]'>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
						profile.cover
					}`}
					className='object-cover rounded-xl size-full'
				/>
			</div>
			<ProfileBio profile={profile} />
			<ProfileStats profile={profile} />
		</div>
	)
}

export default ProfileLeftSection
