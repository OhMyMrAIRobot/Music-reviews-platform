import { FC } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { IReleaseAuthor } from '../../models/release/release-author'

interface IProps {
	authors: IReleaseAuthor[]
	className?: string
}

const ReleaseAuthors: FC<IProps> = ({ authors, className }) => {
	const { navigateToAuthor } = useCustomNavigate()

	const navigateToAuthorPage = (
		id: string,
		e: React.MouseEvent<HTMLDivElement>
	) => {
		e.stopPropagation()
		navigateToAuthor(id)
	}

	return (
		<div className={`flex flex-wrap gap-1 leading-3 mt-2 ${className}`}>
			{authors.map((author, index) => (
				<div
					onClick={e => navigateToAuthorPage(author.id, e)}
					key={author.name}
					className='flex'
				>
					<div className='opacity-50 hover:underline hover:opacity-90 transition-all duration-200 cursor-pointer'>
						{author.name}
					</div>
					<span className='ml-[1px] pr-[3px] opacity-50'>
						{index < authors.length - 1 && ','}
					</span>
				</div>
			))}
		</div>
	)
}

export default ReleaseAuthors
