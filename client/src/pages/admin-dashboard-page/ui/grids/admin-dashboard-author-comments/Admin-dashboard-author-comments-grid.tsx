import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthorCommentAPI } from '../../../../../api/author/author-comment-api';
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header';
import Pagination from '../../../../../components/pagination/Pagination';
import { authorCommentsKeys } from '../../../../../query-keys/author-comments-keys';
import { AuthorCommentsQuery } from '../../../../../types/author';
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum';
import { SortOrder } from '../../../../../types/common/types/sort-order';
import AdminDashboardAuthorCommentsGridItem from './Admin-dashboard-author-comments-grid-item';

const limit = 10;

const AdminDashboardAuthorCommentsGrid = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC);

  const query: AuthorCommentsQuery = {
    limit,
    offset: (currentPage - 1) * limit,
    sortOrder: order,
    search: searchText.trim(),
  };

  const { data, isLoading } = useQuery({
    queryKey: authorCommentsKeys.list(query),
    queryFn: () => AuthorCommentAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const comments = data?.items || [];
  const count = data?.meta.count || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  return (
    <div className="flex flex-col h-screen" id="admin-author-comments">
      <AdminHeader
        title={t('adminDashboard.headers.authorComments')}
        setText={setSearchText}
      />

      <div
        id="admin-author-comments-grid"
        className="flex flex-col overflow-hidden p-5"
      >
        <AdminDashboardAuthorCommentsGridItem
          className="bg-white/5 font-medium max-xl:hidden"
          isLoading={false}
          order={order}
          toggleOrder={() =>
            setOrder(
              order === SortOrdersEnum.DESC
                ? SortOrdersEnum.ASC
                : SortOrdersEnum.DESC
            )
          }
        />

        <div className="flex-1 overflow-y-auto mt-5">
          <div className="grid gap-y-5">
            {isLoading
              ? Array.from({ length: limit }).map((_, idx) => (
                  <AdminDashboardAuthorCommentsGridItem
                    key={`Comment-skeleton-${idx}`}
                    isLoading={true}
                  />
                ))
              : comments.map((comment, idx) => (
                  <AdminDashboardAuthorCommentsGridItem
                    key={comment.id}
                    comment={comment}
                    isLoading={isLoading}
                    position={(currentPage - 1) * limit + idx + 1}
                  />
                ))}
          </div>
        </div>

        {!isLoading && count === 0 && (
          <span className="font-medium mx-auto mt-5 text-lg">
            {t('adminDashboard.authorComments.notFound')}
          </span>
        )}

        {!isLoading && count > 0 && (
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalItems={count}
              itemsPerPage={limit}
              setCurrentPage={setCurrentPage}
              idToScroll={'admin-author-comments-grid'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardAuthorCommentsGrid;
