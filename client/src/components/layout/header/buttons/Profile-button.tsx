import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useLogoutMutation } from '../../../../hooks/mutations';
import useNavigationPath from '../../../../hooks/use-navigation-path';
import { useStore } from '../../../../hooks/use-store';
import { RolesEnum } from '../../../../types/user';
import SettingsSvg from '../../../svg/Settings-svg';
import ShieldSvg from '../../../svg/Shield-svg';
import SkeletonLoader from '../../../utils/Skeleton-loader';
import LogoutSvg from '../svg/Logout-svg';
import ProfileSvg from '../svg/Profile-svg';
import PopupProfileButton from './Popup-profile-button';

const ProfileButton = observer(() => {
  const { t } = useTranslation();
  const { authStore } = useStore();

  const { navigatoToProfile, navigateToEditProfile, navigateToAdminReleases } =
    useNavigationPath();

  const { mutateAsync: logout } = useLogoutMutation({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popUpProfRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popUpProfRef.current &&
      !popUpProfRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const isLoading = authStore.isProfileLoading;

  return (
    <div
      ref={popUpProfRef}
      className="relative flex rounded-md items-center select-none"
    >
      {isLoading ? (
        <SkeletonLoader className="size-10 rounded-full" />
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full size-10 overflow-hidden cursor-pointer aspect-square"
        >
          <img
            loading="lazy"
            decoding="async"
            src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
              authStore.profile?.avatar === ''
                ? import.meta.env.VITE_DEFAULT_AVATAR
                : authStore.profile?.avatar
            }`}
            className="size-full aspect-square object-cover"
          />
        </button>
      )}

      <div
        className={`absolute z-2000 right-0 w-[300px] top-14 rounded-lg bg-zinc-950 border border-white/10 grid gap-2 font-medium py-3 transition-all duration-125 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <h3 className="px-5 pb-1 truncate">{authStore.user?.nickname}</h3>

        <Link
          to={authStore.user?.id ? navigatoToProfile(authStore.user.id) : '#'}
          onClick={() => setIsOpen(false)}
        >
          <PopupProfileButton
            text={t('layout.profile.myPage')}
            icon={<ProfileSvg className={'size-5.5'} />}
          />
        </Link>

        <Link
          to={authStore.user?.id ? navigateToEditProfile : '#'}
          onClick={() => setIsOpen(false)}
        >
          <PopupProfileButton
            text={t('layout.profile.settings')}
            icon={<SettingsSvg className={'size-7'} />}
          />
        </Link>

        {(authStore.user?.role.role === RolesEnum.ADMIN ||
          authStore.user?.role.role === RolesEnum.ROOT_ADMIN) && (
          <Link
            to={authStore.user?.id ? navigateToAdminReleases : '#'}
            onClick={() => setIsOpen(false)}
          >
            <PopupProfileButton
              text={t('layout.profile.adminPanel')}
              icon={<ShieldSvg className="size-6.5" />}
            />
          </Link>
        )}

        <div className="border-t border-white/10 pb-1" />

        <PopupProfileButton
          text={t('layout.profile.logout')}
          icon={<LogoutSvg className="size-4.5" />}
          onClick={logout}
        />
      </div>
    </div>
  );
});

export default ProfileButton;
