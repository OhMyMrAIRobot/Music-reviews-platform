import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import AlbumValue from '../../../../components/album-value/Album-value'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'

interface IProps {
	releaseId: string
}

const ReleaseDetailsAlbumValue: FC<IProps> = observer(({ releaseId }) => {
	const { releaseDetailsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		releaseDetailsPageStore.fetchAlbumValue
	)

	useEffect(() => {
		fetch(releaseId)
	}, [fetch, releaseId])

	if (isLoading)
		return <SkeletonLoader className={'w-full h-65 mt-5 rounded-xl'} />

	if (!releaseDetailsPageStore.albumValue) {
		return null
	}

	return <AlbumValue {...releaseDetailsPageStore.albumValue} />
})

export default ReleaseDetailsAlbumValue
