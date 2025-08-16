import { FC } from 'react'
import { ReleaseMediaStatusesEnum } from '../../../models/release/release-media/release-media-status/release-media-statuses-enum'
import HourglassSvg from '../../svg/Hourglass-svg'
import RejectSvg from '../../svg/Reject-svg'
import TickRoundedSvg from '../../svg/Tick-rounded-svg'

interface IProps {
	status: string
	className: string
}

const ReleaseMediaStatusIcon: FC<IProps> = ({ status, className }) => {
	switch (status) {
		case ReleaseMediaStatusesEnum.PENDING:
			return <HourglassSvg className={className} />
		case ReleaseMediaStatusesEnum.REJECTED:
			return <RejectSvg className={className} />
		case ReleaseMediaStatusesEnum.APPROVED:
			return <TickRoundedSvg className={className} />
	}
}

export default ReleaseMediaStatusIcon
