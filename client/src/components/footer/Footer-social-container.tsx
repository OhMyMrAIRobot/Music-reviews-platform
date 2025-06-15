import { FC } from 'react'
import FooterSocialItem, { IFooterSocialItemProps } from './Footer-social-item'

interface IProps {
	items: IFooterSocialItemProps[]
}

const FooterSocialContainer: FC<IProps> = ({ items }) => {
	return (
		<div className='flex gap-3 flex-wrap items-center'>
			{items.map(item => (
				<FooterSocialItem key={item.href} {...item} />
			))}
		</div>
	)
}

export default FooterSocialContainer
