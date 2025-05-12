import { FC } from 'react'
import SocialIcon from './SocialIcon'

interface IProps {
	href: string
	name: string
}

const SocialItem: FC<IProps> = ({ href, name }) => {
	return (
		<button className='select-none inline-flex items-center justify-center text-sm font-medium transition-colors duration-200 px-4 py-2 size-10 rounded-xl text-white bg-zinc-800 hover:bg-zinc-800/50 cursor-pointer'>
			<a target='_blank' href={href}>
				<SocialIcon name={name} />
			</a>
		</button>
	)
}

export default SocialItem
