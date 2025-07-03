import useCustomNavigate from '../../hooks/use-custom-navigate'
import LogoutSvg from '../header/svg/Logout-svg'
import ProfileSvg from '../header/svg/Profile-svg'
import TextReviewSvg from '../review/svg/Text-review-svg'
import AuthorSvg from '../sidebar/svg/Author-svg'
import ReleaseSvg from '../sidebar/svg/Release-svg'
import LogoFullSvg from '../svg/Logo-full-svg'
import LogoSmallSvg from '../svg/Logo-small-svg'
import PencilSvg from '../svg/Pencil-svg'
import AdminSidebarItem, { IAdminSidebarItemProps } from './Admin-sidebar-item'

const AdminSidebar = () => {
	const { navigateToMain } = useCustomNavigate()

	const adminSidebarItems: IAdminSidebarItemProps[] = [
		{
			title: 'Релизы',
			isActive: true,
			onClick: () => {
				throw new Error('Function not implemented.')
			},
			svgIcon: <ReleaseSvg className={'size-5'} />,
		},
		{
			title: 'Пользователи',
			isActive: false,
			onClick: () => {
				throw new Error('Function not implemented.')
			},
			svgIcon: <ProfileSvg className={'size-5'} />,
		},
		{
			title: 'Авторы',
			isActive: false,
			onClick: () => {
				throw new Error('Function not implemented.')
			},
			svgIcon: <AuthorSvg className={'size-5'} />,
		},
		{
			title: 'Рецензии',
			isActive: false,
			onClick: () => {
				throw new Error('Function not implemented.')
			},
			svgIcon: <TextReviewSvg className={'size-5'} />,
		},
		{
			title: 'Сообщения',
			isActive: false,
			onClick: () => {
				throw new Error('Function not implemented.')
			},
			svgIcon: <PencilSvg className={'size-3.5'} />,
		},
	]

	return (
		<div className='fixed flex flex-col px-2 gap-1.5 inset-0 w-14 lg:w-50 border-r border-white/15 bg-zinc-950 pt-3 pb-5'>
			<span className='w-full pb-2 lg:pb-4 flex justify-center'>
				<LogoFullSvg className={'w-4/5 hidden lg:block'} />
				<LogoSmallSvg className={'w-4/5 lg:hidden'} />
			</span>

			{adminSidebarItems.map(item => (
				<AdminSidebarItem key={item.title} {...item} />
			))}

			<div className='mt-auto'>
				<AdminSidebarItem
					title={'Выйти из панели'}
					isActive={false}
					onClick={navigateToMain}
					svgIcon={<LogoutSvg className={'size-4'} />}
				/>
			</div>
		</div>
	)
}

export default AdminSidebar
