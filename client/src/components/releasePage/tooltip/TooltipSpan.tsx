import { FC, ReactNode, useState } from 'react'

interface ITooltipSpanProps {
	children: ReactNode
	tooltip: ReactNode
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
			<div
				className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 rounded transition-all duration-300 ${
					show ? 'opacity-100 visible' : 'opacity-0 invisible'
				}`}
			>
				{tooltip}
			</div>
		</span>
	)
}

export default TooltipSpan
