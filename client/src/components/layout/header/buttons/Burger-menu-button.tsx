import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BurgerMenuSvg from '../svg/Burger-menu-svg';

interface IProps {
  onClick: () => void;
}

const BurgerMenuButton: FC<IProps> = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={t('layout.header.openMenu')}
      onClick={onClick}
      className="p-3"
    >
      <BurgerMenuSvg className={'size-8'} />
    </button>
  );
};

export default BurgerMenuButton;
