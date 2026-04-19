import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormButton from '../../../../components/form-elements/Form-button';
import { useUpdateProfileMutation } from '../../../../hooks/mutations';
import { useAuth } from '../../../../hooks/use-auth';
import { useStore } from '../../../../hooks/use-store';
import buildProfileFormData from '../../../../utils/build-profile-form-data';
import EditProfilePageSection from '../Edit-profile-page-section';
import SelectImageLabel from '../labels/Select-image-label';
import SelectedImageLabel from '../labels/Selected-image-label';

const UploadAvatarForm = observer(() => {
  const { t } = useTranslation();
  const { authStore, notificationStore } = useStore();
  const { checkAuth } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /**
   * Function to handle file input change
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the file input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  const onSuccess = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  /**
   * Upload avatar mutation
   */
  const { mutateAsync: uploadAsync, isPending: isUploading } =
    useUpdateProfileMutation({ onSuccess });

  /**
   * Delete avatar mutation
   */
  const { mutateAsync: deleteAsync, isPending: isDeleting } =
    useUpdateProfileMutation({ onSuccess });

  /**
   * Indicates if any mutation is in progress
   *
   * @returns {boolean} True if any mutation is pending, false otherwise
   */
  const isPending = useMemo(
    () => isUploading || isDeleting,
    [isUploading, isDeleting]
  );

  /**
   * Handle form submission for uploading avatar
   */
  const handleSubmit = async () => {
    if (!checkAuth() || isPending) return;

    if (!file) {
      notificationStore.addErrorNotification(
        t('pages.editProfile.pickImageError')
      );
      return;
    }
    const formData = buildProfileFormData({ avatar: file });

    return uploadAsync(formData);
  };

  /**
   * Handle avatar deletion
   */
  const handleDelete = async () => {
    if (!checkAuth() || isPending) return;
    const formData = buildProfileFormData({ clearAvatar: true });
    return deleteAsync(formData);
  };

  return (
    <EditProfilePageSection title={t('pages.editProfile.avatar')}>
      <div className="w-full sm:w-[250px]">
        <div className="w-full">
          <SelectImageLabel htmlfor="avatar" />
        </div>

        <input
          onChange={handleFileChange}
          className="hidden"
          id="avatar"
          accept="image/*"
          type="file"
        />
        <SelectedImageLabel file={file} className="mt-1" />
      </div>

      <div className="relative size-36 rounded-full overflow-hidden select-none">
        <img
          alt="avatar"
          loading="lazy"
          decoding="async"
          src={
            previewUrl ||
            `${import.meta.env.VITE_SERVER_URL}/public/avatars/${
              authStore.profile?.avatar === ''
                ? import.meta.env.VITE_DEFAULT_AVATAR
                : authStore.profile?.avatar
            }`
          }
          className="aspect-square object-cover size-full"
        />
      </div>

      <div className="pt-3 lg:pt-6 border-t border-white/5 w-full">
        <div className="grid grid-cols-1 sm:flex justify-between gap-2 w-full">
          <div className="w-full sm:w-38">
            <FormButton
              title={
                isUploading
                  ? t('pages.editProfile.saving')
                  : t('pages.editProfile.save')
              }
              isInvert={true}
              onClick={handleSubmit}
              disabled={!file || isPending}
              isLoading={isUploading}
            />
          </div>

          <div className="w-full sm:w-42">
            <FormButton
              title={
                isDeleting
                  ? t('pages.editProfile.deleting')
                  : t('pages.editProfile.removeAvatar')
              }
              isInvert={false}
              onClick={handleDelete}
              disabled={authStore.profile?.avatar === '' || isPending}
              isLoading={isDeleting}
            />
          </div>
        </div>
      </div>
    </EditProfilePageSection>
  );
});

export default UploadAvatarForm;
