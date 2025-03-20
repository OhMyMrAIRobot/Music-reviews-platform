import AuthContainer from '../components/auth/AuthContainer'
import RegistrationForm from '../components/auth/RegistrationForm'
import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'
import Sidebar from '../components/sidebar/Sidebar'

const MainPage = () => {
	return (
		<>
			<Sidebar />
			<div className='lg:pl-14 flex flex-col h-full min-h-screen items-center'>
				<Header />
				<div className='2xl:container pb-8 mt-5 lg:mt-8 px-4 w-full'>
					<AuthContainer>
						<RegistrationForm />
					</AuthContainer>
				</div>
				<Footer />
			</div>
		</>
	)
}

export default MainPage
