import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useParams } from 'react-router'
import { ReviewAPI } from '../../../../api/review/review-api'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { profileKeys } from '../../../../query-keys/profile-keys'
import { Profile } from '../../../../types/profile'
import { ReviewsSortFieldsEnum } from '../../../../types/review'
import { RolesEnum } from '../../../../types/user'
import { ProfilePageSections } from '../../types/profile-page-sections'
import ProfileAuthorCardsGrid from './Profile-author-cards-grid'
import ProfileMediaReviewsGrid from './Profile-media-reviews-grid'
import ProfilePreferencesGrid from './profile-preferences/Profile-preferences-grid'
import ProfileReviewsGrid from './Profile-reviews-grid'
import ProfileSectionButton from './Profile-section-button'

interface IProps {
	profile: Profile
}

const perPage = 5

const ProfileRightSection: FC<IProps> = ({ profile }) => {
	const { id } = useParams()

	const [selectedSection, setSelectedSection] = useState<string>(
		profile.user.isAuthor === true
			? ProfilePageSections.AUTHOR_CARDS
			: ProfilePageSections.PREFER
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
				? ReviewAPI.findAll({
						limit: perPage,
						offset: (reviewsCurrentPage - 1) * perPage,
						sortField: ReviewsSortFieldsEnum.CREATED,
						sortOrder: SortOrdersEnum.DESC,
						userId: id,
				  })
				: Promise.resolve({ items: [], meta: { count: 0 } }),
		enabled: !!id && selectedSection === ProfilePageSections.REVIEWS,
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
				? ReviewAPI.findAll({
						sortField: ReviewsSortFieldsEnum.CREATED,
						favUserId: id,
						limit: perPage,
						offset: (favCurrentPage - 1) * perPage,
						sortOrder: SortOrdersEnum.DESC,
				  })
				: Promise.resolve({ items: [], meta: { count: 0 } }),
		enabled: !!id && selectedSection === ProfilePageSections.LIKES,
		staleTime: 1000 * 60 * 5,
	})

	// const { storeToggle: storeToggleReviews } = useQueryListFavToggleAll<
	// 	IReview,
	// 	{ reviews: IReview[] }
	// >(['profile', 'reviews'], 'reviews', toggleFavReview)

	// const { storeToggle: storeToggleFavReviews } = useQueryListFavToggleAll<
	// 	IReview,
	// 	{ reviews: IReview[] }
	// >(['profile', 'favReviews'], 'reviews', toggleFavReview)

	if (!id) return null

	const reviews = reviewsData?.items || []
	const reviewsCount = reviewsData?.meta.count || 0
	const favReviews = favReviewsData?.items || []
	const favReviewsCount = favReviewsData?.meta.count || 0

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
				{profile.user.isAuthor && (
					<ProfileSectionButton
						title={ProfilePageSections.AUTHOR_CARDS}
						isActive={selectedSection === ProfilePageSections.AUTHOR_CARDS}
						onClick={() => setSelectedSection(ProfilePageSections.AUTHOR_CARDS)}
					/>
				)}

				<ProfileSectionButton
					title={ProfilePageSections.PREFER}
					isActive={selectedSection === ProfilePageSections.PREFER}
					onClick={() => setSelectedSection(ProfilePageSections.PREFER)}
				/>

				<ProfileSectionButton
					title={ProfilePageSections.REVIEWS}
					isActive={selectedSection === ProfilePageSections.REVIEWS}
					onClick={() => setSelectedSection(ProfilePageSections.REVIEWS)}
				/>

				{profile.user.role.role === RolesEnum.MEDIA && (
					<ProfileSectionButton
						title={ProfilePageSections.MEDIA_REVIEWS}
						isActive={selectedSection === ProfilePageSections.MEDIA_REVIEWS}
						onClick={() =>
							setSelectedSection(ProfilePageSections.MEDIA_REVIEWS)
						}
					/>
				)}

				<ProfileSectionButton
					title={ProfilePageSections.LIKES}
					isActive={selectedSection === ProfilePageSections.LIKES}
					onClick={() => setSelectedSection(ProfilePageSections.LIKES)}
				/>
			</div>

			{selectedSection === ProfilePageSections.AUTHOR_CARDS && (
				<ProfileAuthorCardsGrid userId={id} />
			)}

			{selectedSection === ProfilePageSections.PREFER && (
				<ProfilePreferencesGrid userId={id} />
			)}

			{selectedSection === ProfilePageSections.REVIEWS && (
				<ProfileReviewsGrid
					items={reviews}
					total={reviewsCount}
					currentPage={reviewsCurrentPage}
					setCurrentPage={setReviewsCurrentPage}
					isLoading={isReviewsPending}
					perPage={perPage}
					// TODO: Fix toggle
				/>
			)}

			{profile.user.role.role === RolesEnum.MEDIA &&
				selectedSection === ProfilePageSections.MEDIA_REVIEWS && (
					<ProfileMediaReviewsGrid userId={id} />
				)}

			{selectedSection === ProfilePageSections.LIKES && (
				<ProfileReviewsGrid
					items={favReviews}
					total={favReviewsCount}
					currentPage={favCurrentPage}
					setCurrentPage={setFavCurrentPage}
					isLoading={isFavReviewsPending}
					perPage={perPage}
					// TODO: Fix toggle
				/>
			)}
		</div>
	)
}

export default ProfileRightSection
