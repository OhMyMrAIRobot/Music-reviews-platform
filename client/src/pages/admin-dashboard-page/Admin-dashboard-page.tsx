import { Outlet } from 'react-router'
import AdminSidebar from '../../components/layout/admin-sidebar/Admin-sidebar'

const AdminDashboardPage = () => {
	return (
		<div className='bg-white/5 flex'>
			<AdminSidebar />
			<div className='ml-14 lg:ml-55 w-full relative'>
				<Outlet />
			</div>
		</div>
	)
}

export default AdminDashboardPage
