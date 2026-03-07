import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ReviewAPI } from "../../../../api/review/review-api";
import CarouselContainer from "../../../../components/carousel/Carousel-container";
import LastReviewsCarousel from "../../../../components/carousel/Last-reviews-carousel";
import useNavigationPath from "../../../../hooks/use-navigation-path";
import { reviewsKeys } from "../../../../query-keys/reviews-keys";
import { SortOrdersEnum } from "../../../../types/common/enums/sort-orders-enum";
import { CarouselRef } from "../../../../types/common/types/carousel-ref";
import { ReviewsQuery, ReviewsSortFieldsEnum } from "../../../../types/review";

const query: ReviewsQuery = {
  limit: 45,
  offset: 0,
  sortField: ReviewsSortFieldsEnum.CREATED,
  sortOrder: SortOrdersEnum.DESC,
  withTextOnly: true,
};

const LastReviews = () => {
  const { navigateToReviews } = useNavigationPath();

  const { data, isPending } = useQuery({
    queryKey: reviewsKeys.list(query),
    queryFn: () => ReviewAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];

  const carouselRef = useRef<CarouselRef>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    <CarouselContainer
      title={"Новые рецензии"}
      buttonTitle={"Все рецензии"}
      showButton={true}
      href={navigateToReviews}
      handlePrev={() => carouselRef.current?.scrollPrev()}
      handleNext={() => carouselRef.current?.scrollNext()}
      carousel={
        <LastReviewsCarousel
          ref={carouselRef}
          isLoading={isPending}
          items={items}
          rowCount={3}
          onCanScrollPrevChange={setCanScrollPrev}
          onCanScrollNextChange={setCanScrollNext}
        />
      }
      canScrollNext={canScrollNext}
      canScrollPrev={canScrollPrev}
    />
  );
};

export default LastReviews;
