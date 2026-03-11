import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { AlbumValueAPI } from '../../../../api/album-value-api';
import CarouselContainer from '../../../../components/carousel/Carousel-container';
import useNavigationPath from '../../../../hooks/use-navigation-path';
import { albumValuesKeys } from '../../../../query-keys/album-values-keys';
import { AlbumValuesQuery } from '../../../../types/album-value';
import { CarouselRef } from '../../../../types/common/types/carousel-ref';
import MainPageAlbumValuesCarousel from './Main-page-album-values-carousel';

const query: AlbumValuesQuery = {
  limit: 15,
  offset: 0,
};

const MainPageAlbumValues = () => {
  const { navigateToAlbumValues } = useNavigationPath();

  const { data, isPending } = useQuery({
    queryKey: albumValuesKeys.list(query),
    queryFn: () => AlbumValueAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];

  const carouselRef = useRef<CarouselRef>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    <CarouselContainer
      title={'Ценность альбомов'}
      buttonTitle={'Каталог ценности альбомов'}
      showButton={true}
      href={navigateToAlbumValues}
      handlePrev={() => carouselRef.current?.scrollPrev()}
      handleNext={() => carouselRef.current?.scrollNext()}
      carousel={
        <MainPageAlbumValuesCarousel
          ref={carouselRef}
          items={items}
          isLoading={isPending}
          onCanScrollPrevChange={setCanScrollPrev}
          onCanScrollNextChange={setCanScrollNext}
        />
      }
      canScrollNext={canScrollNext}
      canScrollPrev={canScrollPrev}
    />
  );
};

export default MainPageAlbumValues;
