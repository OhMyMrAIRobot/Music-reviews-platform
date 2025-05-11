import { FC } from 'react'

interface IProps {
	htmlfor: string
}

const SelectImageLabel: FC<IProps> = ({ htmlfor }) => {
	return (
		<label
			htmlFor={htmlfor}
			className='bg-white inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors h-10 px-4 py-2 text-sm cursor-pointer w-[250px] text-black hover:bg-white/85'
		>
			<svg
				stroke='currentColor'
				fill='currentColor'
				strokeWidth='0'
				viewBox='0 0 512 512'
				className='inline-block mr-2 size-4'
				height='1em'
				width='1em'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z'></path>
			</svg>
			<span>Выберите изображение</span>
		</label>
	)
}

export default SelectImageLabel
