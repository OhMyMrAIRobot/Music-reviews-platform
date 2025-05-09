import { FC, useState } from 'react'
import { IProfile } from '../../models/profile/Profile'
import PreferProfileGrid from './PreferProfileGrid'
import ProfileReviewsGrid from './ProfileReviewsGrid'
import ProfileSelectButton from './ProfileSelectButton'

interface IProps {
	profile: IProfile
}

const ProfileRightSection: FC<IProps> = ({ profile }) => {
	const SectionValues = Object.freeze({
		PREFER: 'Предпочтения',
		REVIEWS: 'Рецензии и оценки',
		LIKES: 'Понравилось',
	})

	const [selectedSection, setSelectedSection] = useState<string>(
		SectionValues.PREFER
	)

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
			<div
				className='mt-5 flex gap-1 lg:gap-2 items-center'
				id='profile-sections'
			>
				<ProfileSelectButton
					title={SectionValues.PREFER}
					isActive={selectedSection === SectionValues.PREFER}
					onClick={() => setSelectedSection(SectionValues.PREFER)}
				/>
				<ProfileSelectButton
					title={SectionValues.REVIEWS}
					isActive={selectedSection === SectionValues.REVIEWS}
					onClick={() => setSelectedSection(SectionValues.REVIEWS)}
				/>
				<ProfileSelectButton
					title={SectionValues.LIKES}
					isActive={selectedSection === SectionValues.LIKES}
					onClick={() => setSelectedSection(SectionValues.LIKES)}
				/>
			</div>
			{selectedSection === SectionValues.PREFER && <PreferProfileGrid />}
			{selectedSection === SectionValues.REVIEWS && <ProfileReviewsGrid />}
		</div>
	)
}

export default ProfileRightSection
