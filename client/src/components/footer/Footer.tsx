import FooterContactLink from './FooterContactLink'
import FooterLink from './FooterLink'
import FooterSocialContainer from './FooterSocialContainer'
import { IFooterSocialItemProps, SocialSvgIcon } from './FooterSocialItem'

const Footer = () => {
	const footerSocials: IFooterSocialItemProps[] = [
		{
			id: 'footer-social-1',
			href: '/',
			icon: <SocialSvgIcon className='size-5' />,
		},
		{
			id: 'footer-social-2',
			href: '/',
			icon: <SocialSvgIcon className='size-5' />,
		},
		{
			id: 'footer-social-3',
			href: '/',
			icon: <SocialSvgIcon className='size-5' />,
		},
		{
			id: 'footer-social-4',
			href: '/',
			icon: <SocialSvgIcon className='size-5' />,
		},
	]

	return (
		<footer className='p-5 lg:py-10 mt-auto bg-primary'>
			<div className='2xl:container grid lg:grid-cols-2 items-center gap-4 mx-auto'>
				<FooterSocialContainer items={footerSocials} />
				<div className='text-xs lg:text-right lg:text-sm'>
					<h6 className='opacity-50'>«Some application title» © 2025</h6>
					<div className='flex flex-col gap-y-0.5 opacity-80 items-start lg:items-end mt-2'>
						<FooterLink href='/' text='Обратная связь' />
						<FooterLink
							href='/'
							text='Политика обработки персональных данных'
						/>
						<FooterLink href='/' text='Пользовательское соглашение' />
					</div>
					<div className='flex flex-col gap-y-0.5 opacity-80 mt-2'>
						<FooterContactLink
							label='Техническая поддержка'
							email='support@email.example.com'
						/>
						<FooterContactLink
							label='Предложения о сотрудничестве'
							email='contact@email.example.com'
						/>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
