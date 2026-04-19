import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ComboBox from '../../../../components/buttons/Combo-box';
import { translateReviewSortField } from '../../../../utils/review/review-sort-i18n';
import { ReleaseReviewSortFields } from '../../../../types/review';

interface IProps {
  count: number;
  selectedSort: string;
  setSelectedSort: (val: string) => void;
}

const ReleaseDetailsReviewsHeader: FC<IProps> = ({
  count,
  selectedSort,
  setSelectedSort,
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col gap-y-5 lg:gap-y-0 lg:items-center lg:flex-row lg:justify-between lg:mt-10 mt-5">
      <div className="font-bold flex items-center gap-x-5 h-full">
        <p className="text-xl xl:text-2xl ">
          {t('releaseDetails.reviews.header')}
        </p>

        <div className="inline-flex items-center justify-center rounded-full size-10 lg:size-12 bg-white/5 select-none">
          {count}
        </div>
      </div>

      <div className="whitespace-nowrap rounded-lg border border-white/5 bg-zinc-900 p-3 lg:p-2 grid md:flex gap-x-4 items-center font-bold w-full sm:w-1/2 lg:w-1/3 select-none">
        <p className="text-white/70 md:block text-sm md:text-base max-md:pb-1">
          {t('releaseDetails.reviews.sortBy')}
        </p>

        <ComboBox
          options={Object.values(ReleaseReviewSortFields)}
          value={selectedSort}
          onChange={setSelectedSort}
          formatOption={(o) => translateReviewSortField(t, o)}
          className="rounded-md border border-zinc-700 relative inline-block"
        />
      </div>
    </div>
  );
};

export default ReleaseDetailsReviewsHeader;
