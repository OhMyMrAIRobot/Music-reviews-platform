import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import LoginSvg from '../svg/Login-svg';

interface IProps {
  onClick?: () => void;
}

const LoginIconButton: FC<IProps> = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={t('layout.header.login')}
      onClick={onClick}
      className="flex justify-center items-center rounded-md text-sm font-medium bg-white/5 border border-white/10 size-10"
    >
      <LoginSvg className={'size-5'} />
    </button>
  );
};

export default LoginIconButton;
