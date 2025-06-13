import { FC } from 'react'

export const TextReviewSvgIcon: FC<{ classname: string }> = ({ classname }) => (
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
		<path d='M7 7h10v2H7zm0 4h7v2H7z'></path>
		<path d='M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z'></path>
	</svg>
)

export const NoTextReviewSvgIcon: FC<{ classname: string }> = ({
	classname,
}) => (
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
		<path d='M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z'></path>
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
