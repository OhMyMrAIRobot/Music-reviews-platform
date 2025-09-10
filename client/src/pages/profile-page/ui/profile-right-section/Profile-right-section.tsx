import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { IProfile } from '../../../../models/profile/profile'
import { ProfileDetailsPageSections } from '../../../../models/profile/profile-details-page-sections'
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
			? ProfileDetailsPageSections.AUTHOR_CARDS
			: ProfileDetailsPageSections.PREFER
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
				case ProfileDetailsPageSections.REVIEWS:
					fetchReviews(perPage, (reviewsCurrentPage - 1) * perPage, id)
					break
				case ProfileDetailsPageSections.LIKES:
					fetchFavReviews(perPage, (favCurrentPage - 1) * perPage, id)
					break
				case ProfileDetailsPageSections.AUTHOR_CARDS:
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
			<div className='aspect-video w-full relative max-h-[300px] h-full hidden xl:block select-none'>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
						profile.cover === ''
							? import.meta.env.VITE_DEFAULT_COVER
							: profile.cover
					}`}
					className='object-cover rounded-xl size-full'
				/>
			</div>

			<div
				className='mt-5 mb-2 lg:mb-5 flex gap-x-2 gap-y-2 items-center flex-wrap'
				id='profile-sections'
			>
				{profile.isAuthor && (
					<ProfileSectionButton
						title={ProfileDetailsPageSections.AUTHOR_CARDS}
						isActive={
							selectedSection === ProfileDetailsPageSections.AUTHOR_CARDS
						}
						onClick={() =>
							setSelectedSection(ProfileDetailsPageSections.AUTHOR_CARDS)
						}
					/>
				)}

				<ProfileSectionButton
					title={ProfileDetailsPageSections.PREFER}
					isActive={selectedSection === ProfileDetailsPageSections.PREFER}
					onClick={() => setSelectedSection(ProfileDetailsPageSections.PREFER)}
				/>

				<ProfileSectionButton
					title={ProfileDetailsPageSections.REVIEWS}
					isActive={selectedSection === ProfileDetailsPageSections.REVIEWS}
					onClick={() => setSelectedSection(ProfileDetailsPageSections.REVIEWS)}
				/>

				{profile.role === RolesEnum.MEDIA && (
					<ProfileSectionButton
						title={ProfileDetailsPageSections.MEDIA_REVIEWS}
						isActive={
							selectedSection === ProfileDetailsPageSections.MEDIA_REVIEWS
						}
						onClick={() =>
							setSelectedSection(ProfileDetailsPageSections.MEDIA_REVIEWS)
						}
					/>
				)}

				<ProfileSectionButton
					title={ProfileDetailsPageSections.LIKES}
					isActive={selectedSection === ProfileDetailsPageSections.LIKES}
					onClick={() => setSelectedSection(ProfileDetailsPageSections.LIKES)}
				/>
			</div>

			{selectedSection === ProfileDetailsPageSections.AUTHOR_CARDS && (
				<ProfileAuthorCardsGrid isLoading={isCardsLoading} />
			)}

			{selectedSection === ProfileDetailsPageSections.PREFER && (
				<ProfilePreferencesGrid />
			)}

			{selectedSection === ProfileDetailsPageSections.REVIEWS && (
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
				selectedSection === ProfileDetailsPageSections.MEDIA_REVIEWS && (
					<ProfileMediaReviewsGrid profile={profile} />
				)}

			{selectedSection === ProfileDetailsPageSections.LIKES && (
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
