import { FC } from 'react'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { IProfile } from '../../models/profile/profile'
import { getLevelConfig, getUserLevel } from '../../utils/user-level'
import NoTextReviewSvg from '../review/svg/No-text-review-svg'
import TextReviewSvg from '../review/svg/Text-review-svg'
import HeartFillSvg from '../svg/Heart-fill-svg'
import HeartSvg from '../svg/Heart-svg'
import ProfileInfoRow from './ProfileInfoRow'

interface IProps {
	profile: IProfile
}

const ProfileStats: FC<IProps> = ({ profile }) => {
	const { navigateToLeaderboard } = useCustomNavigate()
	const level = getUserLevel(profile.points)
	return (
		<div className='border border-white/10 shadow-sm p-5 bg-zinc-900 flex flex-col rounded-2xl gap-2'>
			<div
				className={`border border-white/10 p-2.5 w-full rounded-lg flex space-x-2.5 ${
					level ? '' : 'justify-center'
				}`}
			>
				{level && (
					<img
						alt={'level'}
						src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
							getLevelConfig(level).image
						}`}
						width={38}
						height={38}
						className='size-18'
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
					<div className='flex items-center space-x-2'>
						<div
							className={`px-2 h-[21px] flex items-center leading-3 font-semibold rounded-full text-[13px] ${
								level
									? getLevelConfig(level).color
									: 'bg-white/10 border-white/20'
							}`}
						>
							{profile.points}
						</div>
						<div className='text-[13px] font-medium'>баллов сообщества</div>
					</div>
					{profile.position ? (
						<div className='flex items-center space-x-2'>
							<div className='min-w-max shadow-lg shadow-red-600/50 px-1.5 h-[21px] leading-[19px] font-bold border border-red-500  rounded-full bg-red-600 text-[13px]'>
								ТОП {profile.position}
							</div>
							<div className='text-[13px] border-b border-white/30 hover:border-white cursor-pointer'>
								<span onClick={navigateToLeaderboard}>в ТОП-90</span>
							</div>
						</div>
					) : (
						<div className='text-[13px] border-b border-white/30 hover:border-white cursor-pointer'>
							<span onClick={navigateToLeaderboard}>
								Таблица ТОП-90 по баллам сообщества
							</span>
						</div>
					)}
				</div>
			</div>
			<div>
				<ProfileInfoRow
					title={'Рецензий'}
					value={profile.text_count}
					icon={<TextReviewSvg className={'size-5'} />}
				/>
				<ProfileInfoRow
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
				<ProfileInfoRow
					title={'Получено лайков'}
					value={profile.received_likes}
					icon={<HeartSvg className={'size-[19px]'} />}
				/>
				<ProfileInfoRow
					title={'Поставлено лайков'}
					value={profile.given_likes}
					icon={<HeartFillSvg className={'size-[19px]'} />}
				/>
			</div>
		</div>
	)
}

export default ProfileStats
