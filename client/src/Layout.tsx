import { FC, ReactNode } from 'react'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'

interface ILayoutProps {
	children: ReactNode
}

const Layout: FC<ILayoutProps> = ({ children }) => {
	return (
		<>
			<Sidebar />
			<div className='lg:pl-14 flex flex-col h-full min-h-screen items-center'>
				<Header />
				<div className='2xl:container pb-8 mt-5 lg:mt-8 px-4 w-full'>
					{children}
				</div>
				<Footer />
			</div>
		</>
	)
}

export default Layout
