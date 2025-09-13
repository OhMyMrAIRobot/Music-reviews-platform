import { useEffect, useState } from 'react'
import ComboBox from '../../components/buttons/Combo-box'
import ReleasesGrid from '../../components/release/Releases-grid'
import SkeletonLoader from '../../components/utils/Skeleton-loader'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { ReleaseSortFieldValuesEnum } from '../../models/release/release-sort/release-sort-field-values'
import { ReleaseSortFields } from '../../models/release/release-sort/release-sort-fields'
import { SortOrder } from '../../types/sort-order-type'

const ReleasesPage = () => {
	const perPage = 12

	const { releasesPageStore, metaStore } = useStore()

	const [currentPage, setCurrentPage] = useState<number>(1)

	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseSortFields.PUBLISHED_NEW
	)
	const [selectedType, setSelectedType] = useState<string>('Все')

	const { execute: fetchReleases, isLoading: isReleasesLoading } = useLoading(
		releasesPageStore.fetchReleases
	)

	const { execute: fetchReleaseTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchReleaseTypes
	)

	useEffect(() => {
		if (metaStore.releaseTypes.length === 0) {
			fetchReleaseTypes()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const type = metaStore.releaseTypes.find(
			entry => entry.type === selectedType
		)

		let field = ''
		let order: SortOrder = 'desc'

		switch (selectedSort) {
			case ReleaseSortFields.WITHOUT_TEXT_COUNT:
				field = ReleaseSortFieldValuesEnum.WITHOUT_TEXT_COUNT
				order = 'desc'
				break
			case ReleaseSortFields.TEXT_COUNT:
				field = ReleaseSortFieldValuesEnum.TEXT_COUNT
				order = 'desc'
				break
			case ReleaseSortFields.PUBLISHED_NEW:
				field = ReleaseSortFieldValuesEnum.PUBLISHED
				order = 'desc'
				break
			case ReleaseSortFields.PUBLISHED_OLD:
				field = ReleaseSortFieldValuesEnum.PUBLISHED
				order = 'asc'
				break
			case ReleaseSortFields.MEDIA_RATING:
				field = ReleaseSortFieldValuesEnum.MEDIA_RATING
				order = 'desc'
				break
			case ReleaseSortFields.WITH_TEXT_RATING:
				field = ReleaseSortFieldValuesEnum.WITH_TEXT_RATING
				order = 'desc'
				break
			case ReleaseSortFields.NO_TEXT_RATING:
				field = ReleaseSortFieldValuesEnum.WITHOUT_TEXT_RATING
				order = 'desc'
				break
		}

		fetchReleases(
			type?.id ?? null,
			field,
			order,
			perPage,
			(currentPage - 1) * perPage
		)
	}, [
		selectedType,
		selectedSort,
		currentPage,
		metaStore.releaseTypes,
		fetchReleases,
	])

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
					{!isTypesLoading && metaStore.releaseTypes.length > 0 ? (
						<ComboBox
							options={[
								'Все',
								...metaStore.releaseTypes.map(entry => entry.type),
							]}
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
				items={releasesPageStore.releases}
				isLoading={isReleasesLoading}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				total={releasesPageStore.releasesCount}
				perPage={perPage}
			/>
		</>
	)
}

export default ReleasesPage
