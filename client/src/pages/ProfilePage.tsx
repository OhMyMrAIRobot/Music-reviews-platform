import { useParams } from 'react-router'

const ProfilePage = () => {
	const { id } = useParams()
	return <div>{id}</div>
}

export default ProfilePage
