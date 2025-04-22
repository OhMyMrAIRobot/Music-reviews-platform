import { FC } from 'react'
import FooterSocialItem, { IFooterSocialItemProps } from './FooterSocialItem'

interface IFooterSocialContainerProps {
	items: IFooterSocialItemProps[]
}

const FooterSocialContainer: FC<IFooterSocialContainerProps> = ({ items }) => {
	return (
		<div className='flex gap-3 flex-wrap items-center'>
			{items.map(item => (
				<FooterSocialItem key={item.id} {...item} />
			))}
		</div>
	)
}

export default FooterSocialContainer
