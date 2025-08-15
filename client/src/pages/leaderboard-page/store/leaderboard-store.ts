import { makeAutoObservable } from 'mobx'
import { LeaderboardAPI } from '../../../api/leaderboard-api'
import { ILeaderboardItem } from '../../../models/leaderboard/leaderboard-item'

class LeaderboardStore {
	constructor() {
		makeAutoObservable(this)
	}

	items: ILeaderboardItem[] = []

	setItems(data: ILeaderboardItem[]) {
		this.items = data
	}

	fetchLeaderboard = async () => {
		try {
			const data = await LeaderboardAPI.fetchLeaderboard(null, null)
			this.setItems(data)
		} catch {
			this.setItems([])
		}
	}
}

export default new LeaderboardStore()
