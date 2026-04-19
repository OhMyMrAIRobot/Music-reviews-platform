import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  file: File | null;
  className?: string;
}

const SelectedImageLabel: FC<IProps> = ({ file, className }) => {
  const { t } = useTranslation();
  return (
    <span
      className={`block text-sm font-medium text-nowrap select-none truncate ${
        file ? 'text-green-500/80' : 'text-red-500/80'
      } ${className}`}
    >
      {file
        ? t('pages.editProfile.selectedImage', { name: file.name })
        : t('pages.editProfile.noImageSelected')}
    </span>
  );
};

export default SelectedImageLabel;
