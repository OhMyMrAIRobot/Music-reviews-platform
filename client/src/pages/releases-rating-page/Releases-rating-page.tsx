import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ReleaseAPI } from "../../api/release/release-api";
import ReleasesColumn from "../../components/release/releases-column/Releases-column";
import { releasesKeys } from "../../query-keys/releases-keys";
import { SortOrdersEnum } from "../../types/common/enums/sort-orders-enum";
import {
  ReleasesQuery,
  ReleasesSortFieldsEnum,
  ReleaseTypesEnum,
} from "../../types/release";
import ReleasesRatingPageHeader from "./ui/Releases-rating-page-header";

const ReleasesRatingPage = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());

  const query: ReleasesQuery = {
    year: year ?? undefined,
    month: year !== null ? month : undefined,
    sortField: ReleasesSortFieldsEnum.ALL_RATING,
    sortOrder: SortOrdersEnum.DESC,
  };

  const { data, isPending } = useQuery({
    queryKey: releasesKeys.list(query),
    queryFn: () => ReleaseAPI.findAll(query),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  const releases = data?.items ?? [];
  const minYear = data?.meta.minPublishYear;
  const maxYear = data?.meta.maxPublishYear;

  const tracks = releases.filter(
    (val) => val.releaseType.type === ReleaseTypesEnum.SINGLE,
  );
  const albums = releases.filter(
    (val) => val.releaseType.type === ReleaseTypesEnum.ALBUM,
  );

  return (
    <>
      <ReleasesRatingPageHeader
        selectedMonth={month}
        setSelectedMonth={setMonth}
        selectedYear={year}
        setSelectedYear={setYear}
        minYear={minYear ?? new Date().getFullYear()}
        maxYear={maxYear ?? new Date().getFullYear()}
        isLoading={isPending}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 space-y-5">
        <ReleasesColumn
          title={"Треки"}
          releases={tracks}
          isLoading={isPending}
        />
        <ReleasesColumn
          title={"Альбомы"}
          releases={albums}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default ReleasesRatingPage;
