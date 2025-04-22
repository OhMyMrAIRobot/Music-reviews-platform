import { FC } from 'react'

export const TextReviewSvgIcon = () => (
	<svg
		stroke='currentColor'
		fill='currentColor'
		strokeWidth='0'
		viewBox='0 0 24 24'
		className='size-3'
		height='1em'
		width='1em'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path d='M7 7h10v2H7zm0 4h7v2H7z'></path>
		<path d='M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z'></path>
	</svg>
)

export const NoTextReviewSvgIcon = () => (
	<svg
		stroke='currentColor'
		fill='currentColor'
		strokeWidth='0'
		viewBox='0 0 24 24'
		className='size-3'
		height='1em'
		width='1em'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path d='M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z'></path>
	</svg>
)

export const AlbumSvgIcon: FC<{ classname: string }> = ({ classname }) => (
	<svg
		stroke='currentColor'
		fill='currentColor'
		strokeWidth='0'
		viewBox='0 0 24 24'
		className={classname}
		height='1em'
		width='1em'
		xmlns='http://www.w3.org/2000/svg'
	>
		<circle cx='11.99' cy='11.99' r='2.01'></circle>
		<path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z'></path>
		<path d='M12 6a6 6 0 0 0-6 6h2a4 4 0 0 1 4-4z'></path>
	</svg>
)

export const SingleSvgIcon: FC<{ classname: string }> = ({ classname }) => (
	<svg
		stroke='currentColor'
		fill='currentColor'
		strokeWidth='0'
		viewBox='0 0 512 512'
		className={classname}
		height='1em'
		width='1em'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path d='M406.3 48.2c-4.7.9-202 39.2-206.2 40-4.2.8-8.1 3.6-8.1 8v240.1c0 1.6-.1 7.2-2.4 11.7-3.1 5.9-8.5 10.2-16.1 12.7-3.3 1.1-7.8 2.1-13.1 3.3-24.1 5.4-64.4 14.6-64.4 51.8 0 31.1 22.4 45.1 41.7 47.5 2.1.3 4.5.7 7.1.7 6.7 0 36-3.3 51.2-13.2 11-7.2 24.1-21.4 24.1-47.8V190.5c0-3.8 2.7-7.1 6.4-7.8l152-30.7c5-1 9.6 2.8 9.6 7.8v130.9c0 4.1-.2 8.9-2.5 13.4-3.1 5.9-8.5 10.2-16.2 12.7-3.3 1.1-8.8 2.1-14.1 3.3-24.1 5.4-64.4 14.5-64.4 51.7 0 33.7 25.4 47.2 41.8 48.3 6.5.4 11.2.3 19.4-.9s23.5-5.5 36.5-13c17.9-10.3 27.5-26.8 27.5-48.2V55.9c-.1-4.4-3.8-8.9-9.8-7.7z'></path>
	</svg>
)

export const PrevSvgIcon = () => (
	<svg
		stroke='currentColor'
		fill='currentColor'
		strokeWidth='0'
		viewBox='0 0 512 512'
		height='1em'
		width='1em'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path d='M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z'></path>
	</svg>
)

export const NextSvgIcon = () => (
	<svg
		stroke='currentColor'
		fill='currentColor'
		strokeWidth='0'
		viewBox='0 0 512 512'
		height='1em'
		width='1em'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path d='M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z'></path>
	</svg>
)
