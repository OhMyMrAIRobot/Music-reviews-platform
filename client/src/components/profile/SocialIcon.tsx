import { SocialMediaEnum } from '../../models/profile/social-media-enum'
import {
	TelegramSvgIcon,
	TwitchSvgIcon,
	VKSvgIcon,
	YoutubeSvgIcon,
} from './SocialSvgItems'

const SocialIcon = ({ name }: { name: string }) => {
	switch (name) {
		case SocialMediaEnum.TELEGRAM:
			return <TelegramSvgIcon />
		case SocialMediaEnum.TWITCH:
			return <TwitchSvgIcon />
		case SocialMediaEnum.VK:
			return <VKSvgIcon />
		case SocialMediaEnum.YOUTUBE:
			return <YoutubeSvgIcon />
		default:
			return null
	}
}

export default SocialIcon
