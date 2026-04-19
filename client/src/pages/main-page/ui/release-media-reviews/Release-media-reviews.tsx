import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api';
import CarouselContainer from '../../../../components/carousel/Carousel-container';
import { useReleaseMediaMeta } from '../../../../hooks/meta';
import useNavigationPath from '../../../../hooks/use-navigation-path';
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys';
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum';
import { CarouselRef } from '../../../../types/common/types/carousel-ref';
import {
  ReleaseMediaQuery,
  ReleaseMediaStatusesEnum,
  ReleaseMediaTypesEnum,
} from '../../../../types/release';
import ReleaseMediaReviewsCarousel from './carousel/Release-media-reviews-carousel';

const limit = 15;
const offset = 0;
const order = SortOrdersEnum.DESC;

const ReleaseMediaReviews = () => {
  const { t } = useTranslation();
  const { navigateToMediaReviews } = useNavigationPath();
  const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta();

  const typeId = types.find(
    (t) => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW
  )?.id;
  const statusId = statuses.find(
    (s) => s.status === ReleaseMediaStatusesEnum.APPROVED
  )?.id;

  const query: ReleaseMediaQuery = {
    limit,
    offset,
    statusId,
    typeId,
    order,
  };

  const { data: mediaData, isPending: isMediaLoading } = useQuery({
    queryKey: releaseMediaKeys.list(query),
    queryFn: () => ReleaseMediaAPI.findAll(query),
    enabled: Boolean(typeId && statusId),
    staleTime: 1000 * 60 * 5,
  });

  const items = mediaData?.items ?? [];

  const carouselRef = useRef<CarouselRef>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    <CarouselContainer
      title={t('pages.main.mediaReviews.title')}
      buttonTitle={t('pages.main.mediaReviews.all')}
      showButton={true}
      href={navigateToMediaReviews}
      handlePrev={() => carouselRef.current?.scrollPrev()}
      handleNext={() => carouselRef.current?.scrollNext()}
      carousel={
        <ReleaseMediaReviewsCarousel
          ref={carouselRef}
          items={items}
          isLoading={isMediaLoading || isMetaLoading}
          onCanScrollPrevChange={setCanScrollPrev}
          onCanScrollNextChange={setCanScrollNext}
        />
      }
      canScrollNext={canScrollNext}
      canScrollPrev={canScrollPrev}
    />
  );
};

export default ReleaseMediaReviews;
