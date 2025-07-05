import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AdminHeader from '../../../../components/admin-header/Admin-header'
import AdminFilterButton from '../../../../components/buttons/Admin-filter-button'
import Pagination from '../../../../components/pagination/Pagination'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { RolesFilterOptions } from '../../../../models/role/roles-filter-options'
import { SortOrderEnum } from '../../../../models/sort/sort-order-enum'
import { SortOrder } from '../../../../types/sort-order-type'
import AdminPanelUsersGridItem from './Admin-panel-users-grid-item'

const AdminPanelUsersGrid = observer(() => {
	const perPage = 10

	const { adminPageUsersStore, notificationStore } = useStore()

	const [searchText, setSearchText] = useState<string>('')
	const [activeOption, setActiveOption] = useState<string>(
		RolesFilterOptions.ALL
	)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [order, setOrder] = useState<SortOrder>(SortOrderEnum.DESC)

	const { execute: fetch, isLoading } = useLoading(
		adminPageUsersStore.fetchUsers
	)

	const fetchUsers = () => {
		return fetch(
			searchText.trim().length > 0 ? searchText.trim() : null,
			activeOption !== RolesFilterOptions.ALL ? activeOption : null,
			order,
			perPage,
			(currentPage - 1) * perPage
		)
	}

	useEffect(() => {
		setCurrentPage(1)
		fetchUsers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeOption, searchText])

	useEffect(() => {
		fetchUsers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, order])

	const deleteUser = async (id: string) => {
		adminPageUsersStore.deleteUser(id).then(result => {
			notificationStore.addNotification({
				id: self.crypto.randomUUID(),
				text: result.message,
				isError: !result.status,
			})
			fetchUsers()
		})
	}

	return (
		<div className='flex flex-col h-screen'>
			<AdminHeader title={'Пользователи'} setText={setSearchText} />

			<div id='admin-users' className='flex flex-col overflow-hidden p-5'>
				<div className='flex mb-5 text-white/80 border-b border-white/10'>
					{Object.values(RolesFilterOptions).map(option => (
						<AdminFilterButton
							key={option}
							title={option}
							isActive={activeOption === option}
							onClick={() => setActiveOption(option)}
						/>
					))}
				</div>

				<AdminPanelUsersGridItem
					className='bg-white/5 font-medium'
					isLoading={false}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrderEnum.DESC
								? SortOrderEnum.ASC
								: SortOrderEnum.DESC
						)
					}
				/>

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminPanelUsersGridItem
										key={`User-skeleton-${idx}`}
										isLoading={isLoading}
									/>
							  ))
							: adminPageUsersStore.users.map((user, idx) => (
									<AdminPanelUsersGridItem
										key={user.id}
										user={user}
										isLoading={isLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										deleteUser={() => deleteUser(user.id)}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && adminPageUsersStore.count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Пользователи не найдены!
					</span>
				)}

				{!isLoading && adminPageUsersStore.count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminPageUsersStore.count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-users'}
						/>
					</div>
				)}
			</div>
		</div>
	)
})

export default AdminPanelUsersGrid
