import { FC } from 'react'

interface PaginationProps {
	currentPage: number
	totalItems: number
	itemsPerPage: number
	onPageChange: (page: number) => void
	idToScroll: string
}

const Pagination: FC<PaginationProps> = ({
	currentPage,
	totalItems,
	itemsPerPage,
	onPageChange,
	idToScroll,
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage)

	const scrollToUp = () => {
		const element = document.getElementById(idToScroll) || document.body
		element.scrollIntoView({ behavior: 'smooth' })
	}

	const handlePrev = () => {
		if (currentPage > 1) {
			setTimeout(() => {
				scrollToUp()
			}, 100)

			onPageChange(currentPage - 1)
		}
	}

	const handleNext = () => {
		if (currentPage < totalPages) {
			setTimeout(() => {
				scrollToUp()
			}, 100)
			onPageChange(currentPage + 1)
		}
	}

	const getPageNumbers = () => {
		const pages: (number | string)[] = []

		pages.push(1)

		const start = Math.max(2, currentPage - 2)
		const end = Math.min(totalPages - 1, currentPage + 2)

		if (start > 2) {
			pages.push('...')
		}

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		if (end < totalPages - 1) {
			pages.push('...')
		}

		if (totalPages > 1) {
			pages.push(totalPages)
		}

		return pages
	}

	const pageNumbers = getPageNumbers()

	return (
		<div className='flex flex-wrap items-center justify-center gap-1 w-full'>
			<button
				onClick={handlePrev}
				hidden={currentPage === 1}
				className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-7 md:h-10  px-4 py-2 gap-1 hover:bg-white/10 transition-colors duration-300 cursor-pointer'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='h-4 w-4'
				>
					<path d='m15 18-6-6 6-6'></path>
				</svg>
				Предыдущая
			</button>

			{pageNumbers.map((page, idx) =>
				page === '...' ? (
					<span
						key={`dots-${idx}`}
						className='px-3 py-1 text-zinc-400 select-none'
					>
						...
					</span>
				) : (
					<button
						key={page}
						onClick={() => {
							setTimeout(() => {
								scrollToUp()
							}, 100)
							onPageChange(Number(page))
						}}
						className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium hover:bg-white/10 transition-colors duration-300 cursor-pointer size-7 lg:size-10 text-[12px] lg:text-sm  ${
							currentPage === page ? 'border border-white/20' : ''
						}`}
					>
						{page}
					</button>
				)
			)}

			<button
				onClick={handleNext}
				hidden={currentPage === totalPages}
				className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-7 md:h-10  px-4 py-2 gap-1 hover:bg-white/10 transition-colors duration-300 cursor-pointer'
			>
				Следующая
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='h-4 w-4'
				>
					<path d='m9 18 6-6-6-6'></path>
				</svg>
			</button>
		</div>
	)
}

export default Pagination
