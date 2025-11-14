import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UserAPI } from '../../../../../api/user/user-api.ts'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import UserRoleSvg from '../../../../../components/user/User-role-svg.tsx'
import { RolesFilterOptions } from '../../../../../models/role/roles-filter-options.ts'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum.ts'
import { usersKeys } from '../../../../../query-keys/users-keys.ts'
import { SortOrder } from '../../../../../types/sort-order-type.ts'
import AdminFilterButton from '../../buttons/Admin-filter-button.tsx'
import AdminToggleSortOrderButton from '../../buttons/Admin-toggle-sort-order-button.tsx'
import AdminDashboardUsersGridItem from './Admin-dashboard-users-grid-item.tsx'

const perPage = 10

const AdminDashboardUsersGrid = () => {
	const [searchText, setSearchText] = useState<string>('')
	const [activeOption, setActiveOption] = useState<string>(
		RolesFilterOptions.ALL
	)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const queryKey = usersKeys.adminList({
		query: searchText.trim().length > 0 ? searchText.trim() : null,
		role: activeOption !== RolesFilterOptions.ALL ? activeOption : null,
		order,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
	})

	const queryFn = () =>
		UserAPI.fetchUsers(
			searchText.trim().length > 0 ? searchText.trim() : null,
			activeOption !== RolesFilterOptions.ALL ? activeOption : null,
			order,
			perPage,
			(currentPage - 1) * perPage
		)

	const { data: usersData, isPending: isLoading } = useQuery({
		queryKey,
		queryFn,
	})

	const users = usersData?.users || []
	const count = usersData?.total || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [activeOption, searchText])

	return (
		<div className='flex flex-col h-screen' id='admin-users'>
			<AdminHeader title={'Пользователи'} setText={setSearchText} />

			<div id='admin-users-grid' className='flex flex-col overflow-hidden p-5'>
				<div className='flex flex-wrap xl:mb-5 gap-y-2 text-white/80 border-b border-white/10'>
					{Object.values(RolesFilterOptions).map(option => (
						<AdminFilterButton
							key={option}
							title={
								<span className={`flex items-center px-2`}>
									<UserRoleSvg
										role={{ id: '0', role: option }}
										className={'size-5 mr-1'}
									/>
									{option}
								</span>
							}
							isActive={activeOption === option}
							onClick={() => setActiveOption(option)}
						/>
					))}
				</div>

				<AdminToggleSortOrderButton
					title={'Дата создания'}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrdersEnum.DESC
								? SortOrdersEnum.ASC
								: SortOrdersEnum.DESC
						)
					}
				/>

				<AdminDashboardUsersGridItem
					className='bg-white/5 font-medium max-xl:hidden'
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

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isLoading
							? Array.from({ length: perPage }).map((_, idx) => (
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
										position={(currentPage - 1) * perPage + idx + 1}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && count === 0 && (
					<span className='font-medium mx-auto mt-5 text-xl'>
						Пользователи не найдены!
					</span>
				)}

				{!isLoading && count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-users-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboardUsersGrid
