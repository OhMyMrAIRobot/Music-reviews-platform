import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ReleaseMediaAPI } from '../../api/release/release-media-api';
import ComboBox from '../../components/buttons/Combo-box';
import Pagination from '../../components/pagination/Pagination';
import ReleaseMediaReview from '../../components/release/release-media/Release-media-review';
import { useReleaseMediaMeta } from '../../hooks/meta';
import { releaseMediaKeys } from '../../query-keys/release-media-keys';
import { SortOrdersEnum } from '../../types/common/enums/sort-orders-enum';
import type { SortOrder } from '../../types/common/types/sort-order';
import {
  ReleaseMediaQuery,
  ReleaseMediaStatusesEnum,
  ReleaseMediaTypesEnum,
} from '../../types/release';
import { ReviewSortFields } from '../../types/review';

const limit = 12;

const MediaReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<string>(
    ReviewSortFields.NEW
  );

  const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta();

  const typeId = useMemo(
    () => types.find((t) => t.type === ReleaseMediaTypesEnum.MEDIA_REVIEW)?.id,
    [types]
  );

  const statusId = useMemo(
    () =>
      statuses.find((s) => s.status === ReleaseMediaStatusesEnum.APPROVED)?.id,
    [statuses]
  );

  const order: SortOrder = useMemo(
    () =>
      selectedOrder === ReviewSortFields.NEW
        ? SortOrdersEnum.DESC
        : SortOrdersEnum.ASC,
    [selectedOrder]
  );

  const query: ReleaseMediaQuery = {
    statusId,
    typeId,
    order,
    limit,
    offset: (currentPage - 1) * limit,
  };

  const { data, isPending: isMediaLoading } = useQuery({
    queryKey: releaseMediaKeys.list(query),
    queryFn: () => ReleaseMediaAPI.findAll(query),
    enabled: Boolean(typeId && statusId),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];
  const total = data?.meta.count ?? 0;

  // const { storeToggle } = useQueryListFavToggleAll<
  // 	IReleaseMedia,
  // 	{ releaseMedia: IReleaseMedia[] }
  // >(releaseMediaKeys.all, 'releaseMedia', toggleFavMedia)

  return (
    <>
      <h1 id="media-reviews" className="text-2xl lg:text-3xl font-semibold">
        Медиарецензии
      </h1>

      <div className="rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 flex gap-4 items-center">
        <span className="hidden sm:block text-white/70 font-bold ">
          Сортировать по:
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
          />
        </div>
      </div>

      <section className="mt-5 overflow-hidden">
        <div className="gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3">
          {isMediaLoading || isMetaLoading
            ? Array.from({ length: limit }).map((_, idx) => (
                <ReleaseMediaReview
                  key={`skeleton-release-media-${idx}`}
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

          {items.length === 0 && !isMediaLoading && !isMetaLoading && (
            <p className="text-center text-2xl font-semibold mt-10 w-full absolute">
              Медиарецензии не найдены!
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
            idToScroll={'media-reviews'}
          />
        </div>
      )}
    </>
  );
};

export default MediaReviewsPage;
