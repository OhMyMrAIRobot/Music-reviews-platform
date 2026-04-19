import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserAPI } from '../../../../../api/user/user-api.ts';
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx';
import Pagination from '../../../../../components/pagination/Pagination.tsx';
import UserRoleSvg from '../../../../../components/user/User-role-svg.tsx';
import { usersKeys } from '../../../../../query-keys/users-keys.ts';
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum.ts';
import { SortOrder } from '../../../../../types/common/types/sort-order.ts';
import {
  RolesEnum,
  RolesFilterOptions,
  UsersQuery,
} from '../../../../../types/user/index.ts';
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx';
import AdminDashboardUsersGridItem from './Admin-dashboard-users-grid-item.tsx';
import { translateRolesFilterOption } from '../../../../../utils/user/user-role-i18n.ts';

const limit = 10;

const AdminDashboardUsersGrid = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>('');
  const [activeOption, setActiveOption] = useState<RolesFilterOptions>(
    RolesFilterOptions.ALL
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC);

  // TODO: FIX ENUM
  const query: UsersQuery = {
    search: searchText.trim() || undefined,
    order,
    limit,
    offset: (currentPage - 1) * limit,
    role:
      activeOption !== RolesFilterOptions.ALL
        ? (activeOption as unknown as RolesEnum)
        : undefined,
  };

  const { data: usersData, isPending: isLoading } = useQuery({
    queryKey: usersKeys.list(query),
    queryFn: () => UserAPI.findAll(query),
  });

  const users = usersData?.items || [];
  const count = usersData?.meta.count || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeOption, searchText]);

  return (
    <div className="flex flex-col h-screen" id="admin-users">
      <AdminHeader
        title={t('adminDashboard.headers.users')}
        setText={setSearchText}
      />

      <div id="admin-users-grid" className="flex flex-col overflow-hidden p-5">
        <div className="flex flex-wrap xl:mb-5 gap-y-2 text-white/80 border-b border-white/10">
          {Object.values(RolesFilterOptions).map((option) => (
            <AdminFilterButton
              key={option}
              title={
                <span className={`flex items-center px-2`}>
                  <UserRoleSvg
                    role={{ id: '0', role: option }}
                    className={'size-5 mr-1'}
                  />
                  {translateRolesFilterOption(t, option)}
                </span>
              }
              isActive={activeOption === option}
              onClick={() => setActiveOption(option)}
            />
          ))}
        </div>

        <AdminDashboardUsersGridItem
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
                  <AdminDashboardUsersGridItem
                    key={`User-skeleton-${idx}`}
                    isLoading={isLoading}
                  />
                ))
              : users.map((user, idx) => (
                  <AdminDashboardUsersGridItem
                    key={user.id}
                    user={user}
                    isLoading={isLoading}
                    position={(currentPage - 1) * limit + idx + 1}
                  />
                ))}
          </div>
        </div>

        {!isLoading && count === 0 && (
          <span className="font-medium mx-auto mt-5 text-xl">
            {t('adminDashboard.users.notFound')}
          </span>
        )}

        {!isLoading && count > 0 && (
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalItems={count}
              itemsPerPage={limit}
              setCurrentPage={setCurrentPage}
              idToScroll={'admin-users-grid'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardUsersGrid;
