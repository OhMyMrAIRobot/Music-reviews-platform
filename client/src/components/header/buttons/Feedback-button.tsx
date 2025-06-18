import useCustomNavigate from '../../../hooks/use-custom-navigate'
import PencilSvg from '../../svg/Pencil-svg'

const FeedbackButton = () => {
	const { navigateToFeedback } = useCustomNavigate()

	return (
		<button
			className='flex h-10 px-4 items-center justify-center rounded-md text-sm font-medium border border-white/15 cursor-pointer select-none transition-colors duration-200 hover:bg-white/15'
			onClick={navigateToFeedback}
		>
			<PencilSvg className='size-3' />
			<span className='hidden xl:block xl:ml-2'>Обратная связь</span>
		</button>
	)
}

export default FeedbackButton
