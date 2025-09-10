import React, { FC, useEffect, useRef, useState } from 'react'

interface IProps {
	value: number
	onChange: (val: number) => void
	min?: number
	max?: number
	step?: number
	trackBeforeColor?: string
	trackAfterColor?: string
	thumbImage?: string
	showTicks?: boolean
	tickClassName?: string
}

const Slider: FC<IProps> = ({
	value,
	onChange,
	min = 1,
	max = 10,
	step = 1,
	trackBeforeColor,
	trackAfterColor,
	thumbImage = `${import.meta.env.VITE_SERVER_URL}/public/assets/rice.png`,
	showTicks = false,
	tickClassName = 'w-[1px] h-[10px] bg-white/30',
}) => {
	const sliderRef = useRef<HTMLDivElement>(null)
	const [sliderWidth, setSliderWidth] = useState(0)
	const isDragging = useRef(false)

	const thumbWidth = 18
	const range = max - min
	const safeRange = range <= 0 ? 1 : range

	const getDecimals = (n: number) => {
		if (!isFinite(n)) return 0
		const s = n.toString()
		if (s.includes('e-')) {
			const [, exp] = s.split('e-')
			return parseInt(exp || '0', 10)
		}
		return s.split('.')[1]?.length ?? 0
	}

	const decimals = Math.max(
		getDecimals(step),
		getDecimals(min),
		getDecimals(max)
	)

	const roundTo = (val: number, dec: number) => {
		const factor = Math.pow(10, dec)
		return Math.round(val * factor) / factor
	}

	const snapToStep = (val: number) => {
		const clamped = Math.min(Math.max(val, min), max)
		const stepsCount = Math.round((clamped - min) / step)
		const snapped = min + stepsCount * step
		const rounded = roundTo(snapped, decimals)
		return Math.min(Math.max(rounded, min), max)
	}

	const percent = range > 0 ? (value - min) / safeRange : 0
	const thumbLeft = percent * (sliderWidth - thumbWidth) - 4

	useEffect(() => {
		const updateSize = () => {
			if (sliderRef.current) {
				setSliderWidth(sliderRef.current.offsetWidth)
			}
		}
		updateSize()

		const resizeObserver = new ResizeObserver(updateSize)
		if (sliderRef.current) resizeObserver.observe(sliderRef.current)
		return () => resizeObserver.disconnect()
	}, [])

	const updateValueFromPosition = (clientX: number) => {
		if (!sliderRef.current || sliderWidth <= 0) return
		const rect = sliderRef.current.getBoundingClientRect()
		const offsetX = clientX - rect.left

		const clamped = Math.min(
			Math.max(offsetX, thumbWidth / 2),
			sliderWidth - thumbWidth / 2
		)

		const rawValue =
			min +
			((clamped - thumbWidth / 2) / (sliderWidth - thumbWidth)) * safeRange

		const newValue = snapToStep(rawValue)
		onChange(newValue)
	}

	const handleMouseDown = (e: React.MouseEvent) => {
		isDragging.current = true
		updateValueFromPosition(e.clientX)
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging.current) {
			updateValueFromPosition(e.clientX)
		}
	}

	const handleMouseUp = () => {
		isDragging.current = false
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
	}

	const handleClick = (e: React.MouseEvent) => {
		updateValueFromPosition(e.clientX)
	}

	const generateTicks = () => {
		const ticks: number[] = []
		if (!isFinite(step) || step <= 0 || !isFinite(min) || !isFinite(max)) {
			return ticks
		}
		const epsilon = 1 / Math.pow(10, decimals + 2)
		for (let i = 0; ; i++) {
			const v = roundTo(min + i * step, decimals)
			if (v > max + epsilon) break
			ticks.push(Math.min(v, max))
			if (v >= max - epsilon) break
		}
		return ticks
	}

	const ticks = showTicks ? generateTicks() : []

	return (
		<div
			ref={sliderRef}
			className='slider bg-white/10 h-[10px] flex-grow rounded-full cursor-grab relative select-none'
			onClick={handleClick}
		>
			{showTicks && (
				<div
					className='absolute inset-0 pointer-events-none'
					style={{ zIndex: 0 }}
				>
					{ticks.map(tick => {
						const p = range > 0 ? (tick - min) / safeRange : 0
						const x = p * (sliderWidth - thumbWidth) + thumbWidth / 2
						return (
							<div
								key={tick}
								className={`absolute top-3 ${tickClassName}`}
								style={{
									left: `${x - 0.5}px`,
								}}
								aria-hidden
							/>
						)
					})}
				</div>
			)}

			<div
				className={`left-0 h-full rounded-l-full absolute ${trackBeforeColor}`}
				style={{
					right: `${sliderWidth - thumbLeft - thumbWidth / 2 - 5}px`,
				}}
			/>

			<div
				className={`h-full rounded-full absolute right-0 ${trackAfterColor}`}
				style={{
					left: `${thumbLeft + thumbWidth / 2}px`,
				}}
			/>

			<div
				className='w-[18px] h-[25px] translate-x-[8px] translate-y-[-8px] outline-none cursor-grab absolute bg-center bg-cover bg-no-repeat z-1 touch-none'
				tabIndex={0}
				role='slider'
				aria-orientation='horizontal'
				aria-valuenow={value}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-disabled={false}
				aria-valuetext={String(value)}
				style={{
					left: `${thumbLeft}px`,
					backgroundImage: `url(${thumbImage})`,
					backgroundColor: 'transparent',
					borderRadius: 4,
				}}
				onMouseDown={handleMouseDown}
			/>
		</div>
	)
}

export default Slider
