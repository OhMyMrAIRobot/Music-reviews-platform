import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseAPI } from '../../../../api/release/release-api';
import CarouselContainer from '../../../../components/carousel/Carousel-container';
import useNavigationPath from '../../../../hooks/use-navigation-path';
import { releasesKeys } from '../../../../query-keys/releases-keys';
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum';
import { CarouselRef } from '../../../../types/common/types/carousel-ref';
import {
  ReleasesQuery,
  ReleasesSortFieldsEnum,
} from '../../../../types/release';
import LastReleasesCarousel from './carousel/Last-releases-carousel';

const query: ReleasesQuery = {
  limit: 20,
  offset: 0,
  sortField: ReleasesSortFieldsEnum.PUBLISHED,
  sortOrder: SortOrdersEnum.DESC,
};

const LastReleases = () => {
  const { t } = useTranslation();
  const { navigateToReleases } = useNavigationPath();

  const { data, isPending } = useQuery({
    queryKey: releasesKeys.list(query),
    queryFn: () => ReleaseAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];

  const carouselRef = useRef<CarouselRef>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    <CarouselContainer
      title={t('pages.main.lastReleases.title')}
      buttonTitle={t('pages.main.lastReleases.all')}
      href={navigateToReleases}
      showButton={true}
      handlePrev={() => carouselRef.current?.scrollPrev()}
      handleNext={() => carouselRef.current?.scrollNext()}
      carousel={
        <LastReleasesCarousel
          items={items}
          isLoading={isPending}
          ref={carouselRef}
          onCanScrollPrevChange={setCanScrollPrev}
          onCanScrollNextChange={setCanScrollNext}
        />
      }
      canScrollNext={canScrollNext}
      canScrollPrev={canScrollPrev}
    />
  );
};

export default LastReleases;
