import { FC } from 'react'

interface IFormTitleProps {
	title: string
	className?: string
}

const FormTitle: FC<IFormTitleProps> = ({ title, className }) => {
	return (
		<h2 className={`text-2xl font-bold select-none ${className}`}>{title}</h2>
	)
}

export default FormTitle
