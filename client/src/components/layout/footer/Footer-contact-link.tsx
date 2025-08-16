import { FC } from 'react'

interface IProps {
	label: string
	email: string
}

const FooterContactLink: FC<IProps> = ({ label, email }) => {
	return (
		<div className='text-white/90'>
			<span className='pr-1'>{label}:</span>
			<a
				className='border-b border-white/30 hover:border-white/70 hover:text-white transition-all duration-200'
				href={`mailto:${email}`}
			>
				{email}
			</a>
		</div>
	)
}

export default FooterContactLink
