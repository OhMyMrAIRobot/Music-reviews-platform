import { FC, ReactNode } from 'react'

interface IProps {
	children: ReactNode
}

const ReleaseDetailsAlbumValueSection: FC<IProps> = ({ children }) => {
	return (
		<div className='space-y-1 bg-black/10 border border-white/10 rounded-lg px-3 py-1.5'>
			{children}
		</div>
	)
}

export default ReleaseDetailsAlbumValueSection
