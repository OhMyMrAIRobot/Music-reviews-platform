import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import HeartSvg from '../svg/Heart-svg';

interface IProps {
  onClick: () => void;
  isLiked: boolean;
  className?: string;
  toggling: boolean;
}

const ToggleFavButton: FC<IProps> = ({
  onClick,
  isLiked,
  className,
  toggling,
}) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={
        isLiked ? t('buttons.toggleFav.remove') : t('buttons.toggleFav.add')
      }
      disabled={toggling}
      onClick={onClick}
      className={`inline-flex items-center justify-center border border-white/20 ${
        toggling
          ? 'cursor-progress bg-zinc-950/10'
          : 'cursor-pointer hover:bg-white/10 bg-zinc-950'
      } transition-all duration-200 rounded-full ${className}`}
    >
      <HeartSvg
        className={`size-6 ${
          isLiked ? 'fill-red-600 stroke-red-600' : 'fill-none stroke-white'
        }`}
      />
    </button>
  );
};

export default ToggleFavButton;
