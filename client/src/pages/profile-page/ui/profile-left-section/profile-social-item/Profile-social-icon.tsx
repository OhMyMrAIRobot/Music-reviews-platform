import { FC } from 'react'
import TelegramSvg from '../../../../../components/svg/Telegram-svg'
import TwitchSvg from '../../../../../components/svg/Twitch-svg'
import VkSvg from '../../../../../components/svg/Vk-svg'
import YouTubeSvg from '../../../../../components/svg/YouTube-svg'
import { SocialMediaEnum } from '../../../../../models/profile/social-media-enum'

interface IProps {
	name: string
}

const ProfileSocialIcon: FC<IProps> = ({ name }) => {
	switch (name) {
		case SocialMediaEnum.TELEGRAM:
			return <TelegramSvg className={'size-5'} />
		case SocialMediaEnum.TWITCH:
			return <TwitchSvg className={'size-5'} />
		case SocialMediaEnum.VK:
			return <VkSvg className={'size-5'} />
		case SocialMediaEnum.YOUTUBE:
			return <YouTubeSvg className={'size-5'} />
		default:
			return null
	}
}

export default ProfileSocialIcon
