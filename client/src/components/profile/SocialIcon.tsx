import { SocialMediaEnum } from '../../models/profile/social-media-enum'
import TelegramSvg from '../svg/Telegram-svg'
import TwitchSvg from '../svg/Twitch-svg'
import VkSvg from '../svg/Vk-svg'
import YouTubeSvg from '../svg/YouTube-svg'

const SocialIcon = ({ name }: { name: string }) => {
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

export default SocialIcon
