import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseMediaStatusesEnum } from '../../../types/release';
import { translateReleaseMediaStatus } from '../../../utils/release/release-labels-i18n';
import HourglassSvg from '../../svg/Hourglass-svg';
import RejectSvg from '../../svg/Reject-svg';
import TickRoundedSvg from '../../svg/Tick-rounded-svg';

interface IProps {
  status: string;
  className: string;
}

const ReleaseMediaStatusIcon: FC<IProps> = ({ status, className }) => {
  const { t } = useTranslation();

  switch (status) {
    case ReleaseMediaStatusesEnum.PENDING:
      return (
        <span
          className="inline-flex"
          aria-label={translateReleaseMediaStatus(t, status)}
        >
          <HourglassSvg className={className} />
        </span>
      );
    case ReleaseMediaStatusesEnum.REJECTED:
      return (
        <span
          className="inline-flex"
          aria-label={translateReleaseMediaStatus(t, status)}
        >
          <RejectSvg className={className} />
        </span>
      );
    case ReleaseMediaStatusesEnum.APPROVED:
      return (
        <span
          className="inline-flex"
          aria-label={translateReleaseMediaStatus(t, status)}
        >
          <TickRoundedSvg className={className} />
        </span>
      );
    default:
      return null;
  }
};

export default ReleaseMediaStatusIcon;
