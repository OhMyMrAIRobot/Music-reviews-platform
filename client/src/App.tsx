import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'

export function App() {
	return (
		<>
			<Sidebar />
			<div className='lg:pl-14'>
				<Header />
			</div>
		</>
	)
}
