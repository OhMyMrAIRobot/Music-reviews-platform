import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CarouselContainer from '../../../../components/carousel/Carousel-container';
import { MonthEnumType } from '../../../../types/common/enums/months-enum';
import { translateMonth } from '../../../../utils/date/month-i18n';
import { CarouselRef } from '../../../../types/common/types/carousel-ref';
import { NominationMonthWinners } from '../../../../types/nomination';
import NominationCarousel from './Nomination-carousel';

interface IProps {
  item?: NominationMonthWinners;
  isLoading: boolean;
  idx: number;
}

const NominationCarouselContainer: FC<IProps> = ({ item, isLoading, idx }) => {
  const { t } = useTranslation();
  const carouselRef = useRef<CarouselRef>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    <CarouselContainer
      title={translateMonth(t, (item?.month ?? idx + 1) as MonthEnumType)}
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
