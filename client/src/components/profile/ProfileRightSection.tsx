import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../hooks/UseLoading'
import { useStore } from '../../hooks/UseStore'
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

	const { id } = useParams()
	const [reviewsCurrentPage, setReviewsCurrentPage] = useState<number>(1)
	const [favCurrentPage, setFavCurrentPage] = useState<number>(1)

	const { profileStore } = useStore()
	const { execute: fetchReviews, isLoading: isReviewsLoading } = useLoading(
		profileStore.fetchReviews
	)

	const { execute: fetchFavReviews, isLoading: isFavReviewsLoading } =
		useLoading(profileStore.fetchFavReviews)

	useEffect(() => {
		if (id) {
			switch (selectedSection) {
				case SectionValues.REVIEWS:
					fetchReviews(5, (reviewsCurrentPage - 1) * 5, id)
					break
				case SectionValues.LIKES:
					fetchFavReviews(5, (favCurrentPage - 1) * 5, id)
					break
			}
		}
	}, [reviewsCurrentPage, favCurrentPage, id, selectedSection])

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
			{selectedSection === SectionValues.REVIEWS && (
				<ProfileReviewsGrid
					items={profileStore.reviews}
					total={profileStore.reviewsCount}
					currentPage={reviewsCurrentPage}
					setCurrentPage={setReviewsCurrentPage}
					isLoading={isReviewsLoading}
				/>
			)}
			{selectedSection === SectionValues.LIKES && (
				<ProfileReviewsGrid
					items={profileStore.favReviews}
					total={profileStore.favReviewsCount}
					currentPage={favCurrentPage}
					setCurrentPage={setFavCurrentPage}
					isLoading={isFavReviewsLoading}
				/>
			)}
		</div>
	)
}

export default ProfileRightSection
