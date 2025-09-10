enum UserLevelsEnum {
	Silver = 'silver',
	Gold = 'gold',
	Emerald = 'emerald',
	Sapphire = 'sapphire',
	Ruby = 'ruby',
}

interface ILevelConfig {
	name: string
	image: string
	minPoints: number
	color: string
}

export const USER_LEVELS: { level: UserLevelsEnum; config: ILevelConfig }[] = [
	{
		level: UserLevelsEnum.Silver,
		config: {
			name: 'Серебряный уровень',
			image: 'silver.png',
			minPoints: 3000,
			color: 'border-gray-400 bg-gray-600',
		},
	},
	{
		level: UserLevelsEnum.Gold,
		config: {
			name: 'Золотой уровень',
			image: 'gold.png',
			minPoints: 15000,
			color: 'border-yellow-500 bg-yellow-700',
		},
	},
	{
		level: UserLevelsEnum.Emerald,
		config: {
			name: 'Изумрудный уровень',
			image: 'emerald.png',
			minPoints: 60000,
			color: 'border-green-400 bg-green-600',
		},
	},
	{
		level: UserLevelsEnum.Sapphire,
		config: {
			name: 'Сапфировый уровень',
			image: 'sapphire.png',
			minPoints: 150000,
			color: 'border-blue-600 bg-blue-800',
		},
	},
	{
		level: UserLevelsEnum.Ruby,
		config: {
			name: 'Рубиновый уровень',
			image: 'ruby.png',
			minPoints: 300000,
			color: 'border-red-600 bg-red-800',
		},
	},
]

export function getUserLevel(points: number): UserLevelsEnum | null {
	for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
		if (points >= USER_LEVELS[i].config.minPoints) {
			return USER_LEVELS[i].level
		}
	}
	return null
}

export function getLevelConfig(level: UserLevelsEnum): ILevelConfig {
	const found = USER_LEVELS.find(l => l.level === level)
	if (!found) throw new Error('Invalid user level')
	return found.config
}
