import { observer } from 'mobx-react-lite';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAlbumValueFormStrings } from '../../../../../../utils/album-value';
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler';
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider';
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section';

interface IProps {
  rarityGenre: number;
  setRarityGenre: (val: number) => void;
  rarityPerformance: number;
  setRarityPerformance: (val: number) => void;
}

const ReleaseDetailsAlbumValueFormRarity: FC<IProps> = observer(
  ({
    rarityGenre,
    rarityPerformance,
    setRarityGenre,
    setRarityPerformance,
  }) => {
    const { i18n, t } = useTranslation();
    const s = useMemo(
      () => getAlbumValueFormStrings(i18n.language),
      [i18n.language]
    );

    const getRarityGenreValueTitle = useMemo(
      () => makeStepLabeler(s.rarity.genreTitles, 0.5, 1),
      [s.rarity.genreTitles]
    );
    const getRarityGenreValueText = useMemo(
      () => makeStepLabeler(s.rarity.genreTexts, 0.5, 1),
      [s.rarity.genreTexts]
    );
    const getRarityPerfomanceValueTitle = useMemo(
      () => makeStepLabeler(s.rarity.performanceTitles, 0.5, 1),
      [s.rarity.performanceTitles]
    );
    const getRarityPerfomanceValueText = useMemo(
      () => makeStepLabeler(s.rarity.performanceTexts, 0.5, 1),
      [s.rarity.performanceTexts]
    );

    return (
      <ReleaseDetailsAlbumValueSection
        pos={1}
        title={t('albumValue.rarity')}
        minMaxText={s.rarity.sectionMinMax}
        description={
          <>
            <p>{s.rarity.descriptionP1}</p>
            <p>{s.rarity.descriptionP2}</p>
          </>
        }
        value={`${rarityGenre + rarityPerformance}`}
        maxValue={'5'}
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 xl:gap-y-4 xl:pl-10 mt-3">
          <ReleaseDetailsAlbumValueFormSlider
            value={rarityGenre}
            setValue={setRarityGenre}
            title={s.rarity.sliderGenreTitle}
            min={0.5}
            max={2.5}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={getRarityGenreValueTitle(rarityGenre)}
            valueDescription={getRarityGenreValueText(rarityGenre)}
          />
          <ReleaseDetailsAlbumValueFormSlider
            value={rarityPerformance}
            setValue={setRarityPerformance}
            title={s.rarity.sliderPerformanceTitle}
            min={0.5}
            max={2.5}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={getRarityPerfomanceValueTitle(rarityPerformance)}
            valueDescription={getRarityPerfomanceValueText(rarityPerformance)}
          />
        </div>
      </ReleaseDetailsAlbumValueSection>
    );
  }
);

export default ReleaseDetailsAlbumValueFormRarity;
