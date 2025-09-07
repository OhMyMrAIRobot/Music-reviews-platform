const getDecimals = (n: number) => {
	const s = n.toString()
	if (s.includes('e-')) return parseInt(s.split('e-')[1] || '0', 10)
	return s.split('.')[1]?.length ?? 0
}

export function makeStepLabeler(
	labels: string[],
	min: number,
	step: number,
	max?: number
) {
	const decimals = Math.max(
		getDecimals(min),
		getDecimals(step),
		getDecimals(max ?? min)
	)
	return (value: number) => {
		const v = Number(value.toFixed(decimals))
		const idx = Math.round((v - min) / step)
		return labels[idx] ?? ''
	}
}
