import { observer } from 'mobx-react-lite';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAlbumValueFormStrings } from '../../../../../../utils/album-value';
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler';
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider';
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section';

interface IProps {
  formatRelease: number;
  setFormatRelease: (val: number) => void;
  integrityGenre: number;
  setIntegrityGenre: (val: number) => void;
  integritySemantic: number;
  setIntegritySemantic: (val: number) => void;
}

const ReleaseDetailsAlbumValueFormIntegrity: FC<IProps> = observer(
  ({
    formatRelease,
    setFormatRelease,
    integrityGenre,
    setIntegrityGenre,
    integritySemantic,
    setIntegritySemantic,
  }) => {
    const { i18n, t } = useTranslation();
    const s = useMemo(
      () => getAlbumValueFormStrings(i18n.language),
      [i18n.language]
    );

    const getFormatReleaseValueText = useMemo(
      () => makeStepLabeler(s.integrity.formatReleaseTexts, 0, 1),
      [s.integrity.formatReleaseTexts]
    );
    const getIntegrityGenreValueText = useMemo(
      () => makeStepLabeler(s.integrity.genreTexts, 0.5, 1),
      [s.integrity.genreTexts]
    );
    const getIntegritySemanticValueText = useMemo(
      () => makeStepLabeler(s.integrity.semanticTexts, 0.5, 1),
      [s.integrity.semanticTexts]
    );

    return (
      <ReleaseDetailsAlbumValueSection
        pos={2}
        title={t('albumValue.integrity')}
        minMaxText={s.integrity.sectionMinMax}
        description={
          <>
            <p>{s.integrity.descriptionP1}</p>
            <p>{s.integrity.descriptionP2}</p>
          </>
        }
        value={`${formatRelease + integrityGenre + integritySemantic}`}
        maxValue={'5'}
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-6 gap-y-2 lg:gap-y-4 xl:pl-10 mt-3">
          <ReleaseDetailsAlbumValueFormSlider
            value={formatRelease}
            setValue={setFormatRelease}
            title={t('albumValue.releaseFormat')}
            min={0}
            max={1}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={''}
            valueDescription={getFormatReleaseValueText(formatRelease)}
          />

          <ReleaseDetailsAlbumValueFormSlider
            value={integrityGenre}
            setValue={setIntegrityGenre}
            title={t('albumValue.genreIntegrity')}
            min={0.5}
            max={2.5}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={''}
            valueDescription={getIntegrityGenreValueText(integrityGenre)}
          />

          <ReleaseDetailsAlbumValueFormSlider
            value={integritySemantic}
            setValue={setIntegritySemantic}
            title={t('albumValue.semanticIntegrity')}
            min={0.5}
            max={1.5}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={''}
            valueDescription={getIntegritySemanticValueText(integritySemantic)}
          />
        </div>
      </ReleaseDetailsAlbumValueSection>
    );
  }
);

export default ReleaseDetailsAlbumValueFormIntegrity;
