import { Routes } from 'react-router'
import Layout from './Layout'
import GlobalRoutes from './routes/GlobalRoutes'

export function App() {
	return (
		<Layout>
			<Routes>{GlobalRoutes()}</Routes>
		</Layout>
	)
}
