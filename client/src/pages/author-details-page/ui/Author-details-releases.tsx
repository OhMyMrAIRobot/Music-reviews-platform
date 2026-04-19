import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseAPI } from '../../../api/release/release-api';
import ReleasesColumn from '../../../components/release/releases-column/Releases-column';
import { releasesKeys } from '../../../query-keys/releases-keys';
import { SortOrdersEnum } from '../../../types/common/enums/sort-orders-enum';
import {
  ReleasesQuery,
  ReleasesSortFieldsEnum,
  ReleaseTypesEnum,
} from '../../../types/release';

interface IProps {
  id: string;
}

const AuthorDetailsReleases: FC<IProps> = ({ id }) => {
  const { t } = useTranslation();
  const query: ReleasesQuery = {
    authorId: id,
    sortField: ReleasesSortFieldsEnum.PUBLISHED,
    sortOrder: SortOrdersEnum.DESC,
  };

  const { data, isPending } = useQuery({
    queryKey: releasesKeys.list(query),
    queryFn: () => ReleaseAPI.findAll(query),
    staleTime: 1000 * 60 * 5,
  });

  const releases = data?.items || [];

  const tracks = releases.filter(
    (val) => val.releaseType.type === ReleaseTypesEnum.SINGLE
  );

  const albums = releases.filter(
    (val) => val.releaseType.type === ReleaseTypesEnum.ALBUM
  );

  return (
    <section className="flex flex-col gap-y-2">
      <h2 className="text-lg lg:text-2xl font-semibold">
        {t('releaseDetails.author.releasesTitle')}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ReleasesColumn
          title={t('releaseDetails.author.singles')}
          releases={tracks}
          isLoading={isPending}
        />

        <ReleasesColumn
          title={t('releaseDetails.author.albums')}
          releases={albums}
          isLoading={isPending}
        />
      </div>
    </section>
  );
};

export default AuthorDetailsReleases;
