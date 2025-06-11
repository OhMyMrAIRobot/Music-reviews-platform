import { FC } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { IPreferredItem } from '../../model/profile/preferred-item'

interface IProps {
	item: IPreferredItem
	isAuthor: boolean
}

const PreferItem: FC<IProps> = ({ item, isAuthor }) => {
	const { navigateToAuthor, navigateToRelease } = useCustomNavigate()

	return (
		<button
			onClick={() =>
				isAuthor ? navigateToAuthor(item.id) : navigateToRelease(item.id)
			}
			className='flex flex-col justify-start rounded-[25px] lg:rounded-[30px] hover:bg-opacity-[0.08] duration-300 cursor-pointer w-full p-1 aspect-square'
		>
			<img
				loading='lazy'
				decoding='async'
				src={`${import.meta.env.VITE_SERVER_URL}/public/${
					isAuthor ? 'authors/avatars' : 'releases'
				}/${item.image}`}
				className={`size-full object-cover object-center hover:ring-4 ring-white/20 transition-all duration-300 ${
					isAuthor ? 'rounded-full' : 'rounded-lg'
				}`}
			/>
			<span className='text-xs md:text-sm text-center w-full font-semibold antialiased leading-5 mt-2 block text-nowrap text-ellipsis overflow-hidden'>
				{item.name}
			</span>
		</button>
	)
}

export default PreferItem
