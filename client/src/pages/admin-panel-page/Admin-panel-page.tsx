import { Outlet } from 'react-router'
import AdminSidebar from '../../components/admin-sidebar/Admin-sidebar'

const AdminPanelPage = () => {
	return (
		<div className='bg-white/5 w-screen flex'>
			<AdminSidebar />
			<div className='ml-14 lg:ml-50 w-full'>
				<Outlet />
			</div>
		</div>
	)
}

export default AdminPanelPage
