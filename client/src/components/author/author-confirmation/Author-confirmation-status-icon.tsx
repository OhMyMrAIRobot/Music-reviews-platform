import { FC } from 'react'
import { AuthorConfirmationStatusesEnum } from '../../../models/author/author-confirmation/author-confirmation-statuses-enum'
import HourglassSvg from '../../svg/Hourglass-svg'
import RejectSvg from '../../svg/Reject-svg'
import TickRoundedSvg from '../../svg/Tick-rounded-svg'

interface IProps {
	status: string
	className: string
}

const AuthorConfirmationStatusIcon: FC<IProps> = ({ status, className }) => {
	switch (status) {
		case AuthorConfirmationStatusesEnum.PENDING:
			return <HourglassSvg className={className} />
		case AuthorConfirmationStatusesEnum.REJECTED:
			return <RejectSvg className={className} />
		case AuthorConfirmationStatusesEnum.APPROVED:
			return <TickRoundedSvg className={className} />
	}
}

export default AuthorConfirmationStatusIcon
