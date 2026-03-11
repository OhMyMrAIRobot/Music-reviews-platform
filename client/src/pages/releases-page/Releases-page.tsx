import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { ReleaseAPI } from '../../api/release/release-api';
import ComboBox from '../../components/buttons/Combo-box';
import ReleasesGrid from '../../components/release/Releases-grid';
import SkeletonLoader from '../../components/utils/Skeleton-loader';
import { useReleaseMeta } from '../../hooks/meta';
import { releasesKeys } from '../../query-keys/releases-keys';
import {
  ReleaseSortFields,
  ReleaseSortKey,
  ReleaseTypesFilterOptions,
  ReleasesQuery,
  getKeyByLabel,
  getSortParams,
  getTypeIdByOption,
} from '../../types/release';

const limit = 12;

const ReleasesPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSort, setSelectedSort] = useState<string>(
    ReleaseSortFields.PUBLISHED_NEW
  );
  const [selectedType, setSelectedType] = useState<string>(
    ReleaseTypesFilterOptions.ALL
  );

  const { types: releaseTypes, isLoading: isTypesLoading } = useReleaseMeta();

  const selectedTypeId = useMemo(
    () => getTypeIdByOption(selectedType, releaseTypes),
    [releaseTypes, selectedType]
  );

  const { sortField, sortOrder } = useMemo(() => {
    const key =
      getKeyByLabel(selectedSort) ?? ('PUBLISHED_NEW' as ReleaseSortKey);
    const params = getSortParams(key);
    return { sortField: params.field, sortOrder: params.order };
  }, [selectedSort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  const query: ReleasesQuery = {
    typeId: selectedTypeId,
    sortField,
    sortOrder,
    limit,
    offset: (currentPage - 1) * limit,
  };

  const { data, isPending: isReleasesLoading } = useQuery({
    queryKey: releasesKeys.list(query),
    queryFn: () => ReleaseAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(releaseTypes),
  });

  const items = data?.items ?? [];
  const count = data?.meta.count ?? 0;

  return (
    <>
      <h1 id="releases" className="text-2xl lg:text-3xl font-semibold">
        Добавленные релизы
      </h1>

      <div className="rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 grid md:flex gap-x-4 items-center">
        <span className="text-sm md:text-base text-white/70 font-bold max-md:pb-1">
          Тип релиза:
        </span>
        <div className="w-full sm:w-55 h-10">
          {!isTypesLoading && releaseTypes.length > 0 ? (
            <ComboBox
              options={Object.values(ReleaseTypesFilterOptions)}
              onChange={setSelectedType}
              className="border border-white/10"
              value={selectedType}
            />
          ) : (
            <SkeletonLoader className="size-full rounded-md" />
          )}
        </div>

        <span className="text-sm md:text-base text-white/70 font-bold max-md:mt-4 max-md:pb-1">
          Сортировать по:
        </span>
        <div className="w-full sm:w-82 h-10">
          <ComboBox
            options={Object.values(ReleaseSortFields)}
            onChange={setSelectedSort}
            className="border border-white/10"
            value={selectedSort}
          />
        </div>
      </div>

      <ReleasesGrid
        items={items}
        isLoading={isReleasesLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={count}
        perPage={limit}
      />
    </>
  );
};

export default ReleasesPage;
