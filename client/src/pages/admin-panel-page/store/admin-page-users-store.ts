import { makeAutoObservable, runInAction } from 'mobx'
import { UserAPI } from '../../../api/user-api'
import { IUser } from '../../../models/user/user'
import { IUsersResponse } from '../../../models/user/users-response'
import { SortOrder } from '../../../types/sort-order-type'

class AdminPageUsersStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	users: IUser[] = []

	setUsers(data: IUsersResponse) {
		runInAction(() => {
			this.count = data.total
			this.users = data.users
		})
	}

	fetchUsers = async (
		query: string | null,
		role: string | null,
		order: SortOrder | null,
		limit: number,
		offset: number
	) => {
		try {
			const data = await UserAPI.fetchUsers(query, role, order, limit, offset)
			this.setUsers(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new AdminPageUsersStore()
