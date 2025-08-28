import { useEffect, useState } from 'react'
import AlbumValueCard from '../../components/album-value/Album-value-card'
import ComboBox from '../../components/buttons/Combo-box'
import FormCheckbox from '../../components/form-elements/Form-checkbox'
import FormLabel from '../../components/form-elements/Form-label'
import Pagination from '../../components/pagination/Pagination'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { AlbumValueSortOptions } from '../../models/album-value/album-value-sort-options'
import { AlbumValueTiersEnum } from '../../models/album-value/album-value-tiers-enum'
import { ALBUM_VALUES } from '../../utils/album-value-config'

const AlbumValuesPage = () => {
	const perPage = 12

	const { albumValuesPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		albumValuesPageStore.fetchAlbumValues
	)

	const [sortOrder, setSortOrder] = useState<string>('')
	const [selectedTiers, setSelectedTiers] = useState<AlbumValueTiersEnum[]>([])
	const [currentPage, setCurrentPage] = useState<number>(1)

	useEffect(() => {
		fetch(
			perPage,
			(currentPage - 1) * perPage,
			sortOrder !== '' ? sortOrder : null,
			selectedTiers.length > 0 ? selectedTiers : null
		)
	}, [fetch, selectedTiers, sortOrder, currentPage])

	const toggleTier = (tier: AlbumValueTiersEnum, nextChecked: boolean) => {
		setSelectedTiers(prev => {
			if (nextChecked) {
				return prev.includes(tier) ? prev : [...prev, tier]
			}
			return prev.filter(t => t !== tier)
		})
	}

	return (
		<>
			<h1
				id='album-values'
				className='text-lg md:text-xl lg:text-3xl font-semibold'
			>
				Ценность альбомов
			</h1>

			<div className='grid grid-cols-1 xl:grid-cols-4 gap-5 xl:gap-8 mt-10'>
				<div className='xl:col-span-1 rounded-lg border border-white/10 shadow-sm p-3 md:p-6 bg-zinc-900'>
					<div className='w-full h-10'>
						<ComboBox
							options={Object.values(AlbumValueSortOptions)}
							onChange={setSortOrder}
							value={sortOrder ? sortOrder : undefined}
							placeholder='Сортировать по'
						/>
					</div>

					<div className='mt-2'>
						<h3 className='font-bold text-white/40 mb-3 max-md:text-sm'>
							Фильтры
						</h3>
						<div className='space-y-2'>
							{ALBUM_VALUES.map(v => (
								<div className='flex items-center gap-2' key={v.tier}>
									<FormCheckbox
										id={`${v.tier}`}
										checked={selectedTiers.includes(v.tier)}
										setChecked={(value: boolean) => toggleTier(v.tier, value)}
									/>
									<FormLabel
										name={v.config.name}
										htmlFor={`${v.tier}`}
										isRequired={false}
									/>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='xl:col-span-3'>
					<div className='grid grid-cols-2 md:col-span-3 xl:grid-cols-4 gap-2 xl:gap-4'>
						{isLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AlbumValueCard
										key={`Skeleton-album-value-${idx}`}
										isLoading={true}
									/>
							  ))
							: albumValuesPageStore.values.map(albumValue => (
									<AlbumValueCard
										key={albumValue.release.id}
										isLoading={false}
										value={albumValue}
									/>
							  ))}
					</div>
					<div className='mt-10'>
						<Pagination
							currentPage={currentPage}
							totalItems={albumValuesPageStore.count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'album-values'}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default AlbumValuesPage
