import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import AdminSearchBar from './Admin-search-bar'

interface IProps {
	title: string
	searchText: string
	setSearchText: (val: string) => void
}

const AdminHeader: FC<IProps> = observer(
	({ title, searchText, setSearchText }) => {
		const { authStore, profileStore } = useStore()

		const { execute: fetchProfile, isLoading } = useLoading(
			profileStore.fetchProfile
		)

		useEffect(() => {
			if (authStore.isAuth && authStore.user && !profileStore.profile) {
				fetchProfile(authStore.user.id)
			}
		}, [authStore.isAuth, authStore.user, fetchProfile, profileStore.profile])

		return (
			<div className='sticky top-0 w-screen bg-zinc-950 border-b ml-14 lg:ml-50 border-white/10 h-16 backdrop-blur-3xl flex items-center px-2 lg:px-5'>
				<h1 className='font-medium text-xl lg:text-2xl'>{title}</h1>

				<div className='w-full flex items-center justify-end gap-x-2 md:gap-x-3 font-medium text-sm lg:text-base ml-2 md:ml-0'>
					<AdminSearchBar
						searchText={searchText}
						setSearchText={setSearchText}
						onSubmit={function (): void {
							throw new Error('Function not implemented.')
						}}
						className='mr-2 md:mr-3'
					/>

					{isLoading ? (
						<>
							<div className='bg-gray-400 size-10 animate-pulse opacity-40 rounded-full' />
							<div className='bg-gray-400 w-25 h-6 animate-pulse opacity-40' />
						</>
					) : (
						<>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
									profileStore.profile?.avatar
								}`}
								className='aspect-square rounded-full size-10 select-none'
							/>

							<span>{profileStore.profile?.nickname}</span>
						</>
					)}
				</div>
			</div>
		)
	}
)

export default AdminHeader
