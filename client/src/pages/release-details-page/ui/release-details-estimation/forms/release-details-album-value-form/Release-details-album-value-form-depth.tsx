import { observer } from 'mobx-react-lite';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAlbumValueFormStrings } from '../../../../../../utils/album-value';
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler';
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider';
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section';

interface IProps {
  depth: number;
  setDepth: (val: number) => void;
}

const ReleaseDetailsAlbumValueFormDepth: FC<IProps> = observer(
  ({ depth, setDepth }) => {
    const { i18n, t } = useTranslation();
    const s = useMemo(
      () => getAlbumValueFormStrings(i18n.language),
      [i18n.language]
    );

    const getDepthValueText = useMemo(
      () => makeStepLabeler(s.depth.stepTexts, 1, 1),
      [s.depth.stepTexts]
    );

    return (
      <ReleaseDetailsAlbumValueSection
        pos={3}
        title={t('albumValue.depth')}
        minMaxText={s.depth.sectionMinMax}
        description={
          <>
            <p>{s.depth.description}</p>
          </>
        }
        value={`${depth}`}
        maxValue={'5'}
      >
        <div className="xl:pl-10">
          <ReleaseDetailsAlbumValueFormSlider
            value={depth}
            setValue={setDepth}
            title={s.depth.sliderTitle}
            min={1}
            max={5}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={''}
            valueDescription={getDepthValueText(depth)}
          />
        </div>
      </ReleaseDetailsAlbumValueSection>
    );
  }
);

export default ReleaseDetailsAlbumValueFormDepth;
