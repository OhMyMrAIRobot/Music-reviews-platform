/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useQueryListFavToggleAll<
	TItem extends Record<'id', string>,
	TData extends Record<string, any>
>(
	rootKey: QueryKey,
	listKey: keyof TData | null,
	toggleFn:
		| ((cloned: TItem[], id: string, isFav: boolean) => Promise<any>)
		| ((item: TItem, id: string, isFav: boolean) => Promise<any>)
) {
	const queryClient = useQueryClient()

	const storeToggle = async (id: string, isFav: boolean): Promise<any> => {
		const queries = queryClient.getQueriesData<TData>({ queryKey: rootKey })
		if (queries.length === 0) return []

		let primaryIndex = -1

		if (listKey) {
			for (let i = 0; i < queries.length; i++) {
				const [, data] = queries[i]
				const list = (data?.[listKey] as TItem[]) ?? []
				if (Array.isArray(list) && list.some(item => item.id === id)) {
					primaryIndex = i
					break
				}
			}
		} else {
			for (let i = 0; i < queries.length; i++) {
				const [, data] = queries[i]
				if (
					data &&
					typeof data === 'object' &&
					'id' in data &&
					data.id === id
				) {
					primaryIndex = i
					break
				}
			}
		}

		if (primaryIndex === -1) primaryIndex = 0

		const [primaryKey, primaryData] = queries[primaryIndex]

		let result: any

		if (listKey) {
			const primaryList = ((primaryData?.[listKey] as TItem[]) ?? []).map(
				i => ({
					...i,
				})
			)

			if (toggleFn.length === 3) {
				result = await (
					toggleFn as (
						cloned: TItem[],
						id: string,
						isFav: boolean
					) => Promise<any>
				)(primaryList, id, isFav)
			} else {
				const targetItem = primaryList.find(i => i.id === id)
				if (targetItem) {
					result = await (
						toggleFn as (
							item: TItem,
							id: string,
							isFav: boolean
						) => Promise<any>
					)(targetItem, id, isFav)
				}
			}

			const updatedItem = primaryList.find(i => i.id === id)

			queryClient.setQueryData<TData>(primaryKey, {
				...(primaryData ?? ({} as TData)),
				[listKey]: primaryList,
			} as TData)

			queries.forEach(([key, data], idx) => {
				if (idx === primaryIndex) return
				const list = (data?.[listKey] as TItem[]) ?? []
				if (!Array.isArray(list) || list.length === 0) return

				const nextList = list.map(item =>
					item.id === id && updatedItem ? { ...item, ...updatedItem } : item
				)

				queryClient.setQueryData<TData>(key, {
					...(data ?? ({} as TData)),
					[listKey]: nextList,
				} as TData)
			})
		} else {
			const clonedItem = { ...(primaryData as unknown as TItem) }

			result = await (
				toggleFn as (item: TItem, id: string, isFav: boolean) => Promise<any>
			)(clonedItem, id, isFav)

			queryClient.setQueryData<TData>(
				primaryKey,
				clonedItem as unknown as TData
			)

			queries.forEach(([key, data], idx) => {
				if (idx === primaryIndex) return
				if (
					data &&
					typeof data === 'object' &&
					'id' in data &&
					data.id === id
				) {
					queryClient.setQueryData<TData>(key, {
						...data,
						...clonedItem,
					} as TData)
				}
			})
		}

		return result
	}

	return { storeToggle }
}
