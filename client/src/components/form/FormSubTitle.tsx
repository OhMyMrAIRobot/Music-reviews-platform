import { FC } from 'react'

interface IFormSubTitleProps {
	title: string
	className?: string
}

const FormSubTitle: FC<IFormSubTitleProps> = ({ title, className }) => {
	return (
		<h6 className={`text-sm text-white/50 select-none ${className}`}>
			{title}
		</h6>
	)
}

export default FormSubTitle
