import { FC } from 'react'

interface IProps {
	text: string
	onClick: () => void
}

const FooterLink: FC<IProps> = ({ text, onClick }) => {
	return (
		<button
			onClick={onClick}
			className='border-b border-white/30 hover:border-white/70 text-white/90 hover:text-white transition-all duration-200 cursor-pointer'
		>
			{text}
		</button>
	)
}

export default FooterLink
