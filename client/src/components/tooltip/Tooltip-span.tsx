import { FC, ReactNode, useState } from 'react'

interface IProps {
	children: ReactNode
	tooltip: ReactNode
	spanClassName: string
	centered?: boolean
}

const TooltipSpan: FC<IProps> = ({
	children,
	tooltip,
	spanClassName,
	centered = true,
}) => {
	const [show, setShow] = useState(false)

	return (
		<span
			className={spanClassName}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
		>
			{children}
			<div
				className={`absolute z-2000 bg-zinc-950 bottom-full mb-0.5 rounded-xl transition-all duration-300 ${
					show ? 'opacity-100 visible' : 'opacity-0 invisible'
				} ${centered ? 'left-1/2 -translate-x-1/2' : 'right-0 translate-x-0'}`}
			>
				{tooltip}
			</div>
		</span>
	)
}

export default TooltipSpan
