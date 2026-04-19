import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { NominationAPI } from '../../api/nomination-api';
import ComboBox from '../../components/buttons/Combo-box';
import SkeletonLoader from '../../components/utils/Skeleton-loader';
import useNavigationPath from '../../hooks/use-navigation-path';
import { nominationsKeys } from '../../query-keys/nominations-keys';
import { MonthEnumType } from '../../types/common/enums/months-enum';
import { translateMonth } from '../../utils/date/month-i18n';
import { NominationWinnersQuery } from '../../types/nomination';
import NominationCarouselContainer from './ui/carousel/Nomination-carousel-container';

const AwardsPage = () => {
  const { t } = useTranslation();
  const { navigateToVotes } = useNavigationPath();

  const [year, setYear] = useState<string>(new Date().getFullYear().toString());

  const parsedYear = useMemo(() => {
    const y = parseInt(year, 10);
    return Number.isFinite(y) ? y : undefined;
  }, [year]);

  const query: NominationWinnersQuery = {
    year: parsedYear,
  };

  const { data, isPending } = useQuery({
    queryKey: nominationsKeys.winners(query),
    queryFn: () => NominationAPI.findWinners(query),
    enabled: parsedYear !== null,
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];
  const minYear = data?.minYear ?? null;
  const maxYear = data?.maxYear ?? null;

  const yearOptions =
    minYear && maxYear
      ? Array.from({ length: maxYear - minYear + 1 }, (_, i) =>
          (maxYear - i).toString()
        )
      : [];

  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">
        {t('pages.awards.title')}
      </h1>

      <div className="flex justify-between items-center gap-2 lg:gap-5 h-15 mt-5">
        <Link
          to={navigateToVotes}
          className="w-40 bg-white h-full rounded-lg text-black flex items-center justify-center font-medium text-sm px-3 py-2 hover:bg-white/80 transition-colors duration-200 text-center"
        >
          {t('pages.awards.voteFor', {
            month: translateMonth(
              t,
              (new Date().getMonth() + 1) as MonthEnumType
            ),
          })}
        </Link>

        <div className="w-full rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm flex gap-4 items-center">
          <span className="hidden sm:block text-white/70 font-bold ">
            {t('pages.awards.year')}
          </span>
          <div className="w-full sm:w-55">
            {!minYear || !maxYear ? (
              <SkeletonLoader className={'w-full h-10 rounded-md'} />
            ) : (
              <ComboBox
                options={yearOptions}
                onChange={setYear}
                className="border border-white/10"
                value={year}
                isLoading={isPending}
              />
            )}
          </div>
        </div>
      </div>

      {isPending
        ? Array.from({ length: 2 }).map((_, idx) => (
            <div
              className="mt-5 lg:mt-10 border-b border-white/10 pb-5 lg:pb-10"
              key={`Carousel-skeleton-${idx}`}
            >
              <NominationCarouselContainer isLoading={true} idx={idx} />
            </div>
          ))
        : items.map((item) => (
            <div
              className="mt-10 border-b border-white/10 pb-10"
              key={item.month}
            >
              <NominationCarouselContainer
                item={item}
                isLoading={false}
                idx={0}
              />
            </div>
          ))}
    </>
  );
};

export default AwardsPage;
