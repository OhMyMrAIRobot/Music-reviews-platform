import { FC, ReactNode } from 'react'

export interface IFooterSocialItemProps {
	href: string
	icon: ReactNode
}

const FooterSocialItem: FC<IFooterSocialItemProps> = ({ href, icon }) => {
	return (
		<a
			target='_blank'
			href={href}
			className='size-9 flex items-center justify-center bg-white/10 rounded-full hover:scale-110 transition-all duration-200'
		>
			{icon}
		</a>
	)
}

export default FooterSocialItem
