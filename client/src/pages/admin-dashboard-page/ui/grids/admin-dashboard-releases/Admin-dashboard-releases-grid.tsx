import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseAPI } from '../../../../../api/release/release-api.ts';
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx';
import Pagination from '../../../../../components/pagination/Pagination.tsx';
import ReleaseTypeIcon from '../../../../../components/release/Release-type-icon.tsx';
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx';
import { useReleaseMeta } from '../../../../../hooks/meta';
import { releasesKeys } from '../../../../../query-keys/releases-keys.ts';
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum.ts';
import { SortOrder } from '../../../../../types/common/types/sort-order.ts';
import {
  ReleasesQuery,
  ReleaseTypesFilterOptions,
} from '../../../../../types/release/index.ts';
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx';
import AdminDashboardReleasesGridItem from './Admin-dashboard-releases-grid-item.tsx';
import ReleaseFormModal from './Release-form-modal.tsx';

const limit = 10;

const AdminDashboardReleasesGrid = () => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeType, setActiveType] = useState<string>(
    ReleaseTypesFilterOptions.ALL
  );
  const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC);

  const { types, isLoading: isTypesLoading } = useReleaseMeta();

  const typeId =
    activeType === ReleaseTypesFilterOptions.ALL
      ? undefined
      : types.find((type) => type.type === activeType)?.id;

  const query: ReleasesQuery = {
    typeId,
    search: searchText.trim() || undefined,
    sortOrder: order,
    limit,
    offset: (currentPage - 1) * limit,
  };

  const { data, isPending: isReleasesLoading } = useQuery({
    queryKey: releasesKeys.list(query),
    queryFn: () => ReleaseAPI.findAll(query),
    enabled: !isTypesLoading,
    staleTime: 1000 * 60 * 5,
  });

  const releases = data?.items || [];
  const count = data?.meta.count || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, activeType]);

  return (
    <div className="flex flex-col h-screen" id="admin-authors">
      <AdminHeader
        title={t('adminDashboard.headers.releases')}
        setText={setSearchText}
      />

      {!isTypesLoading && (
        <ReleaseFormModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      <div id="admin-users-grid" className="flex flex-col overflow-hidden p-5">
        <div className="flex flex-wrap xl:mb-5 gap-y-2 text-white/80 border-b border-white/10">
          {isTypesLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonLoader
                  key={`skeleton-button-${idx}`}
                  className="w-20 h-4 rounded-lg mr-5 mb-1"
                />
              ))
            : Object.values(ReleaseTypesFilterOptions).map((type) => (
                <AdminFilterButton
                  key={type}
                  title={
                    <span className={`flex items-center px-2`}>
                      <ReleaseTypeIcon type={type} className={'size-5 mr-1'} />
                      {type}
                    </span>
                  }
                  isActive={activeType === type}
                  onClick={() => setActiveType(type)}
                />
              ))}

          <div className="ml-auto max-sm:hidden">
            <AdminFilterButton
              title={t('adminDashboard.releases.add')}
              isActive={false}
              onClick={() => setAddModalOpen(true)}
            />
          </div>
        </div>

        <div className="sm:hidden mt-2 text-white/80 border-b border-white/10">
          <AdminFilterButton
            title={t('adminDashboard.releases.add')}
            isActive={false}
            onClick={() => setAddModalOpen(true)}
          />
        </div>

        <AdminDashboardReleasesGridItem
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

        {!isReleasesLoading && count === 0 && (
          <span className="font-medium mx-auto mt-5 text-lg">
            {t('adminDashboard.releases.notFound')}
          </span>
        )}

        <div className="flex-1 overflow-y-auto mt-5">
          <div className="grid gap-y-5">
            {isReleasesLoading
              ? Array.from({ length: limit }).map((_, idx) => (
                  <AdminDashboardReleasesGridItem
                    key={`Release-skeleton-${idx}`}
                    isLoading={isReleasesLoading}
                  />
                ))
              : releases.map((release, idx) => (
                  <AdminDashboardReleasesGridItem
                    key={release.id}
                    release={release}
                    isLoading={isReleasesLoading}
                    position={(currentPage - 1) * limit + idx + 1}
                  />
                ))}
          </div>
        </div>

        {!isReleasesLoading && count > 0 && (
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalItems={count}
              itemsPerPage={limit}
              setCurrentPage={setCurrentPage}
              idToScroll={'admin-authors-grid'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardReleasesGrid;
