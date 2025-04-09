import { FC } from 'react'

interface IProps {
	nickname: string
	position: number | null
}

const ReviewTitle: FC<IProps> = ({ nickname, position }) => {
	return (
		<div className='flex flex-col gap-1 justify-center'>
			<button className='text-sm lg:text-lg font-semibold block items-center max-w-35 text-ellipsis overflow-hidden whitespace-nowrap'>
				{nickname}
			</button>
			{position && (
				<span className='ml-1 text-center w-fit text-[12px] rounded-full font-bold bg-red-500 text-white px-1.5 shadow-lg shadow-red-600/50'>
					ТОП-{position}
				</span>
			)}
		</div>
	)
}

export default ReviewTitle
