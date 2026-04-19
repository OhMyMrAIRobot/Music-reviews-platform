import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileAPI } from '../../../../../api/user/profile-api.ts';
import { profilesKeys } from '../../../../../query-keys/profiles-keys.ts';
import ProfilePreferencesGridRow from './Profile-preferences-grid-row.tsx';

interface IProps {
  userId: string;
}

const ProfilePreferencesGrid: FC<IProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { data, isPending } = useQuery({
    queryKey: profilesKeys.preferences(userId),
    queryFn: () => ProfileAPI.findPreferences(userId),
    staleTime: 1000 * 60 * 5,
  });

  const artists = data?.artists || [];
  const albums = data?.albums || [];
  const tracks = data?.tracks || [];
  const producers = data?.producers || [];

  return (
    <div className="grid lg:grid-cols-2 gap-y-4 lg:gap-y-8 gap-x-10">
      <ProfilePreferencesGridRow
        title={t('pages.profile.preferences.artists')}
        items={artists}
        isAuthor={true}
        isLoading={isPending}
      />

      <ProfilePreferencesGridRow
        title={t('pages.profile.preferences.albums')}
        items={albums}
        isAuthor={false}
        isLoading={isPending}
      />

      <ProfilePreferencesGridRow
        title={t('pages.profile.preferences.singles')}
        items={tracks}
        isAuthor={false}
        isLoading={isPending}
      />

      <ProfilePreferencesGridRow
        title={t('pages.profile.preferences.producers')}
        items={producers}
        isAuthor={true}
        isLoading={isPending}
      />
    </div>
  );
};

export default ProfilePreferencesGrid;
