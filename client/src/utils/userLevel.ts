import { UserLevelsEnum } from '../models/profile/userLevels'

interface LevelConfig {
	name: string
	image: string
	minPoints: number
}

export const LEVELS: { level: UserLevelsEnum; config: LevelConfig }[] = [
	{
		level: UserLevelsEnum.Silver,
		config: {
			name: 'Серебряный уровень',
			image: 'silver.png',
			minPoints: 3000,
		},
	},
	{
		level: UserLevelsEnum.Gold,
		config: {
			name: 'Золотой уровень',
			image: 'gold.png',
			minPoints: 15000,
		},
	},
	{
		level: UserLevelsEnum.Emerald,
		config: {
			name: 'Изумрудный уровень',
			image: 'emerald.png',
			minPoints: 60000,
		},
	},
	{
		level: UserLevelsEnum.Sapphire,
		config: {
			name: 'Сапфировый уровень',
			image: 'sapphire.png',
			minPoints: 150000,
		},
	},
	{
		level: UserLevelsEnum.Ruby,
		config: {
			name: 'Рубиновый уровень',
			image: 'ruby.png',
			minPoints: 300000,
		},
	},
]

export function getUserLevel(points: number): UserLevelsEnum | null {
	for (let i = LEVELS.length - 1; i >= 0; i--) {
		if (points >= LEVELS[i].config.minPoints) {
			return LEVELS[i].level
		}
	}
	return null
}

export function getLevelConfig(level: UserLevelsEnum): LevelConfig {
	const found = LEVELS.find(l => l.level === level)
	if (!found) throw new Error('Invalid user level')
	return found.config
}
