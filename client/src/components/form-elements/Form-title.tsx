import { FC } from 'react'

interface IProps {
	title: string
	className?: string
}

const FormTitle: FC<IProps> = ({ title, className }) => {
	return (
		<h2 className={`text-2xl font-bold select-none ${className}`}>{title}</h2>
	)
}

export default FormTitle
