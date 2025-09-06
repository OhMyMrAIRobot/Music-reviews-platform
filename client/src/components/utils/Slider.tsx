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
}

const Slider: FC<IProps> = ({
	value,
	onChange,
	min = 1,
	max = 10,
	step = 1,
	trackBeforeColor,
	trackAfterColor,
	thumbImage,
}) => {
	const sliderRef = useRef<HTMLDivElement>(null)
	const [sliderWidth, setSliderWidth] = useState(0)
	const isDragging = useRef(false)

	const thumbWidth = 18
	const range = max - min
	const safeRange = range <= 0 ? 1 : range

	const getStepDecimals = (n: number) => {
		const s = n.toString()
		if (s.includes('e-')) {
			const [, exp] = s.split('e-')
			return parseInt(exp || '0', 10)
		}
		const dec = s.split('.')[1]?.length ?? 0
		return dec
	}

	const stepDecimals = getStepDecimals(step)

	const snapToStep = (val: number) => {
		const clamped = Math.min(Math.max(val, min), max)
		const steps = Math.round((clamped - min) / step)
		const snapped = min + steps * step
		return parseFloat(snapped.toFixed(stepDecimals))
	}

	const percent = range > 0 ? (value - min) / safeRange : 0
	const thumbLeft = percent * (sliderWidth - thumbWidth)

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

	const handleKeyDown = (e: React.KeyboardEvent) => {
		let next = value
		const bigStep = step * 10

		switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				next = snapToStep(value - step)
				e.preventDefault()
				break
			case 'ArrowRight':
			case 'ArrowUp':
				next = snapToStep(value + step)
				e.preventDefault()
				break
			case 'PageDown':
				next = snapToStep(value - bigStep)
				e.preventDefault()
				break
			case 'PageUp':
				next = snapToStep(value + bigStep)
				e.preventDefault()
				break
			case 'Home':
				next = snapToStep(min)
				e.preventDefault()
				break
			case 'End':
				next = snapToStep(max)
				e.preventDefault()
				break
			default:
				break
		}

		if (next !== value) onChange(next)
	}

	return (
		<div
			ref={sliderRef}
			className='slider bg-white/10 h-[10px] flex-grow rounded-full cursor-grab relative select-none'
			onClick={handleClick}
		>
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
				onKeyDown={handleKeyDown}
			/>
		</div>
	)
}

export default Slider
