import { Outlet } from 'react-router'
import Footer from './footer/Footer'
import Header from './header/Header'
import Sidebar from './sidebar/Sidebar'

const Layout = () => {
	return (
		<>
			<Sidebar />
			<div className='lg:pl-14 w-full flex flex-col h-full min-h-screen items-center'>
				<Header />
				<div className='2xl:container pb-8 h-full mt-5 px-4 w-full'>
					<Outlet />
				</div>
				<Footer />
			</div>
		</>
	)
}

export default Layout
