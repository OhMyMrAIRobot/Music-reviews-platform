import { FC } from 'react'
import { Link } from 'react-router'

interface IProps {
	text: string
	href: string
}

const FooterLink: FC<IProps> = ({ text, href }) => {
	return (
		<Link
			to={href}
			className='border-b border-white/30 hover:border-white/70 text-white/90 hover:text-white transition-all duration-200 cursor-pointer'
		>
			{text}
		</Link>
	)
}

export default FooterLink
