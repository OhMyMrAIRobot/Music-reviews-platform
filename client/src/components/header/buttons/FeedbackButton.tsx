import { FeedbackSvgIcon } from '../../sidebar/SidebarIcons'

const FeedbackButton = () => {
	return (
		<button className='flex h-10 px-4 items-center justify-center rounded-md text-sm font-medium border border-white/20 hover:bg-white/10 cursor-pointer select-none transition-colors'>
			<FeedbackSvgIcon className='size-3' />
			<span className='hidden xl:block xl:ml-2'>Обратная связь</span>
		</button>
	)
}

export default FeedbackButton
