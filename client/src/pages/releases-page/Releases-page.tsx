import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { ReleaseAPI } from '../../api/release/release-api'
import ComboBox from '../../components/buttons/Combo-box'
import ReleasesGrid from '../../components/release/Releases-grid'
import SkeletonLoader from '../../components/utils/Skeleton-loader'
import { useReleaseMeta } from '../../hooks/use-release-meta'
import { ReleaseSortFieldValuesEnum } from '../../models/release/release-sort/release-sort-field-values'
import { ReleaseSortFields } from '../../models/release/release-sort/release-sort-fields'
import { ReleaseTypesFilterOptions } from '../../models/release/release-type/release-types-filter-options'
import { SortOrdersEnum } from '../../models/sort/sort-orders-enum'
import { releasesKeys } from '../../query-keys/releases-keys'
import { SortOrder } from '../../types/sort-order-type'

const PER_PAGE = 12

const ReleasesPage = () => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseSortFields.PUBLISHED_NEW
	)
	const [selectedType, setSelectedType] = useState<string>(
		ReleaseTypesFilterOptions.ALL
	)

	const { types: releaseTypes, isLoading: isTypesLoading } = useReleaseMeta()

	const selectedTypeId = useMemo(() => {
		if (selectedType === ReleaseTypesFilterOptions.ALL) return null
		const type = releaseTypes.find(t => t.type === selectedType)
		return type ? type.id : null
	}, [releaseTypes, selectedType])

	const { sortField, sortOrder } = useMemo(() => {
		let field = '' as ReleaseSortFieldValuesEnum
		let order: SortOrder = SortOrdersEnum.DESC
		switch (selectedSort) {
			case ReleaseSortFields.WITHOUT_TEXT_COUNT:
				field = ReleaseSortFieldValuesEnum.WITHOUT_TEXT_COUNT
				order = SortOrdersEnum.DESC
				break
			case ReleaseSortFields.TEXT_COUNT:
				field = ReleaseSortFieldValuesEnum.TEXT_COUNT
				order = SortOrdersEnum.DESC
				break
			case ReleaseSortFields.PUBLISHED_NEW:
				field = ReleaseSortFieldValuesEnum.PUBLISHED
				order = SortOrdersEnum.DESC
				break
			case ReleaseSortFields.PUBLISHED_OLD:
				field = ReleaseSortFieldValuesEnum.PUBLISHED
				order = SortOrdersEnum.ASC
				break
			case ReleaseSortFields.MEDIA_RATING:
				field = ReleaseSortFieldValuesEnum.MEDIA_RATING
				order = SortOrdersEnum.DESC
				break
			case ReleaseSortFields.WITH_TEXT_RATING:
				field = ReleaseSortFieldValuesEnum.WITH_TEXT_RATING
				order = SortOrdersEnum.DESC
				break
			case ReleaseSortFields.NO_TEXT_RATING:
				field = ReleaseSortFieldValuesEnum.WITHOUT_TEXT_RATING
				order = SortOrdersEnum.DESC
				break
			default:
				field = ReleaseSortFieldValuesEnum.PUBLISHED
				order = SortOrdersEnum.DESC
		}
		return { sortField: field, sortOrder: order }
	}, [selectedSort])

	useEffect(() => {
		setCurrentPage(1)
	}, [selectedType])

	const limit = PER_PAGE
	const offset = (currentPage - 1) * PER_PAGE

	const queryKey = releasesKeys.list({
		typeId: selectedTypeId,
		sortField,
		sortOrder,
		limit,
		offset,
	})

	const { data, isPending: isReleasesLoading } = useQuery({
		queryKey,
		queryFn: () =>
			ReleaseAPI.fetchReleases(
				selectedTypeId,
				null,
				sortField,
				sortOrder,
				limit,
				offset
			),
		staleTime: 1000 * 60 * 5,
		enabled: Boolean(releaseTypes),
	})

	const items = data?.releases ?? []
	const total = data?.count ?? 0

	return (
		<>
			<h1 id='releases' className='text-2xl lg:text-3xl font-semibold'>
				Добавленные релизы
			</h1>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 grid md:flex gap-x-4 items-center'>
				<span className='text-sm md:text-base text-white/70 font-bold max-md:pb-1'>
					Тип релиза:
				</span>
				<div className='w-full sm:w-55 h-10'>
					{!isTypesLoading && releaseTypes.length > 0 ? (
						<ComboBox
							options={Object.values(ReleaseTypesFilterOptions)}
							onChange={setSelectedType}
							className='border border-white/10'
							value={selectedType}
						/>
					) : (
						<SkeletonLoader className='size-full rounded-md' />
					)}
				</div>

				<span className='text-sm md:text-base text-white/70 font-bold max-md:mt-4 max-md:pb-1'>
					Сортировать по:
				</span>
				<div className='w-full sm:w-82 h-10'>
					<ComboBox
						options={Object.values(ReleaseSortFields)}
						onChange={setSelectedSort}
						className='border border-white/10'
						value={selectedSort}
					/>
				</div>
			</div>

			<ReleasesGrid
				items={items}
				isLoading={isReleasesLoading}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				total={total}
				perPage={PER_PAGE}
			/>
		</>
	)
}

export default ReleasesPage
