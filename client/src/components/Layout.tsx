import { FC, ReactNode } from 'react'
import Footer from './footer/Footer'
import Header from './header/Header'
import Sidebar from './sidebar/Sidebar'

interface ILayoutProps {
	children: ReactNode
}

const Layout: FC<ILayoutProps> = ({ children }) => {
	return (
		<>
			<Sidebar />
			<div className='lg:pl-14 w-full flex flex-col h-full min-h-screen items-center'>
				<Header />
				<div className='2xl:container pb-8 h-full mt-5 lg:mt-8 px-4 w-full'>
					{children}
				</div>
				<Footer />
			</div>
		</>
	)
}

export default Layout
