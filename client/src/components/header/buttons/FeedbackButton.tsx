import { FeedbackSvgIcon } from '../../sidebar/SidebarIcons'

const FeedbackButton = () => {
	return (
		<div className='bg-primary rounded-md'>
			<button className='flex h-10 px-4 items-center justify-center rounded-md text-sm font-medium border border-white/20 cursor-pointer select-none transition-colors hover:bg-white/10!'>
				<FeedbackSvgIcon className='size-3' />
				<span className='hidden xl:block xl:ml-2'>Обратная связь</span>
			</button>
		</div>
	)
}

export default FeedbackButton
