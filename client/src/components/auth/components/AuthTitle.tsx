import { FC } from 'react'

interface IAuthTitleProps {
	title: string
	className?: string
}

const AuthTitle: FC<IAuthTitleProps> = ({ title, className }) => {
	return (
		<h2 className={`text-2xl font-bold select-none ${className}`}>{title}</h2>
	)
}

export default AuthTitle
