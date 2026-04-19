import { useQuery } from '@tanstack/react-query';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ReviewAPI } from '../../../../api/review/review-api';
import { reviewsKeys } from '../../../../query-keys/reviews-keys';
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum';
import { Profile } from '../../../../types/profile';
import { ReviewsQuery, ReviewsSortFieldsEnum } from '../../../../types/review';
import { RolesEnum } from '../../../../types/user';
import { ProfilePageSectionId } from '../../types/profile-page-sections';
import ProfileAuthorCardsGrid from './Profile-author-cards-grid';
import ProfileMediaReviewsGrid from './Profile-media-reviews-grid';
import ProfilePreferencesGrid from './profile-preferences/Profile-preferences-grid';
import ProfileReviewsGrid from './Profile-reviews-grid';
import ProfileSectionButton from './Profile-section-button';

interface IProps {
  profile: Profile;
}

const limit = 5;

const ProfileRightSection: FC<IProps> = ({ profile }) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [selectedSection, setSelectedSection] = useState<ProfilePageSectionId>(
    profile.user.isAuthor === true
      ? ProfilePageSectionId.AUTHOR_CARDS
      : ProfilePageSectionId.PREFER
  );
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState<number>(1);
  const [favCurrentPage, setFavCurrentPage] = useState<number>(1);

  const sectionTitle = useMemo(
    () => ({
      [ProfilePageSectionId.AUTHOR_CARDS]: t(
        'pages.profile.sections.authorCards'
      ),
      [ProfilePageSectionId.PREFER]: t('pages.profile.sections.preferences'),
      [ProfilePageSectionId.REVIEWS]: t('pages.profile.sections.reviews'),
      [ProfilePageSectionId.MEDIA_REVIEWS]: t(
        'pages.profile.sections.mediaReviews'
      ),
      [ProfilePageSectionId.LIKES]: t('pages.profile.sections.likes'),
    }),
    [t]
  );

  const reviewsQuery: ReviewsQuery = {
    userId: id,
    limit,
    offset: (reviewsCurrentPage - 1) * limit,
    sortField: ReviewsSortFieldsEnum.CREATED,
    sortOrder: SortOrdersEnum.DESC,
    withTextOnly: true,
  };

  const { data: reviewsData, isPending: isReviewsPending } = useQuery({
    queryKey: reviewsKeys.list(reviewsQuery),
    queryFn: () =>
      id
        ? ReviewAPI.findAll(reviewsQuery)
        : Promise.resolve({ items: [], meta: { count: 0 } }),
    enabled: !!id && selectedSection === ProfilePageSectionId.REVIEWS,
    staleTime: 1000 * 60 * 5,
  });

  const favReviewsQuery: ReviewsQuery = {
    favUserId: id,
    limit,
    offset: (favCurrentPage - 1) * limit,
    sortOrder: SortOrdersEnum.DESC,
    sortField: ReviewsSortFieldsEnum.CREATED,
    withTextOnly: true,
  };

  const { data: favReviewsData, isPending: isFavReviewsPending } = useQuery({
    queryKey: reviewsKeys.list(favReviewsQuery),
    queryFn: () =>
      id
        ? ReviewAPI.findAll(favReviewsQuery)
        : Promise.resolve({ items: [], meta: { count: 0 } }),
    enabled: !!id && selectedSection === ProfilePageSectionId.LIKES,
    staleTime: 1000 * 60 * 5,
  });

  if (!id) return null;

  const reviews = reviewsData?.items || [];
  const reviewsCount = reviewsData?.meta.count || 0;
  const favReviews = favReviewsData?.items || [];
  const favReviewsCount = favReviewsData?.meta.count || 0;

  return (
    <div className="xl:col-span-7">
      <div className="aspect-video w-full relative max-h-[300px] h-full hidden xl:block select-none">
        <img
          loading="lazy"
          decoding="async"
          src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
            profile.cover === ''
              ? import.meta.env.VITE_DEFAULT_COVER
              : profile.cover
          }`}
          className="object-cover rounded-xl size-full"
        />
      </div>

      <div
        className="mt-5 mb-2 lg:mb-5 flex gap-x-2 gap-y-2 items-center flex-wrap"
        id="profile-sections"
      >
        {profile.user.isAuthor && (
          <ProfileSectionButton
            title={sectionTitle[ProfilePageSectionId.AUTHOR_CARDS]}
            isActive={selectedSection === ProfilePageSectionId.AUTHOR_CARDS}
            onClick={() =>
              setSelectedSection(ProfilePageSectionId.AUTHOR_CARDS)
            }
          />
        )}

        <ProfileSectionButton
          title={sectionTitle[ProfilePageSectionId.PREFER]}
          isActive={selectedSection === ProfilePageSectionId.PREFER}
          onClick={() => setSelectedSection(ProfilePageSectionId.PREFER)}
        />

        <ProfileSectionButton
          title={sectionTitle[ProfilePageSectionId.REVIEWS]}
          isActive={selectedSection === ProfilePageSectionId.REVIEWS}
          onClick={() => setSelectedSection(ProfilePageSectionId.REVIEWS)}
        />

        {profile.user.role.role === RolesEnum.MEDIA && (
          <ProfileSectionButton
            title={sectionTitle[ProfilePageSectionId.MEDIA_REVIEWS]}
            isActive={selectedSection === ProfilePageSectionId.MEDIA_REVIEWS}
            onClick={() =>
              setSelectedSection(ProfilePageSectionId.MEDIA_REVIEWS)
            }
          />
        )}

        <ProfileSectionButton
          title={sectionTitle[ProfilePageSectionId.LIKES]}
          isActive={selectedSection === ProfilePageSectionId.LIKES}
          onClick={() => setSelectedSection(ProfilePageSectionId.LIKES)}
        />
      </div>

      {selectedSection === ProfilePageSectionId.AUTHOR_CARDS && (
        <ProfileAuthorCardsGrid userId={id} />
      )}

      {selectedSection === ProfilePageSectionId.PREFER && (
        <ProfilePreferencesGrid userId={id} />
      )}

      {selectedSection === ProfilePageSectionId.REVIEWS && (
        <ProfileReviewsGrid
          items={reviews}
          total={reviewsCount}
          currentPage={reviewsCurrentPage}
          setCurrentPage={setReviewsCurrentPage}
          isLoading={isReviewsPending}
          perPage={limit}
        />
      )}

      {profile.user.role.role === RolesEnum.MEDIA &&
        selectedSection === ProfilePageSectionId.MEDIA_REVIEWS && (
          <ProfileMediaReviewsGrid userId={id} />
        )}

      {selectedSection === ProfilePageSectionId.LIKES && (
        <ProfileReviewsGrid
          items={favReviews}
          total={favReviewsCount}
          currentPage={favCurrentPage}
          setCurrentPage={setFavCurrentPage}
          isLoading={isFavReviewsPending}
          perPage={limit}
        />
      )}
    </div>
  );
};

export default ProfileRightSection;
