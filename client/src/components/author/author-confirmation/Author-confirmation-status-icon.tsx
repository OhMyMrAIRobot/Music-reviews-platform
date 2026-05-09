import { FC } from 'react';
import { AuthorConfirmationStatusesEnum } from '../../../types/author';
import { resolveBackendEnumKey } from '../../../utils/i18n/resolve-backend-enum-key';
import HourglassSvg from '../../svg/Hourglass-svg';
import RejectSvg from '../../svg/Reject-svg';
import TickRoundedSvg from '../../svg/Tick-rounded-svg';

interface IProps {
  status: string;
  className: string;
}

const AuthorConfirmationStatusIcon: FC<IProps> = ({ status, className }) => {
  const key = resolveBackendEnumKey(AuthorConfirmationStatusesEnum, status);
  switch (key) {
    case 'PENDING':
      return <HourglassSvg className={className} />;
    case 'REJECTED':
      return <RejectSvg className={className} />;
    case 'APPROVED':
      return <TickRoundedSvg className={className} />;
    default:
      return null;
  }
};

export default AuthorConfirmationStatusIcon;
