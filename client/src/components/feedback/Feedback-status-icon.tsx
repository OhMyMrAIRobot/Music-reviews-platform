import { FC } from 'react'
import { FeedbackStatusesEnum } from '../../models/feedback/feedback-statuses-enum'
import MessageChatSvg from './svg/Message-chat-svg'
import MessageCircleSvg from './svg/Message-circle-svg'
import MessageTickSvg from './svg/Message-tick-svg'

interface IProps {
	status: string
	className: string
}

const FeedbackStatusIcon: FC<IProps> = ({ status, className }) => {
	switch (status) {
		case FeedbackStatusesEnum.NEW:
			return <MessageCircleSvg className={className} />
		case FeedbackStatusesEnum.READ:
			return <MessageTickSvg className={className} />
		case FeedbackStatusesEnum.ANSWERED:
			return <MessageChatSvg className={className} />
		default:
			return null
	}
}

export default FeedbackStatusIcon
