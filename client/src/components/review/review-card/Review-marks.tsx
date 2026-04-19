import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewValues } from '../../../types/review';
import TooltipSpan from '../../tooltip/Tooltip-span';
import ReviewToolTip from './Review-tooltip';

interface IProps {
  values: ReviewValues;
}

const ReviewMarks: FC<IProps> = ({ values }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full text-right justify-center">
      <span className="text-[20px] lg:text-[24px] font-bold ">
        {values.total}
      </span>
      <div className="flex gap-x-1.5 font-bold text-sx lg:text-sm">
        <TooltipSpan
          tooltip={<ReviewToolTip text={t('review.marks.rhymes')} />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.rhymes}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text={t('review.marks.structure')} />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.structure}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text={t('review.marks.style')} />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.realization}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text={t('review.marks.individuality')} />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.individuality}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text={t('review.marks.atmosphere')} />}
          spanClassName="text-[rgba(160,80,222)] relative inline-block"
        >
          {values.atmosphere}
        </TooltipSpan>
      </div>
    </div>
  );
};

export default ReviewMarks;
