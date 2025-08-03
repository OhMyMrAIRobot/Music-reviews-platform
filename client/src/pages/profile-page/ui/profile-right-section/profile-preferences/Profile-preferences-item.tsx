import { FC } from 'react'
import { Link } from 'react-router'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { IPreferredItem } from '../../../../../models/profile/preferred-item'

interface IProps {
	item?: IPreferredItem
	isAuthor: boolean
	isLoading: boolean
}

const ProfilePreferencesItem: FC<IProps> = ({ item, isAuthor, isLoading }) => {
	const { navigateToAuthorDetails, navigateToReleaseDetails } =
		useNavigationPath()

	return isLoading ? (
		<div className='p-1'>
			<SkeletonLoader className='w-full rounded-[25px] lg:rounded-[30px] aspect-square' />
		</div>
	) : (
		item && (
			<Link
				to={
					isAuthor
						? navigateToAuthorDetails(item.id)
						: navigateToReleaseDetails(item.id)
				}
				className='flex flex-col justify-start rounded-[25px] lg:rounded-[30px] hover:bg-opacity-[0.08] duration-300 cursor-pointer w-full p-1 aspect-square'
			>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/${
						isAuthor ? 'authors/avatars' : 'releases'
					}/${
						item.image === '' ? import.meta.env.VITE_DEFAULT_AVATAR : item.image
					}`}
					className={`size-full object-cover object-center hover:ring-4 ring-white/20 transition-all duration-300 ${
						isAuthor ? 'rounded-full' : 'rounded-lg'
					}`}
				/>
				<span className='text-xs md:text-sm text-center w-full font-semibold antialiased leading-5 mt-2 block text-nowrap text-ellipsis overflow-hidden'>
					{item.name}
				</span>
			</Link>
		)
	)
}

export default ProfilePreferencesItem
