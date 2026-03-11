import { FC, useRef, useState } from 'react';
import CarouselContainer from '../../../../components/carousel/Carousel-container';
import {
  MonthEnumType,
  MonthsEnum,
} from '../../../../types/common/enums/months-enum';
import { CarouselRef } from '../../../../types/common/types/carousel-ref';
import { NominationMonthWinners } from '../../../../types/nomination';
import NominationCarousel from './Nomination-carousel';

interface IProps {
  item?: NominationMonthWinners;
  isLoading: boolean;
  idx: number;
}

const NominationCarouselContainer: FC<IProps> = ({ item, isLoading, idx }) => {
  const carouselRef = useRef<CarouselRef>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    <CarouselContainer
      title={MonthsEnum[(item?.month ?? idx + 1) as MonthEnumType]}
      buttonTitle={'#'}
      showButton={false}
      href={'#'}
      handlePrev={() => carouselRef.current?.scrollPrev()}
      handleNext={() => carouselRef.current?.scrollNext()}
      canScrollNext={canScrollNext}
      canScrollPrev={canScrollPrev}
      carousel={
        <NominationCarousel
          items={item?.results}
          onCanScrollPrevChange={setCanScrollPrev}
          onCanScrollNextChange={setCanScrollNext}
          ref={carouselRef}
          isLoading={isLoading}
        />
      }
    />
  );
};

export default NominationCarouselContainer;
