import { observer } from 'mobx-react-lite';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAlbumValueFormStrings } from '../../../../../../utils/album-value';
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider';
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section';

interface IProps {
  rhymes: number;
  setRhymes: (val: number) => void;
  structure: number;
  setStructure: (val: number) => void;
  realization: number;
  setRealization: (val: number) => void;
  individuality: number;
  setIndividuality: (val: number) => void;
}

const ReleaseDetailsAlbumValueFormQuality: FC<IProps> = observer(
  ({
    rhymes,
    setRhymes,
    structure,
    setStructure,
    realization,
    setRealization,
    individuality,
    setIndividuality,
  }) => {
    const { i18n, t } = useTranslation();
    const s = useMemo(
      () => getAlbumValueFormStrings(i18n.language),
      [i18n.language]
    );

    return (
      <ReleaseDetailsAlbumValueSection
        pos={4}
        title={t('albumValue.quality')}
        minMaxText={s.quality.sectionMinMax}
        description={<p>{s.quality.description}</p>}
        value={`${(rhymes + structure + realization + individuality) * 2.5}%`}
        maxValue={'100%'}
      >
        <div className="bg-zinc-800 rounded-lg xl:ml-10 px-5 py-3 border border-zinc-700">
          <div className="font-bold text-center mb-5">
            {s.quality.blockTitle}
            <span className="opacity-60"> {s.quality.blockSubtitle}</span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 xl:gap-y-4">
            <ReleaseDetailsAlbumValueFormSlider
              value={rhymes}
              setValue={setRhymes}
              title={t('review.marks.rhymes')}
              min={1}
              max={10}
              step={1}
              rangeTemplate={s.sliderRange}
              valueTitle={''}
              valueDescription={''}
            />

            <ReleaseDetailsAlbumValueFormSlider
              value={structure}
              setValue={setStructure}
              title={t('review.marks.structure')}
              min={1}
              max={10}
              step={1}
              rangeTemplate={s.sliderRange}
              valueTitle={''}
              valueDescription={''}
            />

            <ReleaseDetailsAlbumValueFormSlider
              value={realization}
              setValue={setRealization}
              title={t('review.marks.style')}
              min={1}
              max={10}
              step={1}
              rangeTemplate={s.sliderRange}
              valueTitle={''}
              valueDescription={''}
            />

            <ReleaseDetailsAlbumValueFormSlider
              value={individuality}
              setValue={setIndividuality}
              title={t('review.marks.individuality')}
              min={1}
              max={10}
              step={1}
              rangeTemplate={s.sliderRange}
              valueTitle={''}
              valueDescription={''}
            />
          </div>
        </div>
      </ReleaseDetailsAlbumValueSection>
    );
  }
);

export default ReleaseDetailsAlbumValueFormQuality;
