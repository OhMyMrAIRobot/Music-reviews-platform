import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../hooks/use-navigation-path'
import { IReleaseAuthor } from '../../models/release/release-author'

interface IProps {
	authors: IReleaseAuthor[]
	className?: string
}

const ReleaseAuthors: FC<IProps> = ({ authors, className }) => {
	const { navigateToAuthorDetails } = useNavigationPath()

	return (
		<div className={`flex flex-wrap gap-x-1 items-center ${className}`}>
			{authors.map((author, index) => (
				<Link
					to={navigateToAuthorDetails(author.id)}
					key={author.name}
					className='flex'
				>
					<div className='opacity-50 hover:underline underline-offset-4 hover:opacity-90 transition-all duration-200 cursor-pointer'>
						{author.name}
					</div>

					<span className='opacity-50'>
						{index < authors.length - 1 && ', '}
					</span>
				</Link>
			))}
			{authors.length === 0 && (
				<span className='opacity-50'>Автор не указан!</span>
			)}
		</div>
	)
}

export default ReleaseAuthors
