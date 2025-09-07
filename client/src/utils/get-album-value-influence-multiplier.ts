export const getAlbumValueInfluenceMultiplier = (val: number): number => {
	switch (val) {
		case 1:
			return 1.12
		case 2:
			return 1.34
		case 3:
			return 1.5
		case 4:
			return 1.62
		case 5:
			return 1.72
		case 6:
			return 1.81
		case 7:
			return 1.88
		case 8:
			return 1.94
		case 9:
			return 2.0
		default:
			return 1.12
	}
}
