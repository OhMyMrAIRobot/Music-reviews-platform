import { FC, useState } from 'react'
import ConfirmationModal from '../../../../components/modals/Confirmation-modal'
import ReleaseTypeIcon from '../../../../components/release/Release-type-icon'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { AuthorTypesEnum } from '../../../../models/author/author-type'
import { IAdminRelease } from '../../../../models/release/admin-releases-response'
import { getAuthorTypeColor } from '../../../../utils/get-author-type-color'
import { getReleaseTypeColor } from '../../../../utils/get-release-type-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminEditButton from '../../buttons/Admin-edit-button'

interface IProps {
	className?: string
	release?: IAdminRelease
	isLoading: boolean
	position?: number
	deleteRelease?: () => void
}

const AdminDashboardReleasesGridItem: FC<IProps> = ({
	className,
	release,
	isLoading,
	position,
	deleteRelease,
}) => {
	const { navigateToRelease } = useCustomNavigate()

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

	const handleDelete = () => {
		if (deleteRelease) {
			deleteRelease()
		}
	}

	const handleNavigate = () => {
		if (release) {
			navigateToRelease(release.id)
		}
	}

	return isLoading ? (
		<div className='bg-gray-400 w-full h-12 rounded-lg animate-pulse opacity-40' />
	) : (
		<>
			{release && (
				<ConfirmationModal
					title={'Вы действительно хотите удалить релиз?'}
					isOpen={confModalOpen}
					onConfirm={handleDelete}
					onCancel={() => setConfModalOpen(false)}
				/>
			)}

			<div
				className={`${className} text-[10px] md:text-sm h-10 md:h-12 w-full rounded-lg grid grid-cols-10 lg:grid-cols-12 items-center px-3 border border-white/10 text-nowrap`}
			>
				<div className='col-span-1 text-ellipsis line-clamp-1'>
					{position ?? '#'}
				</div>

				<div className='col-span-2 h-full flex items-center mr-2'>
					{release ? (
						<button
							onClick={handleNavigate}
							className='flex text-left gap-x-2 items-center cursor-pointer hover:bg-white/5 rounded-lg px-2 py-0.5'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
									release.img === ''
										? import.meta.env.VITE_DEFAULT_COVER
										: release.img
								}`}
								alt={release.title}
								className='size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
								{release.title}
							</span>
						</button>
					) : (
						<span className='px-4'>Название релиза</span>
					)}
				</div>

				<div className='col-span-1 text-ellipsis line-clamp-1 font-medium'>
					{release ? (
						<div
							className={`flex gap-x-1 items-center ${getReleaseTypeColor(
								release.releaseType.type
							)}`}
						>
							<ReleaseTypeIcon
								type={release.releaseType.type}
								className={'size-5'}
							/>
							<span>{release.releaseType.type}</span>
						</div>
					) : (
						<span>Тип релиза</span>
					)}
				</div>

				<div className='col-span-1 text-ellipsis text-wrap font-medium'>
					{release ? (
						<span>{release.publishDate}</span>
					) : (
						<span>Дата публикации</span>
					)}
				</div>

				<div className='col-span-2 line-clamp-2 text-wrap text-ellipsis font-medium mr-2'>
					{release ? (
						release.releaseArtists.length === 0 ? (
							<span className='opacity-50 font-medium'>Отсутствует</span>
						) : (
							release.releaseArtists.map((ra, idx) => (
								<span key={ra.id}>
									<span
										className={`font-medium ${getAuthorTypeColor(
											AuthorTypesEnum.ARTIST
										)}`}
									>
										{ra.name}
									</span>
									{idx < release.releaseArtists.length - 1 && ', '}
								</span>
							))
						)
					) : (
						<span>Артист</span>
					)}
				</div>

				<div className='col-span-2 line-clamp-2 text-wrap text-ellipsis font-medium mr-2'>
					{release ? (
						release.releaseProducers.length === 0 ? (
							<span className='opacity-50 font-medium'>Отсутствует</span>
						) : (
							release.releaseProducers.map((rp, idx) => (
								<span key={rp.id}>
									<span
										className={`font-medium ${getAuthorTypeColor(
											AuthorTypesEnum.PRODUCER
										)}`}
									>
										{rp.name}
									</span>
									{idx < release.releaseProducers.length - 1 && ', '}
								</span>
							))
						)
					) : (
						<span>Продюссер</span>
					)}
				</div>

				<div className='col-span-2 line-clamp-2 text-wrap text-ellipsis font-medium mr-2'>
					{release ? (
						release.releaseDesigners.length === 0 ? (
							<span className='opacity-50 font-medium'>Отсутствует</span>
						) : (
							release.releaseDesigners.map((rd, idx) => (
								<span key={rd.id}>
									<span
										className={`font-medium ${getAuthorTypeColor(
											AuthorTypesEnum.DESIGNER
										)}`}
									>
										{rd.name}
									</span>
									{idx < release.releaseDesigners.length - 1 && ', '}
								</span>
							))
						)
					) : (
						<span>Дизайнер</span>
					)}
				</div>

				<div className='col-span-1'>
					{release ? (
						<div className='flex gap-x-3 justify-end'>
							<AdminEditButton onClick={() => setEditModalOpen(true)} />
							<AdminDeleteButton onClick={() => setConfModalOpen(true)} />
						</div>
					) : (
						'Действие'
					)}
				</div>
			</div>
		</>
	)
}

export default AdminDashboardReleasesGridItem
