import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AlbumValue } from '../../types/album-value';
import {
  getAlbumValueTier,
  getAlbumValueTierConfig,
} from '../../utils/album-value-config';

interface IProps {
  value: AlbumValue;
  className?: string;
}

const AlbumValueTooltip: FC<IProps> = ({ value, className = '' }) => {
  const { t } = useTranslation();
  const level = getAlbumValueTier(value.totalValue);

  if (!level) return null;

  const config = getAlbumValueTierConfig(level);

  return (
    <div
      className={`text-left rounded-xl z-2000 px-2 py-1.5 relative overflow-hidden border ${config.borderColor} ${className} shadow-md opacity-95`}
    >
      <div
        className={`absolute inset-0 opacity-20 bg-gradient-to-br pointer-events-none ${config.gradientColor}`}
      />
      <div className="font-semibold bg-black/20 p-1 text-center rounded-md border border-black/30 relative z-10 mb-2">
        {t(`albumValue.tiers.${level}`)}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between relative z-10 max-lg:space-x-2">
          <span>{t('albumValue.rarity')}</span>
          <span className="font-semibold">{value.rarity.total}</span>
        </div>
        <div className="flex justify-between relative z-10 max-lg:space-x-2">
          <span>{t('albumValue.integrity')}</span>
          <span className="font-semibold">{value.integrity.total}</span>
        </div>
        <div className="flex justify-between relative z-10 max-lg:space-x-2">
          <span>{t('albumValue.depth')}</span>
          <span className="font-semibold">{value.depth}</span>
        </div>
        <div className="flex justify-between relative z-10 max-lg:space-x-2">
          <span>{t('albumValue.quality')}</span>
          <span className="font-semibold">{value.quality.factor * 100}%</span>
        </div>
        <div className="flex justify-between relative z-10 max-lg:space-x-2">
          <span>{t('albumValue.influence')}</span>
          <span className="font-semibold">{value.influence.multiplier}</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumValueTooltip;
