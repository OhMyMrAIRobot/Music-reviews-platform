import { FC } from 'react'

interface IAuthSubTitle {
	title: string
	className?: string
}

const AuthSubTitle: FC<IAuthSubTitle> = ({ title, className }) => {
	return (
		<h6 className={`text-sm text-white/50 select-none ${className}`}>
			{title}
		</h6>
	)
}

export default AuthSubTitle
