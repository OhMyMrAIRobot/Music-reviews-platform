import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import {
	getAlbumValueTier,
	getAlbumValueTierConfig,
} from '../../../../utils/album-value-config'
import ReleaseDetailsAlbumValueRow from './Release-details-album-value-row'
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section'

interface IProps {
	releaseId: string
}

const ReleaseDetailsAlbumValue: FC<IProps> = observer(({ releaseId }) => {
	const { releaseDetailsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		releaseDetailsPageStore.fetchAlbumValue
	)

	useEffect(() => {
		fetch(releaseId)
	}, [fetch, releaseId])

	if (isLoading)
		return <SkeletonLoader className={'w-full h-65 mt-5 rounded-xl'} />

	if (!releaseDetailsPageStore.albumValue) {
		return null
	}

	const level = getAlbumValueTier(releaseDetailsPageStore.albumValue.totalValue)

	if (!level) return null

	const config = getAlbumValueTierConfig(level)

	const value = releaseDetailsPageStore.albumValue

	return (
		<div
			className={`bg-zinc-900 shadow-sm mt-5 flex items-center border p-2.5 lg:p-3 rounded-xl relative overflow-hidden ${config.borderColor}`}
		>
			<div
				className={`absolute inset-0 opacity-20 bg-gradient-to-br pointer-events-none ${config.gradientColor}`}
			/>

			<div className='relative flex flex-col lg:flex-row items-start gap-2 w-full'>
				<div
					className={`shrink-0 max-lg:w-full border ${config.borderColor} h-[110px] flex items-center gap-3 rounded-[12px] py-3 pl-1.5 lg:pl-3 pr-3 lg:pr-5 relative overflow-hidden bg-gradient-to-br ${config.dimGradientColor}`}
				>
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
							config.image
						}`}
						className={`size-[70px] lg:size-[80px]`}
					/>
					<div>
						<span className='block lg:text-lg font-bold mb-0 lg:mb-2 lg:-mt-1'>
							{config.name}
						</span>
						<span className='block font-bold text-xl lg:text-[32px] leading-[28px]'>
							{value.totalValue}
						</span>
					</div>
				</div>

				<div className='w-full text-left text-sm grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-2 gap-y-2 shrink-1 justify-center'>
					<ReleaseDetailsAlbumValueSection>
						<ReleaseDetailsAlbumValueRow
							title={'Редкость'}
							value={value.rarity.total.toString()}
							maxValue={'5'}
							isSectionTitle={true}
						/>
						<ReleaseDetailsAlbumValueRow
							title={'Редкость жанра'}
							value={value.rarity.rarityGenre.toString()}
							maxValue={'2.5'}
							isSectionTitle={false}
						/>
						<ReleaseDetailsAlbumValueRow
							title={'Редкость формата исполнения'}
							value={value.rarity.rarityPerformance.toString()}
							maxValue={'2.5'}
							isSectionTitle={false}
						/>
					</ReleaseDetailsAlbumValueSection>

					<ReleaseDetailsAlbumValueSection>
						<ReleaseDetailsAlbumValueRow
							title={'Целостность'}
							value={value.integrity.total.toString()}
							maxValue={'5'}
							isSectionTitle={true}
						/>
						<ReleaseDetailsAlbumValueRow
							title={'Формат релиза'}
							value={value.integrity.formatRelease.toString()}
							maxValue={'1'}
							isSectionTitle={false}
						/>
						<ReleaseDetailsAlbumValueRow
							title={'Жанровая целостность'}
							value={value.integrity.integrityGenre.toString()}
							maxValue={'2.5'}
							isSectionTitle={false}
						/>
						<ReleaseDetailsAlbumValueRow
							title={'Смысловая целостность'}
							value={value.integrity.integritySemantic.toString()}
							maxValue={'1.5'}
							isSectionTitle={false}
						/>
					</ReleaseDetailsAlbumValueSection>

					<div className='flex flex-col gap-2 items-stretch justify-stretch'>
						<ReleaseDetailsAlbumValueSection>
							<ReleaseDetailsAlbumValueRow
								title={'Глубина'}
								value={value.depth.toString()}
								maxValue={'5'}
								isSectionTitle={true}
							/>
						</ReleaseDetailsAlbumValueSection>

						<ReleaseDetailsAlbumValueSection>
							<ReleaseDetailsAlbumValueRow
								title={'Качество'}
								value={`${value.quality.factor * 100} %`}
								isSectionTitle={true}
							/>
							<ReleaseDetailsAlbumValueRow
								title={'Баллы в базе'}
								value={value.quality.total.toString()}
								maxValue={'40'}
								isSectionTitle={false}
							/>
						</ReleaseDetailsAlbumValueSection>
					</div>

					<ReleaseDetailsAlbumValueSection>
						<ReleaseDetailsAlbumValueRow
							title={'Влияние'}
							value={value.influence.total.toString()}
							maxValue={'9'}
							isSectionTitle={true}
						/>
						<ReleaseDetailsAlbumValueRow
							title={'Известность автора'}
							value={value.influence.authorPopularity.toString()}
							maxValue={'4.5'}
							isSectionTitle={false}
						/>
						<ReleaseDetailsAlbumValueRow
							title={'Ожидание релиза'}
							value={value.influence.releaseAnticip.toString()}
							maxValue={'4.5'}
							isSectionTitle={false}
						/>
					</ReleaseDetailsAlbumValueSection>
				</div>
			</div>
		</div>
	)
})

export default ReleaseDetailsAlbumValue
