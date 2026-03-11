import { useQuery } from '@tanstack/react-query';
import { FC, useRef, useState } from 'react';
import { ReleaseAPI } from '../../../api/release/release-api';
import CarouselContainer from '../../../components/carousel/Carousel-container';
import { releasesKeys } from '../../../query-keys/releases-keys';
import { SortOrdersEnum } from '../../../types/common/enums/sort-orders-enum';
import { CarouselRef } from '../../../types/common/types/carousel-ref';
import { ReleasesQuery, ReleasesSortFieldsEnum } from '../../../types/release';
import LastReleasesCarousel from '../../main-page/ui/last-releases/carousel/Last-releases-carousel';

interface IProps {
  id: string;
}

const limit = 15;
const offset = 0;

const AuthorDetailsReleasesCarousel: FC<IProps> = ({ id }) => {
  const query: ReleasesQuery = {
    authorId: id,
    sortField: ReleasesSortFieldsEnum.ALL_RATING,
    sortOrder: SortOrdersEnum.DESC,
    limit,
    offset,
  };

  const { data, isPending } = useQuery({
    queryKey: releasesKeys.list(query),
    queryFn: () => ReleaseAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const topReleases = data?.items || [];

  const carouselRef = useRef<CarouselRef>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    (isPending || (topReleases && topReleases.length > 0)) && (
      <CarouselContainer
        title={'Лучшие работы'}
        buttonTitle={''}
        showButton={false}
        handlePrev={() => carouselRef.current?.scrollPrev()}
        handleNext={() => carouselRef.current?.scrollNext()}
        href="#"
        carousel={
          <LastReleasesCarousel
            items={topReleases || []}
            isLoading={isPending}
            ref={carouselRef}
            onCanScrollPrevChange={setCanScrollPrev}
            onCanScrollNextChange={setCanScrollNext}
          />
        }
        canScrollNext={canScrollNext}
        canScrollPrev={canScrollPrev}
      />
    )
  );
};

export default AuthorDetailsReleasesCarousel;
