import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SkeletonLoader from '../../../components/utils/Skeleton-loader';
import { AuthorConfirmation } from '../../../types/author';
import { getAuthorConfirmationStatusColor } from '../../../utils/get-author-confirmation-status-color';

interface IProps {
  isLoading: boolean;
  item?: AuthorConfirmation;
}

const AuthorConfirmationItem: FC<IProps> = ({ isLoading, item }) => {
  const { t } = useTranslation();
  return isLoading || !item ? (
    <SkeletonLoader className={'rounded-lg w-full h-30 lg:h-35'} />
  ) : (
    <div className="w-full rounded-lg border border-white/15 flex flex-col gap-1 p-2  text-sm lg:text-base ">
      <span>
        {t('pages.authorConfirmation.ticket.user')}: {item.user.nickname}
      </span>
      <span>
        {t('pages.authorConfirmation.ticket.author')}: {item.author.name}
      </span>
      <span>
        {t('pages.authorConfirmation.ticket.status')}:{' '}
        <span
          className={`font-medium ${getAuthorConfirmationStatusColor(
            item.status.status
          )}`}
        >
          {item.status.status}
        </span>
      </span>
      <span>
        {t('pages.authorConfirmation.ticket.confirmation')}: {item.confirmation}
      </span>
      <span className="text-sm opacity-50">{item.createdAt}</span>
    </div>
  );
};

export default AuthorConfirmationItem;
