import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useParams } from 'react-router'
import { ReviewAPI } from '../../../../api/review/review-api'
import { useQueryListFavToggleAll } from '../../../../hooks/use-query-list-fav-toggle'
import { IProfile } from '../../../../models/profile/profile'
import { ProfileDetailsPageSections } from '../../../../models/profile/profile-details-page-sections'
import { IReview } from '../../../../models/review/review'
import { RolesEnum } from '../../../../models/role/roles-enum'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { profileKeys } from '../../../../query-keys/profile-keys'
import { toggleFavReview } from '../../../../utils/toggle-fav-review'
import ProfileAuthorCardsGrid from './Profile-author-cards-grid'
import ProfileMediaReviewsGrid from './Profile-media-reviews-grid'
import ProfilePreferencesGrid from './profile-preferences/Profile-preferences-grid'
import ProfileReviewsGrid from './Profile-reviews-grid'
import ProfileSectionButton from './Profile-section-button'

interface IProps {
	profile: IProfile
}

const perPage = 5

const ProfileRightSection: FC<IProps> = ({ profile }) => {
	const { id } = useParams()

	const [selectedSection, setSelectedSection] = useState<string>(
		profile.isAuthor === true
			? ProfileDetailsPageSections.AUTHOR_CARDS
			: ProfileDetailsPageSections.PREFER
	)
	const [reviewsCurrentPage, setReviewsCurrentPage] = useState<number>(1)
	const [favCurrentPage, setFavCurrentPage] = useState<number>(1)

	const reviewsQueryKey = profileKeys.reviews({
		userId: id ?? '',
		limit: perPage,
		offset: (reviewsCurrentPage - 1) * perPage,
	})
	const { data: reviewsData, isPending: isReviewsPending } = useQuery({
		queryKey: reviewsQueryKey,
		queryFn: () =>
			id
				? ReviewAPI.fetchReviews(
						SortOrdersEnum.DESC,
						perPage,
						(reviewsCurrentPage - 1) * perPage,
						id,
						null
				  )
				: Promise.resolve({ reviews: [], count: 0 }),
		enabled: !!id && selectedSection === ProfileDetailsPageSections.REVIEWS,
		staleTime: 1000 * 60 * 5,
	})

	const favReviewsQueryKey = profileKeys.favReviews({
		favUserId: id ?? '',
		limit: perPage,
		offset: (favCurrentPage - 1) * perPage,
	})
	const { data: favReviewsData, isPending: isFavReviewsPending } = useQuery({
		queryKey: favReviewsQueryKey,
		queryFn: () =>
			id
				? ReviewAPI.fetchReviews(
						SortOrdersEnum.DESC,
						perPage,
						(favCurrentPage - 1) * perPage,
						null,
						id
				  )
				: Promise.resolve({ reviews: [], count: 0 }),
		enabled: !!id && selectedSection === ProfileDetailsPageSections.LIKES,
		staleTime: 1000 * 60 * 5,
	})

	const { storeToggle: storeToggleReviews } = useQueryListFavToggleAll<
		IReview,
		{ reviews: IReview[] }
	>(['profile', 'reviews'], 'reviews', toggleFavReview)

	const { storeToggle: storeToggleFavReviews } = useQueryListFavToggleAll<
		IReview,
		{ reviews: IReview[] }
	>(['profile', 'favReviews'], 'reviews', toggleFavReview)

	if (!id) return null

	const reviews = reviewsData?.reviews || []
	const reviewsCount = reviewsData?.count || 0
	const favReviews = favReviewsData?.reviews || []
	const favReviewsCount = favReviewsData?.count || 0

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
				<ProfileAuthorCardsGrid userId={id} />
			)}

			{selectedSection === ProfileDetailsPageSections.PREFER && (
				<ProfilePreferencesGrid userId={id} />
			)}

			{selectedSection === ProfileDetailsPageSections.REVIEWS && (
				<ProfileReviewsGrid
					items={reviews}
					total={reviewsCount}
					currentPage={reviewsCurrentPage}
					setCurrentPage={setReviewsCurrentPage}
					isLoading={isReviewsPending}
					perPage={perPage}
					storeToggle={storeToggleReviews}
				/>
			)}

			{profile.role === RolesEnum.MEDIA &&
				selectedSection === ProfileDetailsPageSections.MEDIA_REVIEWS && (
					<ProfileMediaReviewsGrid userId={id} />
				)}

			{selectedSection === ProfileDetailsPageSections.LIKES && (
				<ProfileReviewsGrid
					items={favReviews}
					total={favReviewsCount}
					currentPage={favCurrentPage}
					setCurrentPage={setFavCurrentPage}
					isLoading={isFavReviewsPending}
					perPage={perPage}
					storeToggle={storeToggleFavReviews}
				/>
			)}
		</div>
	)
}

export default ProfileRightSection
