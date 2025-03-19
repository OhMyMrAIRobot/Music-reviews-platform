import { FC } from 'react'

interface IFooterLinkProps {
	href: string
	text: string
}

const FooterLink: FC<IFooterLinkProps> = ({ href, text }) => {
	return (
		<a target='_blank' className='border-b border-white/30' href={href}>
			{text}
		</a>
	)
}

export default FooterLink
