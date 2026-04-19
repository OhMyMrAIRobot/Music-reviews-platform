import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ComboBox from '../../../components/buttons/Combo-box';
import SkeletonLoader from '../../../components/utils/Skeleton-loader';
import { MonthEnumType } from '../../../types/common/enums/months-enum';
import { getTranslatedMonthNames } from '../../../utils/date/month-i18n';

interface IProps {
  selectedMonth: number;
  setSelectedMonth: (value: number) => void;
  selectedYear: number | null;
  setSelectedYear: (value: number | null) => void;
  minYear: number;
  maxYear: number;
  isLoading: boolean;
}

const ReleasesRatingPageHeader: FC<IProps> = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  minYear,
  maxYear,
  isLoading,
}) => {
  const { t } = useTranslation();
  const monthNames = useMemo(() => getTranslatedMonthNames(t), [t]);

  const handleMonthChange = (value: string) => {
    const idx = monthNames.indexOf(value);
    if (idx >= 0) setSelectedMonth((idx + 1) as MonthEnumType);
  };

  const yearOptions = [
    t('pages.releasesRating.allTime'),
    ...Array.from({ length: minYear ? maxYear - minYear + 1 : 0 }, (_, i) =>
      (maxYear - i).toString()
    ),
  ];

  const handleYearChange = (selectedValue: string) => {
    if (selectedValue === yearOptions[0]) {
      setSelectedYear(null);
    } else {
      setSelectedYear(parseInt(selectedValue, 10));
    }
  };

  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">
        {t('pages.releasesRating.title')}
      </h1>

      <div className="rounded-lg border border-white/10 p-3 bg-zinc-900 mt-4 lg:mt-8 md:flex md:items-center">
        <p className="font-bold text-gray-400 text-sm md:text-base md:mr-5 max-md:mb-2">
          {t('pages.releasesRating.filter')}
        </p>
        <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-5">
          <div className="w-50 h-10">
            {isLoading ? (
              <SkeletonLoader className="size-full rounded-md" />
            ) : (
              <ComboBox
                options={yearOptions}
                onChange={handleYearChange}
                className="border border-white/10"
                value={
                  selectedYear === null
                    ? yearOptions[0]
                    : selectedYear.toString()
                }
              />
            )}
          </div>
          {selectedYear !== null && (
            <div className="w-50 h-10">
              {isLoading ? (
                <SkeletonLoader className="size-full rounded-md" />
              ) : (
                <ComboBox
                  options={monthNames}
                  onChange={handleMonthChange}
                  className="border border-white/10"
                  value={
                    monthNames[selectedMonth - 1] ??
                    t('pages.releasesRating.unknownMonth')
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReleasesRatingPageHeader;
