import { FC, MouseEvent } from 'react'
import { Link, LinkProps } from 'react-router'

interface IProps extends LinkProps {
	prevent?: boolean
}

const PreventableLink: FC<IProps> = ({
	to,
	prevent = false,
	children,
	onClick,
	...props
}) => {
	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (prevent) {
			e.preventDefault()
		}
		onClick?.(e)
	}

	return (
		<Link
			to={prevent ? '#' : to}
			onClick={handleClick}
			aria-disabled={prevent}
			{...props}
		>
			{children}
		</Link>
	)
}

export default PreventableLink
