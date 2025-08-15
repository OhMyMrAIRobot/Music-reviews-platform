export interface ILeaderboardItem {
	userId: string
	rank: number
	points: number
	nickname: string
	avatar: string
	cover: string
	textCount: number
	withoutTextCount: number
	receivedLikes: number
	givenLikes: number
	receivedAuthorLikes: number
	topAuthorLikers: {
		count: number
		userId: string
		nickname: string
		avatar: string
	}[]
}
