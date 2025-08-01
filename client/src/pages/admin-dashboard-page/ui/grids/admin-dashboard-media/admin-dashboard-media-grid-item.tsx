import { FC } from 'react'
import ArrowBottomSvg from '../../../../../components/header/svg/Arrow-bottom-svg'
import ReleaseMediaStatusIcon from '../../../../../components/release-media/Release-media-status-icon'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import useCustomNavigate from '../../../../../hooks/use-custom-navigate'
import { IReleaseMedia } from '../../../../../models/release-media/release-media'
import { SortOrderEnum } from '../../../../../models/sort/sort-order-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import { getReleaseMediaStatusColor } from '../../../../../utils/get-release-media-status-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminOpenButton from '../../buttons/Admin-open-button'

interface IProps {
	className?: string
	media?: IReleaseMedia
	position?: number
	isLoading: boolean
	order?: SortOrder
	toggleOrder?: () => void
	refetch?: () => void
}

const AdminDashboardMediaGridItem: FC<IProps> = ({
	position,
	isLoading,
	className,
	media,
	order,
	toggleOrder,
}) => {
	const { navigateToRelease } = useCustomNavigate()

	const handleNavigateRelease = () => {
		if (media) {
			navigateToRelease(media.release.id)
		}
	}

	const toggle = () => {
		if (toggleOrder) {
			toggleOrder()
		}
	}

	return isLoading ? (
		<SkeletonLoader className='w-full h-12 rounded-lg' />
	) : (
		<>
			<div
				className={`${className} text-[10px] md:text-sm h-10 md:h-12 w-full rounded-lg grid grid-cols-10 lg:grid-cols-12 items-center px-3 border border-white/10 text-nowrap`}
			>
				<div className='col-span-1 text-ellipsis line-clamp-1'>
					{position ?? '#'}
				</div>

				<div className='col-span-2 h-full flex items-center mr-2'>
					{media ? (
						<button
							onClick={handleNavigateRelease}
							className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg px-1.5 py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
									media.release.img === ''
										? import.meta.env.VITE_DEFAULT_COVER
										: media.release.img
								}`}
								alt={media.release.title}
								className='size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
								{media.release.title}
							</span>
						</button>
					) : (
						<span className='px-2'>Название релиза</span>
					)}
				</div>

				<div className='col-span-2 font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap mr-2'>
					{media ? <span>{media.title}</span> : <span>Заголовок</span>}
				</div>

				<div className='col-span-2 text-ellipsis line-clamp-1 font-medium'>
					{media ? (
						<div
							className={`flex gap-x-1 items-center ${getReleaseMediaStatusColor(
								media.releaseMediaType.type
							)}`}
						>
							<span>{media.releaseMediaType.type}</span>
						</div>
					) : (
						<span>Тип медиа</span>
					)}
				</div>

				<div className='col-span-2 text-ellipsis text-wrap font-medium'>
					{media ? (
						<span>{media.createdAt}</span>
					) : (
						<button
							onClick={toggle}
							className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
						>
							<span>Дата публикации</span>
							<ArrowBottomSvg
								className={`size-3 ${
									order === SortOrderEnum.ASC ? 'rotate-180' : ''
								}`}
							/>
						</button>
					)}
				</div>

				<div className='col-span-2 text-ellipsis line-clamp-1 font-medium'>
					{media ? (
						<div
							className={`flex gap-x-1 items-center ${getReleaseMediaStatusColor(
								media.releaseMediaStatus.status
							)}`}
						>
							<ReleaseMediaStatusIcon
								status={media.releaseMediaStatus.status}
								className={'size-5'}
							/>
							<span>{media.releaseMediaStatus.status}</span>
						</div>
					) : (
						<span>Статус медиа</span>
					)}
				</div>

				<div className='col-span-1'>
					{media ? (
						<div className='flex gap-x-3 justify-end'>
							<AdminOpenButton onClick={() => {}} />
							<AdminDeleteButton onClick={() => {}} />
						</div>
					) : (
						'Действие'
					)}
				</div>
			</div>
		</>
	)
}

export default AdminDashboardMediaGridItem
