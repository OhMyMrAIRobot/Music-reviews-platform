import AdminHeader from '../../components/admin-header/Admin-header'
import AdminSidebar from '../../components/admin-sidebar/Admin-sidebar'

const AdminPanelPage = () => {
	return (
		<div className='bg-white/5 min-h-4000 min-w-screen flex'>
			<AdminSidebar />
			<AdminHeader
				title={'Пользователи'}
				searchText={''}
				setSearchText={function (val: string): void {
					throw new Error('Function not implemented.')
				}}
			/>
		</div>
	)
}

export default AdminPanelPage
