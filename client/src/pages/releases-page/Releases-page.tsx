import { useEffect, useState } from 'react'
import ComboBox from '../../components/buttons/Combo-box'
import Loader from '../../components/Loader'
import ReleasesGrid from '../../components/release/Releases-grid'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { ReleaseSortFields } from '../../models/release/release-sort-fields'

const ReleasesPage = () => {
	const perPage = 12

	const { releasesStore } = useStore()

	const [currentPage, setCurrentPage] = useState<number>(1)

	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseSortFields.PUBLISHED_NEW
	)
	const [selectedType, setSelectedType] = useState<string>('Все')

	const { execute: fetchReleases, isLoading: isReleasesLoading } = useLoading(
		releasesStore.fetchReleases
	)

	const { execute: fetchReleaseTypes, isLoading: isTypesLoading } = useLoading(
		releasesStore.fetchReleaseTypes
	)

	useEffect(() => {
		fetchReleaseTypes()
	}, [fetchReleaseTypes])

	useEffect(() => {
		const type = releasesStore.releaseTypes.find(
			entry => entry.type === selectedType
		)

		let field = ''
		let order = ''

		switch (selectedSort) {
			case ReleaseSortFields.NO_TEXT_COUNT:
				field = 'noTextCount'
				order = 'desc'
				break
			case ReleaseSortFields.TEXT_COUNT:
				field = 'textCount'
				order = 'desc'
				break
			case ReleaseSortFields.PUBLISHED_NEW:
				field = 'published'
				order = 'desc'
				break
			case ReleaseSortFields.PUBLISHED_OLD:
				field = 'published'
				order = 'asc'
				break
			case ReleaseSortFields.SUPER_USER_RATING:
				field = 'superUserRating'
				order = 'desc'
				break
			case ReleaseSortFields.WITH_TEXT_RATING:
				field = 'superUserRating'
				order = 'desc'
				break
			case ReleaseSortFields.NO_TEXT_RATING:
				field = 'superUserRating'
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
		releasesStore.releaseTypes,
		fetchReleases,
	])

	return (
		<>
			<h1
				id='releases'
				className='text-lg md:text-xl lg:text-3xl font-semibold'
			>
				Добавленные релизы
			</h1>
			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 flex gap-4 items-center'>
				<span className='hidden sm:block text-white/70 font-bold '>
					Тип релизов:
				</span>
				<div className='w-full sm:w-55'>
					{!isTypesLoading && releasesStore.releaseTypes.length > 0 ? (
						<ComboBox
							options={[
								'Все',
								...releasesStore.releaseTypes.map(entry => entry.type),
							]}
							onChange={setSelectedType}
							className='border border-white/10'
							value={selectedType}
						/>
					) : (
						<Loader size={'size-5'} />
					)}
				</div>

				<span className='hidden sm:block text-white/70 font-bold '>
					Сортировать по:
				</span>
				<div className='w-full sm:w-82'>
					<ComboBox
						options={Object.values(ReleaseSortFields)}
						onChange={setSelectedSort}
						className='border border-white/10'
						value={selectedSort}
					/>
				</div>
			</div>

			<ReleasesGrid
				items={releasesStore.releases}
				isLoading={isReleasesLoading}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				total={releasesStore.releasesCount}
				perPage={perPage}
			/>
		</>
	)
}

export default ReleasesPage
