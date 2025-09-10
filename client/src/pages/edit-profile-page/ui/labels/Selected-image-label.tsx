import { FC } from 'react'

interface IProps {
	file: File | null
	className?: string
}

const SelectedImageLabel: FC<IProps> = ({ file, className }) => {
	return (
		<span
			className={`block text-sm font-medium text-nowrap select-none truncate ${
				file ? 'text-green-500/80' : 'text-red-500/80'
			} ${className}`}
		>
			{file ? `Выбранное изображение: ${file.name}` : `Изображение не выбрано!`}
		</span>
	)
}

export default SelectedImageLabel
