export const formatNumber = (points: number) => {
	if (points >= 1000000000) {
		const value = points / 1000000000
		return value % 1 === 0 ? value + 'B' : value.toFixed(1) + 'B'
	} else if (points >= 1000000) {
		const value = points / 1000000
		return value % 1 === 0 ? value + 'M' : value.toFixed(1) + 'M'
	} else if (points >= 1000) {
		const value = points / 1000
		return value % 1 === 0 ? value + 'k' : value.toFixed(1) + 'k'
	} else {
		return points.toString()
	}
}
