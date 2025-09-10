import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import SkeletonLoader from '../../utils/Skeleton-loader'
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
		<div className='sticky top-0 w-full bg-zinc-950 border-b border-white/10 backdrop-blur-3xl md:flex items-center pt-1.5 pb-3 px-3 lg:px-5 z-100 grid'>
			<div className='flex items-center justify-between w-full'>
				<h1 className='font-medium text-xl lg:text-2xl md:text-nowrap'>
					{title}
				</h1>

				<div className='w-fit flex items-center justify-end gap-x-2 md:gap-x-3 font-medium text-sm lg:text-base max-md:ml-2'>
					<AdminSearchBar
						searchText={searchText}
						setSearchText={setSearchText}
						onSubmit={() => setText(searchText)}
						className='mr-2 md:mr-3 max-md:hidden'
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

			<div className='w-full mt-2 md:hidden'>
				<AdminSearchBar
					searchText={searchText}
					setSearchText={setSearchText}
					onSubmit={() => setText(searchText)}
					className='mr-2 md:mr-3'
				/>
			</div>
		</div>
	)
})

export default AdminHeader
