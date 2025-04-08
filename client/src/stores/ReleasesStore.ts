/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { IRelease } from '../models/release/Release'
import { IReleaseDetails } from '../models/release/ReleaseDetails'

class ReleasesStore {
	constructor() {
		makeAutoObservable(this)
	}

	topReleases: IRelease[] = []
	lastReleases: IRelease[] = []
	releaseDetails: IReleaseDetails | undefined = undefined

	setTopReleases(data: IRelease[]) {
		this.topReleases = data
	}

	setLastReleases(data: IRelease[]) {
		this.lastReleases = data
	}

	setReviewDetails(data: IReleaseDetails | undefined) {
		this.releaseDetails = data
	}

	fetchTopReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchTopReleases()
			this.setTopReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchLastReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchReleases()
			this.setLastReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReleaseDetails = async (id: string) => {
		try {
			const data = await ReleaseAPI.fetchReleaseDetails(id)
			this.setReviewDetails(data.pop())
		} catch (e) {
			console.log(e)
		}
	}

	addReleaseToFav = async (
		releaseId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReleaseAPI.addReleaseToFav(releaseId)

			const alreadyLiked = this.releaseDetails?.user_like_ids.some(
				entry => entry.user_id === data.userId
			)

			if (!alreadyLiked) {
				runInAction(() => {
					if (this.releaseDetails) {
						this.releaseDetails?.user_like_ids.push({ user_id: data.userId })
						this.releaseDetails.likes_count += 1
					}
				})
			}

			return {
				status: true,
				message: 'Вы отметили релиз как понравившейся!',
			}
		} catch (e: any) {
			console.log(e)
			return {
				status: false,
				message: 'Не удалось отметь релиз как понравившейся!',
			}
		}
	}

	deleteReleaseFromFav = async (
		releaseId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReleaseAPI.deleteReleaseFromFav(releaseId)
			if (this.releaseDetails) {
				const index = this.releaseDetails.user_like_ids.findIndex(
					entry => entry.user_id === data.userId
				)

				if (index !== -1) {
					runInAction(() => {
						if (this.releaseDetails) {
							this.releaseDetails?.user_like_ids.splice(index, 1)
							this.releaseDetails.likes_count -= 1
						}
					})
				}
			}
			return {
				status: true,
				message: 'Вы убрали релиз из списка понравившихся!',
			}
		} catch (e: any) {
			console.log(e)
			return {
				status: false,
				message: 'Не удалось убрать релиз из списка понравившихся!',
			}
		}
	}
}

export default new ReleasesStore()
