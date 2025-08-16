import useNavigationPath from '../../../hooks/use-navigation-path'
import TelegramSvg from '../../svg/Telegram-svg'
import TwitchSvg from '../../svg/Twitch-svg'
import VkSvg from '../../svg/Vk-svg'
import YouTubeSvg from '../../svg/YouTube-svg'
import FooterContactLink from './Footer-contact-link'
import FooterLink from './Footer-link'
import FooterSocialContainer from './Footer-social-container'
import { IFooterSocialItemProps } from './Footer-social-item'

const footerSocials: IFooterSocialItemProps[] = [
	{
		href: '/',
		icon: <TelegramSvg className={'size-4'} />,
	},
	{
		href: '/',
		icon: <YouTubeSvg className={'size-4'} />,
	},
	{
		href: '/',
		icon: <TwitchSvg className={'size-4'} />,
	},
	{
		href: '/',
		icon: <VkSvg className={'size-4'} />,
	},
]

const Footer = () => {
	const { navigateToFeedback } = useNavigationPath()

	return (
		<footer className='2xl:container p-5 lg:py-10 mt-auto lg:w-full lg:mr-0 mr-auto'>
			<div className='grid lg:grid-cols-2 items-center gap-4'>
				<FooterSocialContainer items={footerSocials} />

				<div className='text-xs lg:text-right lg:text-sm'>
					<h6 className='opacity-50'>«Some application title» © 2025</h6>

					<div className='flex flex-col gap-y-0.5 opacity-80 items-start lg:items-end mt-2'>
						<FooterLink text='Обратная связь' href={navigateToFeedback} />
						<FooterLink
							text='Политика обработки персональных данных'
							href={'#'}
						/>
						<FooterLink text='Пользовательское соглашение' href={'#'} />
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
