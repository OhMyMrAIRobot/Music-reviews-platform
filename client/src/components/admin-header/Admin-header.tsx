import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import SkeletonLoader from '../utils/Skeleton-loader'
import AdminSearchBar from './Admin-search-bar'

interface IProps {
	title: string
	setText: (val: string) => void
}

const AdminHeader: FC<IProps> = observer(({ title, setText }) => {
	const { authStore, profileStore } = useStore()

	const [searchText, setSearchText] = useState<string>('')

	const { execute: fetchProfile, isLoading } = useLoading(
		profileStore.fetchProfile
	)

	useEffect(() => {
		if (authStore.isAuth && authStore.user && !profileStore.profile) {
			fetchProfile(authStore.user.id)
		}
	}, [authStore.isAuth, authStore.user, fetchProfile, profileStore.profile])

	return (
		<div className='sticky top-0 w-full bg-zinc-950 border-b border-white/10 h-16 backdrop-blur-3xl flex items-center px-2 py-1 lg:py-3 lg:px-5 z-100'>
			<h1 className='font-medium text-xl lg:text-2xl'>{title}</h1>

			<div className='w-full flex items-center justify-end gap-x-2 md:gap-x-3 font-medium text-sm lg:text-base ml-2 md:ml-0'>
				<AdminSearchBar
					searchText={searchText}
					setSearchText={setSearchText}
					onSubmit={() => setText(searchText)}
					className='mr-2 md:mr-3'
				/>

				{isLoading ? (
					<>
						<SkeletonLoader className={'size-10 rounded-full'} />
						<SkeletonLoader className={'w-25 h-6 rounded-lg'} />
					</>
				) : (
					<>
						<img
							loading='lazy'
							decoding='async'
							src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
								profileStore.profile?.avatar === ''
									? import.meta.env.VITE_DEFAULT_AVATAR
									: profileStore.profile?.avatar
							}`}
							className='aspect-square rounded-full size-10 select-none object-cover'
						/>

						<span>{profileStore.profile?.nickname}</span>
					</>
				)}
			</div>
		</div>
	)
})

export default AdminHeader
