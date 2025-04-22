import React, { FC, useEffect, useRef, useState } from 'react'

interface ISliderProps {
	value: number
	onChange: (val: number) => void
	min?: number
	max?: number
	trackBeforeColor?: string
	trackAfterColor?: string
	thumbImage?: string
}

const Slider: FC<ISliderProps> = ({
	value,
	onChange,
	min = 1,
	max = 10,
	trackBeforeColor,
	trackAfterColor,
	thumbImage,
}) => {
	const sliderRef = useRef<HTMLDivElement>(null)
	const [sliderWidth, setSliderWidth] = useState(0)
	const isDragging = useRef(false)

	const thumbWidth = 18
	const range = max - min
	const percent = (value - min) / range
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
		if (!sliderRef.current) return
		const rect = sliderRef.current.getBoundingClientRect()
		const offsetX = clientX - rect.left

		const clamped = Math.min(
			Math.max(offsetX, thumbWidth / 2),
			sliderWidth - thumbWidth / 2
		)

		const newValue = Math.round(
			min + ((clamped - thumbWidth / 2) / (sliderWidth - thumbWidth)) * range
		)
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

	return (
		<div
			ref={sliderRef}
			className='slider bg-white/10 h-[10px] flex-grow rounded-full cursor-grab relative select-none'
			onClick={handleClick}
		>
			<div
				className={`slider-track left-0 h-full rounded-l-full absolute ${trackBeforeColor}`}
				style={{
					right: `${sliderWidth - thumbLeft - thumbWidth / 2 - 5}px`,
				}}
			/>

			<div
				className={`slider-track h-full rounded-full absolute right-0 ${trackAfterColor}`}
				style={{
					left: `${thumbLeft + thumbWidth / 2}px`,
				}}
			/>

			<div
				className='slider-thumb w-[18px] h-[25px] translate-x-[8px] translate-y-[-8px] outline-none cursor-grab absolute bg-center bg-cover bg-no-repeat z-1 touch-none'
				tabIndex={0}
				role='slider'
				aria-orientation='horizontal'
				aria-valuenow={value}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-disabled={false}
				style={{
					left: `${thumbLeft}px`,
					backgroundImage: thumbImage ? `url(${thumbImage})` : undefined,
					backgroundColor: thumbImage ? 'transparent' : 'white',
					borderRadius: 4,
				}}
				onMouseDown={handleMouseDown}
			/>
		</div>
	)
}

export default Slider
