import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewAPI } from '../../api/review/review-api';
import ComboBox from '../../components/buttons/Combo-box';
import Pagination from '../../components/pagination/Pagination';
import ReviewCard from '../../components/review/review-card/Review-card';
import { reviewsKeys } from '../../query-keys/reviews-keys';
import { SortOrdersEnum } from '../../types/common/enums/sort-orders-enum';
import {
  ReviewSortFields,
  ReviewsQuery,
  ReviewsSortFieldsEnum,
} from '../../types/review';
import { translateReviewSortField } from '../../utils/review/review-sort-i18n';

const limit = 12;

const ReviewsPage = () => {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<string>(
    ReviewSortFields.NEW
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const order = useMemo(
    () =>
      selectedOrder === ReviewSortFields.NEW
        ? SortOrdersEnum.DESC
        : SortOrdersEnum.ASC,
    [selectedOrder]
  );

  const query: ReviewsQuery = {
    limit,
    offset: (currentPage - 1) * limit,
    sortOrder: order,
    sortField: ReviewsSortFieldsEnum.CREATED,
    withTextOnly: true,
  };

  const { data, isPending } = useQuery({
    queryKey: reviewsKeys.list(query),
    queryFn: () => ReviewAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];
  const total = data?.meta.count ?? 0;

  // const { storeToggle } = useQueryListFavToggleAll<
  // 	IReview,
  // 	{ reviews: IReview[] }
  // >(reviewsKeys.all, 'reviews', toggleFavReview)

  return (
    <>
      <h1 id="reviews" className="text-2xl lg:text-3xl font-semibold">
        {t('pages.reviews.title')}
      </h1>

      <div className="rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 grid md:flex gap-x-4 items-center">
        <span className="text-sm md:text-base text-white/70 font-bold max-md:pb-1">
          {t('pages.reviews.sortBy')}
        </span>
        <div className="w-full sm:w-55">
          <ComboBox
            options={Object.values(ReviewSortFields)}
            onChange={(val) => {
              setSelectedOrder(val);
              setCurrentPage(1);
            }}
            className="border border-white/10"
            value={selectedOrder}
            formatOption={(o) => translateReviewSortField(t, o)}
          />
        </div>
      </div>

      <section className="mt-5 overflow-hidden">
        <div className="gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3">
          {isPending
            ? Array.from({ length: limit }).map((_, idx) => (
                <ReviewCard key={`reviews-skeleton-${idx}`} isLoading={true} />
              ))
            : items.map((review) => (
                <ReviewCard key={review.id} review={review} isLoading={false} />
              ))}
          {items.length === 0 && !isPending && (
            <p className="text-center text-2xl font-semibold mt-10 w-full absolute">
              {t('pages.reviews.notFound')}
            </p>
          )}
        </div>
      </section>

      {items.length > 0 && (
        <div className="mt-20">
          <Pagination
            currentPage={currentPage}
            totalItems={total}
            itemsPerPage={limit}
            setCurrentPage={setCurrentPage}
            idToScroll={'reviews'}
          />
        </div>
      )}
    </>
  );
};

export default ReviewsPage;
