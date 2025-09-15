/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useQueryListFavToggle<
	TItem extends Record<'id', string>,
	TData extends Record<string, any>
>(
	queryKey: QueryKey,
	listKey: keyof TData,
	toggleFn: (cloned: TItem[], id: string, isFav: boolean) => Promise<any>
) {
	const queryClient = useQueryClient()

	const storeToggle = async (id: string, isFav: boolean): Promise<any> => {
		const current = queryClient.getQueryData<TData>(queryKey)
		const list = (current?.[listKey] as TItem[]) ?? []
		const cloned = list.map(item => ({ ...item })) as TItem[]
		const result = await toggleFn(cloned, id, isFav)
		queryClient.setQueryData<TData>(queryKey, {
			...(current ?? ({} as TData)),
			[listKey]: cloned,
		} as TData)
		return result
	}

	return { storeToggle }
}

export function useQueryListFavToggleAll<
	TItem extends Record<'id', string>,
	TData extends Record<string, any>
>(
	rootKey: QueryKey,
	listKey: keyof TData,
	toggleFn: (cloned: TItem[], id: string, isFav: boolean) => Promise<any>
) {
	const queryClient = useQueryClient()

	const storeToggle = async (id: string, isFav: boolean): Promise<any> => {
		const queries = queryClient.getQueriesData<TData>({ queryKey: rootKey })
		if (queries.length === 0) return []

		let primaryIndex = -1
		for (let i = 0; i < queries.length; i++) {
			const [, data] = queries[i]
			const list = (data?.[listKey] as TItem[]) ?? []
			if (list.some(item => item.id === id)) {
				primaryIndex = i
				break
			}
		}

		if (primaryIndex === -1) primaryIndex = 0

		const [primaryKey, primaryData] = queries[primaryIndex]
		const primaryList = ((primaryData?.[listKey] as TItem[]) ?? []).map(i => ({
			...i,
		}))
		const result = await toggleFn(primaryList, id, isFav)
		const updatedItem = primaryList.find(i => i.id === id)

		queryClient.setQueryData<TData>(primaryKey, {
			...(primaryData ?? ({} as TData)),
			[listKey]: primaryList,
		} as TData)

		queries.forEach(([key, data], idx) => {
			if (idx === primaryIndex) return
			const list = (data?.[listKey] as TItem[]) ?? []
			if (list.length === 0) return
			let nextList: TItem[] = []
			if (updatedItem) {
				nextList = list.map(item =>
					item.id === id ? { ...item, ...updatedItem } : item
				)
			}

			queryClient.setQueryData<TData>(key, {
				...(data ?? ({} as TData)),
				[listKey]: nextList,
			} as TData)
		})

		return result
	}

	return { storeToggle }
}
