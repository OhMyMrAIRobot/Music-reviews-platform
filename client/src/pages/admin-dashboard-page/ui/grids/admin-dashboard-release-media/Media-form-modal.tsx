import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseAPI } from '../../../../../api/release/release-api';
import ComboBox from '../../../../../components/buttons/Combo-box';
import FormButton from '../../../../../components/form-elements/Form-button';
import FormInput from '../../../../../components/form-elements/Form-input';
import FormLabel from '../../../../../components/form-elements/Form-label';
import FormSingleSelect from '../../../../../components/form-elements/Form-single-select';
import ModalOverlay from '../../../../../components/modals/Modal-overlay';
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader';
import { useReleaseMediaMeta } from '../../../../../hooks/meta';
import {
  useAdminCreateMediaMutation,
  useAdminUpdateMediaMutation,
} from '../../../../../hooks/mutations';
import { releasesKeys } from '../../../../../query-keys/releases-keys';
import { ReleaseMedia, ReleasesQuery } from '../../../../../types/release';
import { constraints } from '../../../../../utils/constraints';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  media?: ReleaseMedia;
}

const MediaFormModal: FC<IProps> = ({ isOpen, onClose, media }) => {
  const { t } = useTranslation();
  const { statuses, types, isLoading: isMetaLoading } = useReleaseMediaMeta();
  const queryClient = useQueryClient();

  /** STATES */
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [release, setRelease] = useState<string>('');
  const [searchReleases, setSearchReleases] = useState<string>('');

  /** EFFECTS */
  useEffect(() => {
    if (isOpen && media) {
      setTitle(media.title);
      setUrl(media.url);
      setStatus(media.status.status);
      setType(media.type.type);
      setRelease(media.release.title);
    }
  }, [isOpen, media]);

  /**
   * Query to load releases for the release select input
   */
  const query: ReleasesQuery = {
    search: searchReleases.trim() ?? undefined,
    limit: 20,
    offset: 0,
  };

  /**
   * Fetch releases for the release select input
   */
  const { data: releasesData, isPending: isReleasesLoading } = useQuery({
    queryKey: releasesKeys.list(query),
    queryFn: () => ReleaseAPI.findAll(query),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const releases = releasesData?.items || [];

  /**
   * Function to load releases for the release select input.
   * Fetches filtered releases from the server for the given search string
   * so the single-select receives up-to-date options while the user types.
   *
   * @param {string} search - The search string
   * @returns {Promise<string[]>} - A promise that resolves to an array of release titles
   */
  const loadReleases = async (search: string): Promise<string[]> => {
    // Build a query that includes the current search term
    const query: ReleasesQuery = {
      search: search.trim() || undefined,
      limit: 20,
      offset: 0,
    };

    // Fetch matching releases directly (ensures fresh, filtered results)
    const data = await queryClient.fetchQuery({
      queryKey: releasesKeys.list(query),
      queryFn: () => ReleaseAPI.findAll(query),
    });

    const items = data?.items || [];
    return items.map((r) => r.title);
  };

  const onSuccess = () => {
    clearForm();
    onClose();
  };

  const { mutateAsync: createAsync, isPending: isCreating } =
    useAdminCreateMediaMutation({ onSuccess });

  const { mutateAsync: updateAsync, isPending: isUpdating } =
    useAdminUpdateMediaMutation({ onSuccess });

  /**
   * Indicates whether a mutation is pending
   *
   * @return {boolean} True if a mutation is pending, false otherwise
   */
  const isPending = useMemo(() => {
    return isCreating || isUpdating;
  }, [isCreating, isUpdating]);

  /**
   * Indicates whether the form is valid
   *
   * @return {boolean} True if the form is valid, false otherwise
   */
  const isFormValid = useMemo(() => {
    return (
      title.trim().length >= constraints.releaseMedia.minTitleLength &&
      title.trim().length <= constraints.releaseMedia.maxTitleLength &&
      url.trim().length >= constraints.releaseMedia.minUrlLength &&
      url.trim().length <= constraints.releaseMedia.maxUrlLength &&
      status &&
      type &&
      release
    );
  }, [release, status, title, type, url]);

  /**
   * Indicates whether there are changes to be saved
   *
   * @return {boolean} True if there are changes, false otherwise
   */
  const hasChanges = useMemo(() => {
    if (!media) return true;
    return (
      title.trim() !== media.title ||
      url.trim() !== media.url ||
      type !== media.type.type ||
      status !== media.status.status ||
      release !== media.release.title
    );
  }, [media, release, status, title, type, url]);

  /**
   * Handler for form submission
   */
  const handleSubmit = () => {
    if (isPending || !isFormValid || !hasChanges) return;

    const typeId = types.find((t) => t.type === type)?.id;
    const statusId = statuses.find((s) => s.status === status)?.id;
    const releaseId = releases.find((r) => r.title === release)?.id;

    if (!media) {
      if (typeId && statusId && releaseId)
        return createAsync({
          title: title.trim(),
          url: url.trim(),
          releaseId: releaseId,
          releaseMediaTypeId: typeId,
          releaseMediaStatusId: statusId,
        });
    } else {
      return updateAsync({
        id: media.id,
        data: {
          title: title.trim() !== media.title ? title.trim() : undefined,
          url: url.trim() !== media.url ? url.trim() : undefined,
          releaseId: releaseId !== media.release.id ? releaseId : undefined,
          releaseMediaTypeId: typeId !== media.type.id ? typeId : undefined,
          releaseMediaStatusId:
            statusId !== media.status.id ? statusId : undefined,
        },
      });
    }
  };

  /**
   * Clears the form fields
   */
  const clearForm = () => {
    setTitle('');
    setUrl('');
    setStatus('');
    setType('');
    setRelease('');
    setSearchReleases('');
  };

  /** CONSTANTS */
  const formTitle = media
    ? t('adminDashboard.media.editTitle')
    : t('adminDashboard.media.createTitle');
  const buttonText = media
    ? t('adminDashboard.common.save')
    : t('adminDashboard.common.add');

  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onCancel={onClose}
      isLoading={isPending}
      className="max-lg:size-full"
    >
      {isMetaLoading ? (
        <SkeletonLoader className="w-full lg:w-240 h-140 rounded-xl" />
      ) : (
        <div
          className={`relative rounded-xl w-full max-lg:h-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 lg:pb-6 flex items-center`}
        >
          <div className="w-full">
            <h1 className="border-b border-white/10 text-3xl font-bold py-4 text-center">
              {formTitle}
            </h1>

            <div className="w-full grid lg:grid-cols-2 p-6 border-b border-white/10 gap-3 lg:gap-6">
              <div className="grid gap-2 w-full">
                <FormLabel
                  name={t('adminDashboard.common.title')}
                  htmlFor={'media-title-input'}
                  isRequired={true}
                />
                <FormInput
                  id={'media-title-input'}
                  placeholder={t('adminDashboard.common.titlePlaceholder')}
                  type={'text'}
                  value={title}
                  setValue={setTitle}
                />
              </div>

              <div className="grid gap-2 w-full">
                <FormLabel
                  name={t('adminDashboard.media.urlLabel')}
                  htmlFor={'media-url-input'}
                  isRequired={true}
                />
                <FormInput
                  id={'media-url-input'}
                  placeholder={t('adminDashboard.media.urlPlaceholder')}
                  type={'text'}
                  value={url}
                  setValue={setUrl}
                />
              </div>

              <div className="grid gap-2 w-full">
                <FormLabel
                  name={t('adminDashboard.media.mediaType')}
                  htmlFor={'media-type'}
                  isRequired={true}
                />

                <ComboBox
                  options={types.map((entry) => entry.type)}
                  value={type || undefined}
                  onChange={setType}
                  placeholder={t('adminDashboard.media.typePlaceholder')}
                  className="border border-white/15"
                />
              </div>

              <div className="grid gap-2 w-full">
                <FormLabel
                  name={t('adminDashboard.media.mediaStatusCol')}
                  htmlFor={'media-status'}
                  isRequired={true}
                />

                <ComboBox
                  options={statuses.map((entry) => entry.status)}
                  value={status || undefined}
                  onChange={setStatus}
                  placeholder={t('adminDashboard.media.statusPlaceholder')}
                  className="border border-white/15"
                />
              </div>

              <div className="grid gap-2 w-full">
                <FormLabel
                  name={t('adminDashboard.media.releaseName')}
                  htmlFor={'media-release-input'}
                  isRequired={true}
                />

                <FormSingleSelect
                  id={'media-release-input'}
                  placeholder={t('adminDashboard.media.releaseNamePlaceholder')}
                  value={release}
                  onChange={setRelease}
                  loadOptions={loadReleases}
                  isLoading={isReleasesLoading}
                />
              </div>
            </div>

            <div className="pt-6 px-6 w-full grid sm:flex gap-3 sm:justify-start">
              <div className="w-full sm:w-30">
                <FormButton
                  title={buttonText}
                  isInvert={true}
                  onClick={handleSubmit}
                  disabled={isPending || !isFormValid || !hasChanges}
                  isLoading={isPending}
                />
              </div>

              <div className="w-full sm:w-25">
                <FormButton
                  title={t('adminDashboard.common.back')}
                  isInvert={false}
                  onClick={onClose}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalOverlay>
  );
};

export default MediaFormModal;
