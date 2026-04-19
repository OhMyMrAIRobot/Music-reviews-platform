import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import SwitchButton from '../../../../components/buttons/Switch-button';
import useNavigationPath from '../../../../hooks/use-navigation-path';
import { useStore } from '../../../../hooks/use-store';
import { Release, ReleaseTypesEnum } from '../../../../types/release';
import { RolesEnum } from '../../../../types/user';
import { ReleaseDetailsPageSectionId } from '../../types/release-details-page-sections';
import ReleaseDetailsEstimationWarning from './Release-details-estimation-warning';
import ReleaseDetailsAlbumValueForm from './forms/release-details-album-value-form/Release-details-album-value-form';
import ReleaseDetailsMediaReviewForm from './forms/release-details-media-review-form/Release-details-media-review-form';
import ReleaseDetailsReviewForm from './forms/release-details-review-form/Release-details-review-form';

interface IProps {
  release: Release;
}

const ReleaseDetailsEstimation: FC<IProps> = ({ release }) => {
  const { t } = useTranslation();
  const { authStore } = useStore();

  const { navigateToLogin } = useNavigationPath();

  const [section, setSection] = useState<ReleaseDetailsPageSectionId>(
    ReleaseDetailsPageSectionId.REVIEW
  );

  const sectionTitle = useMemo(
    () => ({
      [ReleaseDetailsPageSectionId.REVIEW]: t('releaseDetails.sections.review'),
      [ReleaseDetailsPageSectionId.MARK]: t('releaseDetails.sections.mark'),
      [ReleaseDetailsPageSectionId.MEDIAREVIEW]: t(
        'releaseDetails.sections.mediaReview'
      ),
      [ReleaseDetailsPageSectionId.ALBUM_VALUE]: t(
        'releaseDetails.sections.albumValue'
      ),
    }),
    [t]
  );

  if (!authStore.isAuth)
    return (
      <div className="text-center text-white/90 border font-medium border-white/15 bg-gradient-to-br from-white/10 rounded-2xl text-sm lg:text-base w-full lg:max-w-[800px] sm:max-w-[600px] px-5 py-5 mx-auto mt-7">
        <span className="mr-1">
          {t('releaseDetails.estimation.loginPrompt')}
        </span>
        <Link
          to={navigateToLogin}
          className="underline underline-offset-4 cursor-pointer hover:text-white transition-colors duration-200"
        >
          {t('releaseDetails.estimation.loginLink')}
        </Link>
      </div>
    );

  return (
    <div className="mt-10 mx-auto">
      <h3 className="text-xl lg:text-2xl font-bold ">
        {t('releaseDetails.estimation.title')}
      </h3>

      <div className="grid lg:grid-cols-8 items-start gap-5 mt-5">
        <div className="lg:col-span-2">
          <div className="rounded-md bg-secondary grid w-full items-stretch justify-stretch">
            <SwitchButton
              title={sectionTitle[ReleaseDetailsPageSectionId.REVIEW]}
              isActive={section === ReleaseDetailsPageSectionId.REVIEW}
              onClick={() => setSection(ReleaseDetailsPageSectionId.REVIEW)}
            />

            <SwitchButton
              title={sectionTitle[ReleaseDetailsPageSectionId.MARK]}
              isActive={section === ReleaseDetailsPageSectionId.MARK}
              onClick={() => setSection(ReleaseDetailsPageSectionId.MARK)}
            />

            {authStore.user?.role.role === RolesEnum.MEDIA && (
              <SwitchButton
                title={sectionTitle[ReleaseDetailsPageSectionId.MEDIAREVIEW]}
                isActive={section === ReleaseDetailsPageSectionId.MEDIAREVIEW}
                onClick={() =>
                  setSection(ReleaseDetailsPageSectionId.MEDIAREVIEW)
                }
              />
            )}

            {release.releaseType.type === ReleaseTypesEnum.ALBUM && (
              <SwitchButton
                title={sectionTitle[ReleaseDetailsPageSectionId.ALBUM_VALUE]}
                isActive={section === ReleaseDetailsPageSectionId.ALBUM_VALUE}
                onClick={() =>
                  setSection(ReleaseDetailsPageSectionId.ALBUM_VALUE)
                }
              />
            )}
          </div>

          <ReleaseDetailsEstimationWarning />
        </div>

        <div className="lg:col-span-6">
          {section === ReleaseDetailsPageSectionId.REVIEW && (
            <ReleaseDetailsReviewForm releaseId={release.id} isReview={true} />
          )}

          {section === ReleaseDetailsPageSectionId.MARK && (
            <ReleaseDetailsReviewForm releaseId={release.id} isReview={false} />
          )}

          {section === ReleaseDetailsPageSectionId.MEDIAREVIEW && (
            <ReleaseDetailsMediaReviewForm releaseId={release.id} />
          )}

          {section === ReleaseDetailsPageSectionId.ALBUM_VALUE && (
            <ReleaseDetailsAlbumValueForm release={release} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReleaseDetailsEstimation;
