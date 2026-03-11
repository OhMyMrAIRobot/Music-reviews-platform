import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthorCommentAPI } from '../../api/author/author-comment-api';
import AuthorCommentCard from '../../components/author/author-comment/Author-comment-card';
import AuthorCommentColorSvg from '../../components/author/author-comment/svg/Author-comment-color-svg';
import ComboBox from '../../components/buttons/Combo-box';
import Pagination from '../../components/pagination/Pagination';
import { authorCommentsKeys } from '../../query-keys/author-comments-keys';
import { AuthorCommentsQuery } from '../../types/author';
import { SortOrdersEnum } from '../../types/common/enums/sort-orders-enum';
import { ReviewSortFields } from '../../types/review';

const limit = 12;

const AuthorCommentsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<string>(
    ReviewSortFields.NEW
  );

  const sortOrder =
    selectedOrder === ReviewSortFields.NEW
      ? SortOrdersEnum.DESC
      : SortOrdersEnum.ASC;

  const query: AuthorCommentsQuery = {
    limit,
    sortOrder,
    offset: (currentPage - 1) * limit,
  };

  const { data, isPending } = useQuery({
    queryKey: authorCommentsKeys.list(query),
    queryFn: () => AuthorCommentAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const comments = data?.items ?? [];
  const totalCount = data?.meta.count ?? 0;

  return (
    <>
      <div className="flex items-center gap-x-2.5">
        <AuthorCommentColorSvg className="size-8" />
        <h1 id="author-comments" className="text-2xl lg:text-3xl font-semibold">
          Авторские комментарии
        </h1>
      </div>

      <div className="rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 grid md:flex gap-x-4 items-center">
        <span className="text-sm md:text-base text-white/70 font-bold max-md:pb-1">
          Сортировать по:
        </span>
        <div className="w-full sm:w-55">
          <ComboBox
            options={Object.values(ReviewSortFields)}
            onChange={setSelectedOrder}
            className="border border-white/10"
            value={selectedOrder}
          />
        </div>
      </div>

      <section className="mt-5 overflow-hidden py-2">
        <div className="gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1">
          {isPending
            ? Array.from({ length: limit }).map((_, idx) => (
                <AuthorCommentCard
                  key={`skeleton-author-comment-${idx}`}
                  isLoading={true}
                />
              ))
            : comments.map((comment) => (
                <AuthorCommentCard
                  key={comment.id}
                  comment={comment}
                  isLoading={false}
                />
              ))}

          {comments.length === 0 && !isPending && (
            <p className="text-center text-2xl font-semibold mt-10 w-full absolute">
              Авторские комментарии не найдены!
            </p>
          )}
        </div>
      </section>

      {comments.length > 0 && (
        <div className="mt-20">
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={limit}
            setCurrentPage={setCurrentPage}
            idToScroll={'author-comments'}
          />
        </div>
      )}
    </>
  );
};

export default AuthorCommentsPage;
