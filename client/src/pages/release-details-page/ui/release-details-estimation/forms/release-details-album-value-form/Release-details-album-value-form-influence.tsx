import { observer } from 'mobx-react-lite';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAlbumValueInfluenceMultiplier } from '../../../../../../utils/get-album-value-influence-multiplier';
import { getAlbumValueFormStrings } from '../../../../../../utils/album-value';
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler';
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider';
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section';

interface IProps {
  releaseAnticip: number;
  setReleaseAnticip: (val: number) => void;
  authorPopularity: number;
  setAuthorPopularity: (val: number) => void;
}

const ReleaseDetailsAlbumValueFormInfluence: FC<IProps> = observer(
  ({
    releaseAnticip,
    setReleaseAnticip,
    authorPopularity,
    setAuthorPopularity,
  }) => {
    const { i18n, t } = useTranslation();
    const s = useMemo(
      () => getAlbumValueFormStrings(i18n.language),
      [i18n.language]
    );

    const getAuthorPopularityValueTitle = useMemo(
      () => makeStepLabeler(s.influence.authorPopularityTitles, 0.5, 1),
      [s.influence.authorPopularityTitles]
    );
    const getReleaseAnticipValueTitle = useMemo(
      () => makeStepLabeler(s.influence.releaseAnticipTitles, 0.5, 1),
      [s.influence.releaseAnticipTitles]
    );

    const authorKey = authorPopularity.toFixed(1);
    const anticipKey = releaseAnticip.toFixed(1);

    return (
      <ReleaseDetailsAlbumValueSection
        pos={5}
        title={t('albumValue.influence')}
        minMaxText={s.influence.sectionMinMax}
        description={
          <>
            <p>{s.influence.descriptionP1}</p>
            <p>{s.influence.descriptionP2}</p>
          </>
        }
        value={`${getAlbumValueInfluenceMultiplier(
          releaseAnticip + authorPopularity
        )}`}
        maxValue={'2.00'}
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 xl:gap-y-4 xl:pl-10 mt-3">
          <ReleaseDetailsAlbumValueFormSlider
            value={authorPopularity}
            setValue={setAuthorPopularity}
            title={t('albumValue.authorPopularity')}
            min={0.5}
            max={4.5}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={getAuthorPopularityValueTitle(authorPopularity)}
            valueDescription={
              s.influence.authorPopularityByStep[authorKey] || []
            }
          />
          <ReleaseDetailsAlbumValueFormSlider
            value={releaseAnticip}
            setValue={setReleaseAnticip}
            title={t('albumValue.releaseAnticipation')}
            min={0.5}
            max={4.5}
            step={1}
            rangeTemplate={s.sliderRange}
            valueTitle={getReleaseAnticipValueTitle(releaseAnticip)}
            valueDescription={
              s.influence.releaseAnticipByStep[anticipKey] || []
            }
          />
        </div>
      </ReleaseDetailsAlbumValueSection>
    );
  }
);

export default ReleaseDetailsAlbumValueFormInfluence;
