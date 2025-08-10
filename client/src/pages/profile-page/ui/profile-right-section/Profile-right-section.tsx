import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { IProfile } from '../../../../models/profile/profile'
import { ProfileSections } from '../../../../models/profile/profile-sections'
import { RolesEnum } from '../../../../models/role/roles-enum'
import ProfileAuthorCardsGrid from './Profile-author-cards-grid'
import ProfileMediaReviewsGrid from './Profile-media-reviews-grid'
import ProfilePreferencesGrid from './profile-preferences/Profile-preferences-grid'
import ProfileReviewsGrid from './Profile-reviews-grid'
import ProfileSectionButton from './Profile-section-button'

interface IProps {
	profile: IProfile
}

const ProfileRightSection: FC<IProps> = ({ profile }) => {
	const perPage = 5

	const { id } = useParams()

	const { profilePageStore } = useStore()

	const [selectedSection, setSelectedSection] = useState<string>(
		profilePageStore.profile?.isAuthor === true
			? ProfileSections.AUTHOR_CARDS
			: ProfileSections.PREFER
	)
	const [reviewsCurrentPage, setReviewsCurrentPage] = useState<number>(1)
	const [favCurrentPage, setFavCurrentPage] = useState<number>(1)

	const { execute: fetchReviews, isLoading: isReviewsLoading } = useLoading(
		profilePageStore.fetchReviews
	)
	const { execute: fetchFavReviews, isLoading: isFavReviewsLoading } =
		useLoading(profilePageStore.fetchFavReviews)
	const { execute: fetchCards, isLoading: isCardsLoading } = useLoading(
		profilePageStore.fetchAuthorCards
	)

	useEffect(() => {
		if (id) {
			switch (selectedSection) {
				case ProfileSections.REVIEWS:
					fetchReviews(perPage, (reviewsCurrentPage - 1) * perPage, id)
					break
				case ProfileSections.LIKES:
					fetchFavReviews(perPage, (favCurrentPage - 1) * perPage, id)
					break
				case ProfileSections.AUTHOR_CARDS:
					if (profilePageStore.profile?.isAuthor === true) fetchCards(id)
					break
			}
		}
	}, [
		reviewsCurrentPage,
		favCurrentPage,
		id,
		selectedSection,
		fetchReviews,
		fetchFavReviews,
		profilePageStore.profile?.isAuthor,
		fetchCards,
	])

	return (
		<div className='xl:col-span-7'>
			<div className='relative max-h-[300px] h-full hidden xl:block select-none'>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
						profile.cover === ''
							? import.meta.env.VITE_DEFAULT_COVER
							: profile.cover
					}`}
					className='object-cover rounded-xl size-full max-h-[300px] h-full'
				/>
			</div>

			<div
				className='mt-5 flex gap-1 lg:gap-2 items-center'
				id='profile-sections'
			>
				{profile.isAuthor && (
					<ProfileSectionButton
						title={ProfileSections.AUTHOR_CARDS}
						isActive={selectedSection === ProfileSections.AUTHOR_CARDS}
						onClick={() => setSelectedSection(ProfileSections.AUTHOR_CARDS)}
					/>
				)}

				<ProfileSectionButton
					title={ProfileSections.PREFER}
					isActive={selectedSection === ProfileSections.PREFER}
					onClick={() => setSelectedSection(ProfileSections.PREFER)}
				/>

				<ProfileSectionButton
					title={ProfileSections.REVIEWS}
					isActive={selectedSection === ProfileSections.REVIEWS}
					onClick={() => setSelectedSection(ProfileSections.REVIEWS)}
				/>

				{profile.role === RolesEnum.MEDIA && (
					<ProfileSectionButton
						title={ProfileSections.MEDIA_REVIEWS}
						isActive={selectedSection === ProfileSections.MEDIA_REVIEWS}
						onClick={() => setSelectedSection(ProfileSections.MEDIA_REVIEWS)}
					/>
				)}

				<ProfileSectionButton
					title={ProfileSections.LIKES}
					isActive={selectedSection === ProfileSections.LIKES}
					onClick={() => setSelectedSection(ProfileSections.LIKES)}
				/>
			</div>

			{selectedSection === ProfileSections.AUTHOR_CARDS && (
				<ProfileAuthorCardsGrid isLoading={isCardsLoading} />
			)}

			{selectedSection === ProfileSections.PREFER && <ProfilePreferencesGrid />}

			{selectedSection === ProfileSections.REVIEWS && (
				<ProfileReviewsGrid
					items={profilePageStore.reviews}
					total={profilePageStore.reviewsCount}
					currentPage={reviewsCurrentPage}
					setCurrentPage={setReviewsCurrentPage}
					isLoading={isReviewsLoading}
					perPage={perPage}
					storeToggle={profilePageStore.toggleReview}
				/>
			)}

			{profile.role === RolesEnum.MEDIA &&
				selectedSection === ProfileSections.MEDIA_REVIEWS && (
					<ProfileMediaReviewsGrid profile={profile} />
				)}

			{selectedSection === ProfileSections.LIKES && (
				<ProfileReviewsGrid
					items={profilePageStore.favReviews}
					total={profilePageStore.favReviewsCount}
					currentPage={favCurrentPage}
					setCurrentPage={setFavCurrentPage}
					isLoading={isFavReviewsLoading}
					perPage={perPage}
					storeToggle={profilePageStore.toggleFavReview}
				/>
			)}
		</div>
	)
}

export default ProfileRightSection
