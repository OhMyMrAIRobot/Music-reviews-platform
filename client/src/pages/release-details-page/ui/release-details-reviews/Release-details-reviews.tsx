import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { ReviewAPI } from "../../../../api/review/review-api.ts";
import Pagination from "../../../../components/pagination/Pagination.tsx";
import { reviewsKeys } from "../../../../query-keys/reviews-keys.ts";
import { SortOrdersEnum } from "../../../../types/common/enums/sort-orders-enum.ts";
import { SortOrder } from "../../../../types/common/types/sort-order.ts";
import {
  ReleaseReviewSortFields,
  ReviewsQuery,
  ReviewsSortFieldsEnum,
} from "../../../../types/review/index.ts";
import ReleaseDetailsReviewsHeader from "./Release-details-reviews-header.tsx";
import ReleaseDetailsReviewsItem from "./Release-details-reviews-item.tsx";

interface IProps {
  releaseId: string;
}

const limit = 5;

const ReleaseDetailsReviews: FC<IProps> = ({ releaseId }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSort, setSelectedSort] = useState<string>(
    ReleaseReviewSortFields.NEW,
  );

  let field: ReviewsSortFieldsEnum = ReviewsSortFieldsEnum.CREATED;
  let order: SortOrder = SortOrdersEnum.DESC;

  if (selectedSort === ReleaseReviewSortFields.OLD) {
    order = SortOrdersEnum.ASC;
  } else if (selectedSort === ReleaseReviewSortFields.POPULAR) {
    field = ReviewsSortFieldsEnum.LIKES;
  }

  const query: ReviewsQuery = {
    releaseId,
    sortField: field,
    sortOrder: order,
    limit,
    offset: (currentPage - 1) * limit,
    withTextOnly: true,
  };

  const { data: reviewsData, isPending: isLoading } = useQuery({
    queryKey: reviewsKeys.list(query),
    queryFn: () => ReviewAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const reviews = reviewsData?.items ?? [];
  const totalItems = reviewsData?.meta.count ?? 0;

  return (
    <section
      id="release-reviews"
      className="w-full grid grid-cols-1 mt-5 lg:mt-10"
    >
      {totalItems > 0 && (
        <ReleaseDetailsReviewsHeader
          count={totalItems}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />
      )}

      <div className="grid grid-cols-1 max-w-200 w-full mx-auto gap-5 mt-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <ReleaseDetailsReviewsItem
                key={`release-details-review-skeleton-${idx}`}
                isLoading={isLoading}
              />
            ))
          : reviews?.map(
              (review) =>
                review.text && (
                  <ReleaseDetailsReviewsItem
                    key={review.user.id}
                    review={review}
                    isLoading={isLoading}
                  />
                ),
            )}
      </div>

      {totalItems > 0 ? (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={limit}
            setCurrentPage={setCurrentPage}
            idToScroll="release-reviews"
          />
        </div>
      ) : (
        <div className="text-center border font-medium border-zinc-950 bg-gradient-to-br from-white/10 rounded-xl text-xs lg:sm w-full lg:max-w-[800px] sm:max-w-[600px] py-2 mx-auto">
          <span>Нет рецензий!</span>
        </div>
      )}
    </section>
  );
};

export default ReleaseDetailsReviews;
