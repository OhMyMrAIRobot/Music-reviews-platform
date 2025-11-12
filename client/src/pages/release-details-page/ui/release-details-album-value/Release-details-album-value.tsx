import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { AlbumValueAPI } from '../../../../api/album-value-api'
import AlbumValue from '../../../../components/album-value/Album-value'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { albumValuesKeys } from '../../../../query-keys/album-values-keys'

interface IProps {
	releaseId: string
}

const ReleaseDetailsAlbumValue: FC<IProps> = ({ releaseId }) => {
	const queryKey = albumValuesKeys.byRelease(releaseId)

	const { data, isPending } = useQuery({
		queryKey,
		queryFn: () => AlbumValueAPI.fetchByReleaseId(releaseId),
		staleTime: 1000 * 60 * 5,
		retry: false,
	})

	if (isPending)
		return <SkeletonLoader className={'w-full h-65 mt-5 rounded-xl'} />

	if (!data) return null

	return <AlbumValue {...data} />
}

export default ReleaseDetailsAlbumValue
