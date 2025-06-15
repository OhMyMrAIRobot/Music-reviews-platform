import { FC } from 'react'
import { IRelease } from '../../../models/release/release'
import ReleasesColumnItem from './Releases-column-item'

interface IProps {
	title: string
	releases: IRelease[]
	isLoading: boolean
}

const ReleasesColumn: FC<IProps> = ({ title, releases, isLoading }) => {
	return (
		<div>
			<span className='inline-flex items-center px-2 py-1 rounded-lg bg-zinc-900 font-semibold text-sm '>
				{isLoading && 'Загрузка...'}
				{!isLoading && (releases.length === 0 ? `${title} не найдены!` : title)}
			</span>
			<div className='flex flex-col gap-y-1.5 lg:gap-y-3 mt-4'>
				{isLoading
					? Array.from({ length: 15 }).map((_, idx) => (
							<ReleasesColumnItem
								key={`releases-column-skeleton-${idx}`}
								isLoading={isLoading}
							/>
					  ))
					: releases.map(release => (
							<ReleasesColumnItem
								release={release}
								key={release.id}
								isLoading={isLoading}
							/>
					  ))}
			</div>
		</div>
	)
}

export default ReleasesColumn
