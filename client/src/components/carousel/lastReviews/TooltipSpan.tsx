import { FC, ReactNode, useState } from 'react'

interface ITooltipSpanProps {
	children: ReactNode
	tooltip: string
	spanClassName: string
}

const TooltipSpan: FC<ITooltipSpanProps> = ({
	children,
	tooltip,
	spanClassName,
}) => {
	const [show, setShow] = useState(false)

	return (
		<span
			className='relative inline-block'
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
		>
			<span className={spanClassName}>{children}</span>
			{show && (
				<div
					className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-primary border-2 border-gray-600 rounded-full text-white text-xs font-extrabold px-2 py-1 shadow z-10 whitespace-nowrap`}
				>
					{tooltip}
				</div>
			)}
		</span>
	)
}

export default TooltipSpan
