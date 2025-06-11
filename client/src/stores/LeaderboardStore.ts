import { makeAutoObservable } from 'mobx'
import { LeaderboardAPI } from '../api/leaderboard-api'
import { ILeaderboardItem } from '../model/leaderboard/leaderboard-item'

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
			const data = await LeaderboardAPI.fetchLeaderboard()
			this.setItems(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new LeaderboardStore()
