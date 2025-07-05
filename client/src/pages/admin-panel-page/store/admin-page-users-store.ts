import { makeAutoObservable, runInAction } from 'mobx'
import { UserAPI } from '../../../api/user-api'
import { IUser } from '../../../models/user/user'
import { IUsersResponse } from '../../../models/user/users-response'
import { SortOrder } from '../../../types/sort-order-type'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'

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

	deleteUser = async (id: string): Promise<TogglePromiseResult> => {
		try {
			await UserAPI.deleteUser(id)
			return { status: true, message: 'Пользователь успешно удалён!' }
		} catch (e) {
			console.log(e)
			return { status: false, message: 'Не удалось удалить пользователя!' }
		}
	}
}

export default new AdminPageUsersStore()
