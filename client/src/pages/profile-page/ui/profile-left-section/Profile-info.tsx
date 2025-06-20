import { FC } from 'react'
import { IProfile } from '../../../../models/profile/profile'
import ProfileSocialItem from './profile-social-item/Profile-social-item'

interface IProps {
	profile: IProfile
}

const ProfileInfo: FC<IProps> = ({ profile }) => {
	return (
		<div className='xl:border xl:border-white/10 p-5 -mt-20 xl:mt-0 xl:bg-zinc-900 flex flex-col items-center rounded-2xl'>
			<div className='relative select-none'>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
						profile.avatar
					}`}
					className='rounded-full size-[100px] lg:size-[130px] block aspect-square'
				/>
			</div>

			<h1 className='text-xl text-center lg:text-[24px] font-bold mt-2.5 flex items-center gap-1.5'>
				<div>{profile.nickname}</div>
			</h1>

			<div className='text-sm text-zinc-400 font-medium'>
				Дата регистрации: {profile.created_at}
			</div>

			{profile.bio && (
				<div className='text-sm leading-5 mt-2.5 text-zinc-300 text-center'>
					{profile.bio}
				</div>
			)}

			<div className='flex space-x-2 mt-5'>
				{profile.social.map(
					social =>
						social.name &&
						social.url && (
							<ProfileSocialItem
								name={social.name}
								href={social.url}
								key={social.name}
							/>
						)
				)}
			</div>
		</div>
	)
}

export default ProfileInfo
