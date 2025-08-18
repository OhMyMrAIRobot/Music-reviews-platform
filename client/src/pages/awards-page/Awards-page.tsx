import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'

const AwardsPage = observer(() => {
	const { awardsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(awardsPageStore.fetchAwards)

	useEffect(() => {
		fetch(null, 2025)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <div>Awards</div>
})

export default AwardsPage
