import { FC } from 'react'
import NoTextReviewSvg from '../../../../../components/review/svg/No-text-review-svg'
import TextReviewSvg from '../../../../../components/review/svg/Text-review-svg'
import PixelHeartFillSvg from '../../../../../components/svg/Pixel-heart-fill-svg'
import PixelHeartSvg from '../../../../../components/svg/Pixel-heart-svg'
import useCustomNavigate from '../../../../../hooks/use-custom-navigate'
import { IProfile } from '../../../../../models/profile/profile'
import { getLevelConfig, getUserLevel } from '../../../../../utils/user-level'
import ProfileStatsRow from './Profile-stats-row'

interface IProps {
	profile: IProfile
}

const ProfileStats: FC<IProps> = ({ profile }) => {
	const level = getUserLevel(profile.points)

	const { navigateToLeaderboard } = useCustomNavigate()

	return (
		<div className='border border-white/10 shadow-sm p-5 bg-zinc-900 flex flex-col rounded-2xl gap-2'>
			<div
				className={`border border-white/10 p-2.5 w-full rounded-lg flex space-x-2.5 ${
					level ? '' : 'justify-center'
				}`}
			>
				{level && (
					<img
						loading='lazy'
						decoding='async'
						alt={'level'}
						src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
							getLevelConfig(level).image
						}`}
						className='size-18 select-none'
					/>
				)}

				<div
					className={`flex flex-col gap-y-1.5 ${level ? '' : 'items-center'}`}
				>
					{level && (
						<div className='text-base font-bold flex items-center space-x-1.5'>
							<div>{getLevelConfig(level).name}</div>
						</div>
					)}

					<div className='flex items-center space-x-2 select-none'>
						<div
							className={`px-2 h-[21px] flex items-center leading-3 font-semibold rounded-full text-[13px] ${
								level
									? getLevelConfig(level).color
									: 'bg-white/10 border-white/20'
							}`}
						>
							{profile.points}
						</div>
						<p className='text-[13px] font-medium'>баллов сообщества</p>
					</div>

					{profile.position ? (
						<div className='flex items-center space-x-2 select-none'>
							<div className='min-w-max shadow-lg shadow-red-600/50 px-1.5 h-[21px] leading-[19px] font-bold border border-red-500  rounded-full bg-red-600 text-[13px]'>
								ТОП {profile.position}
							</div>

							<p className='text-[13px] text-white/90 hover:text-white transition-all duration-200 underline underline-offset-4 hover:border-white cursor-pointer font-medium'>
								<span onClick={navigateToLeaderboard}>в ТОП-90</span>
							</p>
						</div>
					) : (
						<div className='text-[13px] underline underline-offset-4 text-white/90 hover:text-white duration-200 transition-all cursor-pointer'>
							<span onClick={navigateToLeaderboard}>
								Таблица ТОП-90 по баллам сообщества
							</span>
						</div>
					)}
				</div>
			</div>
			<div>
				<ProfileStatsRow
					title={'Рецензий'}
					value={profile.text_count}
					icon={<TextReviewSvg className={'size-5'} />}
				/>
				<ProfileStatsRow
					title={'Оценок без рецензий'}
					value={profile.no_text_count}
					icon={<NoTextReviewSvg className={'size-5'} />}
				/>
			</div>

			<div
				data-orientation='horizontal'
				className='shrink-0 bg-white/10 h-[1px] w-full'
			></div>

			<div>
				<ProfileStatsRow
					title={'Получено лайков'}
					value={profile.received_likes}
					icon={<PixelHeartSvg className={'size-[19px]'} />}
				/>
				<ProfileStatsRow
					title={'Поставлено лайков'}
					value={profile.given_likes}
					icon={<PixelHeartFillSvg className={'size-[19px]'} />}
				/>
			</div>
		</div>
	)
}

export default ProfileStats
