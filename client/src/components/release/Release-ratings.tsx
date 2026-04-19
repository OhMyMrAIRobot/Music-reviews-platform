import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReleaseRatingTotal,
  ReleaseRatingTypesEnum,
} from '../../types/release';
import Tooltip from '../tooltip/Tooltip';
import TooltipSpan from '../tooltip/Tooltip-span';

interface IProps {
  ratings: ReleaseRatingTotal[];
  className: string;
  showHint: boolean;
}

const ReleaseRatings: FC<IProps> = ({ ratings, className, showHint }) => {
  const { t } = useTranslation();

  const ratingOrder = [
    ReleaseRatingTypesEnum.MEDIA,
    ReleaseRatingTypesEnum.WITH_TEXT,
    ReleaseRatingTypesEnum.WITHOUT_TEXT,
  ];

  const sortedRatings = ratingOrder
    .map((type) => ratings.find((r) => r.type === type))
    .filter((r) => r && r.total > 0);

  return sortedRatings.map((rating) => {
    let baseClassName =
      ' inline-flex items-center justify-center font-semibold rounded-full ';
    let tooltip = '';
    if (rating?.type === ReleaseRatingTypesEnum.MEDIA) {
      baseClassName += 'bg-[rgba(255,255,255,.1)]';
      tooltip = t('release.ratings.media');
    } else if (rating?.type === ReleaseRatingTypesEnum.WITH_TEXT) {
      baseClassName += 'bg-[rgba(35,101,199)]';
      tooltip = t('release.ratings.withText');
    } else if (rating?.type === ReleaseRatingTypesEnum.WITHOUT_TEXT) {
      baseClassName += 'border-2 border-[rgba(35,101,199)]';
      tooltip = t('release.ratings.withoutText');
    }

    return showHint ? (
      <TooltipSpan
        key={rating?.type}
        tooltip={<Tooltip>{tooltip}</Tooltip>}
        spanClassName={'relative rounded-full'}
        centered={false}
      >
        <div key={rating?.type} className={className + baseClassName}>
          {rating?.total}
        </div>
      </TooltipSpan>
    ) : (
      <div key={rating?.type} className={className + baseClassName}>
        {rating?.total}
      </div>
    );
  });
};

export default ReleaseRatings;
