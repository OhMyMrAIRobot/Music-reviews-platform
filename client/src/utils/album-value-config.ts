import { AlbumValueTiersEnum } from '../models/album-value/album-value-tiers-enum'

interface IAlbumValueConfig {
	name: string
	image: string
	minPoints: number
	maxPoints: number
	borderColor: string
	gradient: string
}

export const ALBUM_VALUES: {
	tier: AlbumValueTiersEnum
	config: IAlbumValueConfig
}[] = [
	{
		tier: AlbumValueTiersEnum.SILVER,
		config: {
			name: 'Серебряный альбом',
			image: 'silver_album.gif',
			minPoints: 0,
			maxPoints: 5.99,
			borderColor: 'border-[#C2C5C9]/30',
			gradient: 'from-[#C0C0C0] to-[#C0C0C0]/0',
		},
	},
	{
		tier: AlbumValueTiersEnum.GOLD,
		config: {
			name: 'Золотой альбом',
			image: 'gold_album.gif',
			minPoints: 6,
			maxPoints: 11.99,
			borderColor: 'border-[#B79A6C]/30',
			gradient: 'from-[#FFD700] to-[#FFD700]/0',
		},
	},
	{
		tier: AlbumValueTiersEnum.EMERALD,
		config: {
			name: 'Изумрудный альбом',
			image: 'emerald_album.gif',
			minPoints: 12,
			maxPoints: 17.99,
			borderColor: 'border-[#407E6A]/30',
			gradient: 'from-[#0FAA77] to-[#0FAA77]/0',
		},
	},
	{
		tier: AlbumValueTiersEnum.SAPPHIRE,
		config: {
			name: 'Сапфировый альбом',
			image: 'sapphire_album.gif',
			minPoints: 18,
			maxPoints: 23.99,
			borderColor: 'border-[#575FB0]/30',
			gradient: 'from-[#5676ea] to-[#5676ea]/0',
		},
	},
	{
		tier: AlbumValueTiersEnum.RUBY,
		config: {
			name: 'Рубиновый альбом',
			image: 'ruby_album.gif',
			minPoints: 24,
			maxPoints: 31,
			borderColor: 'border-[#954545]/30',
			gradient: 'from-[#EA4343] to-[#EA4343]/0',
		},
	},
]

export function getAlbumValueTier(points: number): AlbumValueTiersEnum | null {
	for (let i = ALBUM_VALUES.length - 1; i >= 0; i--) {
		if (
			points >= ALBUM_VALUES[i].config.minPoints &&
			points <= ALBUM_VALUES[i].config.maxPoints
		) {
			return ALBUM_VALUES[i].tier
		}
	}
	return null
}

export function getAlbumValueTierConfig(
	tier: AlbumValueTiersEnum
): IAlbumValueConfig {
	const found = ALBUM_VALUES.find(l => l.tier === tier)
	if (!found) throw new Error('Invalid album value tier')
	return found.config
}
