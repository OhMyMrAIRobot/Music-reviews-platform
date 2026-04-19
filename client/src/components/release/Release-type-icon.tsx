import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseTypesEnum } from '../../types/release';
import { translateReleaseType } from '../../utils/release/release-labels-i18n';
import AlbumSvg from './svg/Album-svg';
import SingleSvg from './svg/Single-svg';

interface IProps {
  type: string;
  className: string;
}

const ReleaseTypeIcon: FC<IProps> = ({ type, className }) => {
  const { t } = useTranslation();

  switch (type) {
    case ReleaseTypesEnum.ALBUM:
      return (
        <span
          className="inline-flex"
          aria-label={translateReleaseType(t, type)}
        >
          <AlbumSvg className={className} />
        </span>
      );
    case ReleaseTypesEnum.SINGLE:
      return (
        <span
          className="inline-flex"
          aria-label={translateReleaseType(t, type)}
        >
          <SingleSvg className={className} />
        </span>
      );
    default:
      return null;
  }
};

export default ReleaseTypeIcon;
