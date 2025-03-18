const FeedbackButton = () => {
	const SvgIcon = () => (
		<svg
			stroke='currentColor'
			fill='currentColor'
			strokeWidth='0'
			viewBox='0 0 512 512'
			className='size-3'
			height='1em'
			width='1em'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path d='M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z'></path>
		</svg>
	)

	return (
		<button className='flex h-10 px-4 items-center justify-center rounded-md text-sm font-medium border border-white/20 hover:bg-white/10 cursor-pointer select-none transition-colors'>
			<SvgIcon />
			<span className='hidden xl:block xl:ml-2'>Обратная связь</span>
		</button>
	)
}

export default FeedbackButton
