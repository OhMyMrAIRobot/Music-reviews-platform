import { FC } from 'react'

interface IFooterContactLinkProps {
	label: string
	email: string
}

const FooterContactLink: FC<IFooterContactLinkProps> = ({ label, email }) => {
	return (
		<div>
			<span className='pr-1'>{label}:</span>
			<a className='border-b border-white/30' href={`mailto:${email}`}>
				contact@email.example.com
			</a>
		</div>
	)
}

export default FooterContactLink
