import { useEffect, useState } from 'react'
import LastReleasesCarouselItem from '../components/carousel/lastReleases/LastReleasesCarouselItem'
import ComboBox from '../components/header/buttons/ComboBox'
import Loader from '../components/Loader'
import Pagination from '../components/pagination/Pagination'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

const ReleaseSortFields = Object.freeze({
	PUBLISHED_New: 'Дата релиза (новые)',
	PUBLISHED_OLD: 'Дата релиза (старые)',
	NO_TEXT_COUNT: 'Количество оценок без рецензий',
	TEXT_COUNT: 'Количество рецензий',
	SUPER_USER_RATING: 'Рейтинг супер-пользователей (90 - 0)',
	WITH_TEXT_RATING: 'Рейтинг пользователей (90 - 0)',
	NO_TEXT_RATING: 'Рейтинг без рецензий (90 - 0)',
})

const ReleasesPage = () => {
	const { releasesStore } = useStore()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSort, setSelectedSort] = useState<string>(
		ReleaseSortFields.PUBLISHED_New
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
	}, [])

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
			case ReleaseSortFields.PUBLISHED_New:
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

		fetchReleases(type?.id ?? null, field, order, 5, (currentPage - 1) * 5)
	}, [selectedType, selectedSort, currentPage])

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
						<Loader size={10} />
					)}
				</div>

				<span className='hidden sm:block text-white/70 font-bold '>
					Сортировать по:
				</span>
				<div className='w-full sm:w-78'>
					<ComboBox
						options={Object.values(ReleaseSortFields)}
						onChange={setSelectedSort}
						className='border border-white/10'
						value={selectedSort}
					/>
				</div>
			</div>

			<section className='mt-5 overflow-hidden'>
				{!isReleasesLoading ? (
					releasesStore.releases.length > 0 ? (
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xl:gap-5'>
							{releasesStore.releases.map(release => (
								<div className='p-2' key={release.id}>
									<LastReleasesCarouselItem release={release} />
								</div>
							))}
						</div>
					) : (
						<p className='text-center text-2xl font-semibold mt-30'>
							Релизы не найдены!
						</p>
					)
				) : (
					<div className='mt-30'>
						<Loader size={20} />
					</div>
				)}
			</section>

			{releasesStore.releases.length > 0 && (
				<div className='mt-50'>
					<Pagination
						currentPage={currentPage}
						totalItems={releasesStore.releasesCount}
						itemsPerPage={5}
						onPageChange={setCurrentPage}
						idToScroll={'releases'}
					/>
				</div>
			)}
		</>
	)
}

export default ReleasesPage
