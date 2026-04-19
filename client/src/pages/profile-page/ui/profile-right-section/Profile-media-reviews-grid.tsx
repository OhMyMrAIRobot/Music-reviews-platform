import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api';
import Pagination from '../../../../components/pagination/Pagination';
import ReleaseMediaReview from '../../../../components/release/release-media/Release-media-review';
import { useReleaseMediaMeta } from '../../../../hooks/meta';
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys';
import {
  ReleaseMediaQuery,
  ReleaseMediaStatusesEnum,
  ReleaseMediaTypesEnum,
} from '../../../../types/release';

interface IProps {
  userId: string;
}

const limit = 5;

const ProfileMediaReviewsGrid: FC<IProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta();

  const typeId = types.find(
    (t) => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW
  )?.id;
  const statusId = statuses.find(
    (s) => s.status === ReleaseMediaStatusesEnum.APPROVED
  )?.id;

  const query: ReleaseMediaQuery = {
    userId,
    statusId,
    typeId,
    limit,
    offset: (currentPage - 1) * limit,
  };

  const { data: mediaData, isPending: isMediaLoading } = useQuery({
    queryKey: releaseMediaKeys.list(query),
    queryFn: () => ReleaseMediaAPI.findAll(query),
    enabled: !isMetaLoading && !!typeId && !!statusId && !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const items = mediaData?.items || [];

  return (
    <section>
      <div className="gap-5 grid grid-cols-1 select-none">
        {isMediaLoading || isMediaLoading
          ? Array.from({ length: limit }).map((_, idx) => (
              <ReleaseMediaReview
                key={`Skeleton-media-review-${idx}`}
                isLoading={true}
              />
            ))
          : items.map((media) => (
              <ReleaseMediaReview
                key={media.id}
                media={media}
                isLoading={false}
              />
            ))}
      </div>

      {!isMediaLoading && !isMediaLoading && items.length === 0 && (
        <p className="text-center text-2xl font-semibold mt-10">
          {t('pages.profile.mediaReviewsNotFound')}
        </p>
      )}

      {mediaData && items.length > 0 && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalItems={mediaData.meta.count ?? 0}
            itemsPerPage={limit}
            setCurrentPage={setCurrentPage}
            idToScroll={'profile-sections'}
          />
        </div>
      )}
    </section>
  );
};

export default ProfileMediaReviewsGrid;
