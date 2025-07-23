import { FC } from 'react'
import ImageSvg from '../../../../components/svg/Image-svg'

interface IProps {
	htmlfor: string
}

const SelectImageLabel: FC<IProps> = ({ htmlfor }) => {
	return (
		<label
			htmlFor={htmlfor}
			className='bg-white inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background duration-200 transition-colors h-10 px-4 py-2 text-sm cursor-pointer w-full text-black hover:bg-white/85 select-none'
		>
			<ImageSvg className={'inline-block mr-2 size-4'} />
			<span>Выбрать изображение</span>
		</label>
	)
}

export default SelectImageLabel
