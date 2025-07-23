import { FC } from 'react'
import useCustomNavigate from '../../hooks/use-custom-navigate'
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
		<div className={`flex flex-wrap gap-1 items-center ${className}`}>
			{authors.map((author, index) => (
				<div
					onClick={e => navigateToAuthorPage(author.id, e)}
					key={author.name}
					className='flex'
				>
					<div className='opacity-50 hover:underline underline-offset-4 hover:opacity-90 transition-all duration-200 cursor-pointer'>
						{author.name}
					</div>
					<span className='ml-[1px] pr-[3px] opacity-50'>
						{index < authors.length - 1 && ','}
					</span>
				</div>
			))}
			{authors.length === 0 && (
				<span className='opacity-50'>Автор не указан!</span>
			)}
		</div>
	)
}

export default ReleaseAuthors
