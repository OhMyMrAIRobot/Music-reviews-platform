import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReleaseDetailsAlbumValueRow from '../../pages/release-details-page/ui/release-details-album-value/Release-details-album-value-row';
import ReleaseDetailsAlbumValueSection from '../../pages/release-details-page/ui/release-details-album-value/Release-details-album-value-section';
import {
  getAlbumValueTier,
  getAlbumValueTierConfig,
} from '../../utils/album-value-config';

interface IProps {
  rarity: {
    total: number;
    rarityGenre: number;
    rarityPerformance: number;
  };
  integrity: {
    total: number;
    formatRelease: number;
    integrityGenre: number;
    integritySemantic: number;
  };
  depth: number;
  quality: {
    total: number;
    factor: number;
    rhymes: number;
    structure: number;
    individuality: number;
    styleImplementation: number;
  };
  influence: {
    total: number;
    multiplier: number;
    releaseAnticip: number;
    authorPopularity: number;
  };
  totalValue: number;
}

const AlbumValue: FC<IProps> = observer(
  ({ rarity, influence, integrity, depth, quality, totalValue }) => {
    const { t } = useTranslation();
    const level = getAlbumValueTier(totalValue);

    if (!level) return null;

    const config = getAlbumValueTierConfig(level);

    return (
      <div
        className={`bg-zinc-900 shadow-sm mt-5 flex items-center border p-2.5 lg:p-3 rounded-xl relative overflow-hidden ${config.borderColor}`}
      >
        <div
          className={`absolute inset-0 opacity-20 bg-gradient-to-br pointer-events-none ${config.gradientColor}`}
        />

        <div className="relative flex flex-col lg:flex-row items-start gap-2 w-full">
          <div
            className={`shrink-0 max-lg:w-full border ${config.borderColor} h-[110px] flex items-center gap-3 rounded-[12px] py-3 pl-1.5 lg:pl-3 pr-3 lg:pr-5 relative overflow-hidden bg-gradient-to-br ${config.dimGradientColor}`}
          >
            <img
              loading="lazy"
              decoding="async"
              src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
                config.image
              }`}
              className={`size-[70px] lg:size-[80px]`}
            />
            <div>
              <span className="block lg:text-lg font-bold mb-0 lg:mb-2 lg:-mt-1">
                {t(`albumValue.tiers.${level}`)}
              </span>
              <span className="block font-bold text-xl lg:text-[32px] leading-[28px]">
                {totalValue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="w-full text-left text-sm grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-2 gap-y-2 shrink-1 justify-center">
            <ReleaseDetailsAlbumValueSection>
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.rarity')}
                value={rarity.total.toString()}
                maxValue={'5'}
                isSectionTitle={true}
              />
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.genreRarity')}
                value={rarity.rarityGenre.toString()}
                maxValue={'2.5'}
                isSectionTitle={false}
              />
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.performanceFormatRarity')}
                value={rarity.rarityPerformance.toString()}
                maxValue={'2.5'}
                isSectionTitle={false}
              />
            </ReleaseDetailsAlbumValueSection>

            <ReleaseDetailsAlbumValueSection>
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.integrity')}
                value={integrity.total.toString()}
                maxValue={'5'}
                isSectionTitle={true}
              />
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.releaseFormat')}
                value={integrity.formatRelease.toString()}
                maxValue={'1'}
                isSectionTitle={false}
              />
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.genreIntegrity')}
                value={integrity.integrityGenre.toString()}
                maxValue={'2.5'}
                isSectionTitle={false}
              />
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.semanticIntegrity')}
                value={integrity.integritySemantic.toString()}
                maxValue={'1.5'}
                isSectionTitle={false}
              />
            </ReleaseDetailsAlbumValueSection>

            <div className="flex flex-col gap-2 items-stretch justify-stretch">
              <ReleaseDetailsAlbumValueSection>
                <ReleaseDetailsAlbumValueRow
                  title={t('albumValue.depth')}
                  value={depth.toString()}
                  maxValue={'5'}
                  isSectionTitle={true}
                />
              </ReleaseDetailsAlbumValueSection>

              <ReleaseDetailsAlbumValueSection>
                <ReleaseDetailsAlbumValueRow
                  title={t('albumValue.quality')}
                  value={`${quality.factor * 100} %`}
                  isSectionTitle={true}
                />
                <ReleaseDetailsAlbumValueRow
                  title={t('albumValue.basePoints')}
                  value={quality.total.toString()}
                  maxValue={'40'}
                  isSectionTitle={false}
                />
              </ReleaseDetailsAlbumValueSection>
            </div>

            <ReleaseDetailsAlbumValueSection>
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.influence')}
                value={influence.total.toString()}
                maxValue={'9'}
                isSectionTitle={true}
              />
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.authorPopularity')}
                value={influence.authorPopularity.toString()}
                maxValue={'4.5'}
                isSectionTitle={false}
              />
              <ReleaseDetailsAlbumValueRow
                title={t('albumValue.releaseAnticipation')}
                value={influence.releaseAnticip.toString()}
                maxValue={'4.5'}
                isSectionTitle={false}
              />
            </ReleaseDetailsAlbumValueSection>
          </div>
        </div>
      </div>
    );
  }
);

export default AlbumValue;
