import { FC, ReactNode, useState } from 'react'

interface ITooltipSpanProps {
	children: ReactNode
	tooltip: ReactNode
	spanClassName: string
	centered?: boolean
}

const TooltipSpan: FC<ITooltipSpanProps> = ({
	children,
	tooltip,
	spanClassName,
	centered = true,
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
				className={`absolute z-2000 bottom-full left-1/${
					centered ? '2' : '1'
				} -translate-x-1/${
					centered ? '2' : '1'
				} mb-0.5 rounded transition-all duration-300 ${
					show ? 'opacity-100 visible' : 'opacity-0 invisible'
				}`}
			>
				{tooltip}
			</div>
		</span>
	)
}

export default TooltipSpan
