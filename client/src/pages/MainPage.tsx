import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'
import Sidebar from '../components/sidebar/Sidebar'

const MainPage = () => {
	return (
		<>
			<Sidebar />
			<div className='lg:pl-14 flex flex-col h-full min-h-screen'>
				<Header />
				<Footer />
			</div>
		</>
	)
}

export default MainPage
