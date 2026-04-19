import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReleaseRatingDetails,
  ReleaseRatingTotal,
  ReleaseRatingTypesEnum,
} from '../../../../types/release';

const DetailRow: FC<{ title: string; total: string; color: string }> = ({
  title,
  total,
  color,
}) => {
  return (
    <div className="flex w-full justify-between items-center border-b-2 border-white/20 border-dashed">
      <p className="text-xs font-bold">{title}</p>
      <span className={`${color} font-bold text-lg`}>{total}</span>
    </div>
  );
};

interface IProps {
  rating: ReleaseRatingTotal;
  ratingDetails?: ReleaseRatingDetails;
}

const ReleaseDetailsRatingsTooltip: FC<IProps> = ({
  rating,
  ratingDetails,
}) => {
  const { t } = useTranslation();

  const getTitle = (type: string) => {
    switch (type) {
      case ReleaseRatingTypesEnum.MEDIA:
        return t('releaseDetails.ratings.media');
      case ReleaseRatingTypesEnum.WITH_TEXT:
        return t('releaseDetails.ratings.withReviews');
      case ReleaseRatingTypesEnum.WITHOUT_TEXT:
        return t('releaseDetails.ratings.withoutReviews');
      default:
        return '';
    }
  };

  return (
    ratingDetails && (
      <div className="w-70 flex flex-col bg-primary border border-gray-600 rounded-lg p-2 gap-y-1">
        <p className="text-white font-bold p-1.5 rounded-lg bg-white/30 text-left text-sm">
          {getTitle(rating.type)}
        </p>
        <DetailRow
          title={t('review.marks.rhymes')}
          total={`${ratingDetails.details.rhymes}`}
          color={'text-[rgba(35,101,199)]'}
        />
        <DetailRow
          title={t('review.marks.structure')}
          total={`${ratingDetails.details.structure}`}
          color={'text-[rgba(35,101,199)]'}
        />
        <DetailRow
          title={t('review.marks.style')}
          total={`${ratingDetails.details.realization}`}
          color={'text-[rgba(35,101,199)]'}
        />
        <DetailRow
          title={t('review.marks.individuality')}
          total={`${ratingDetails.details.individuality}`}
          color={'text-[rgba(35,101,199)]'}
        />
        <DetailRow
          title={t('review.marks.atmosphere')}
          total={`${ratingDetails.details.atmosphere}`}
          color={'text-[rgba(160,80,222)]'}
        />
      </div>
    )
  );
};

export default ReleaseDetailsRatingsTooltip;
