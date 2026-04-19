import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg';
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal';
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader';
import { useAdminRemoveAuthorCommentMutation } from '../../../../../hooks/mutations';
import useNavigationPath from '../../../../../hooks/use-navigation-path';
import { AuthorComment } from '../../../../../types/author';
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum';
import { SortOrder } from '../../../../../types/common/types/sort-order';
import AdminDeleteButton from '../../buttons/Admin-delete-button';
import AdminOpenButton from '../../buttons/Admin-open-button';
import AuthorCommentFormModal from './Author-comment-form-modal';

interface IProps {
  className?: string;
  comment?: AuthorComment;
  isLoading: boolean;
  position?: number;
  order?: SortOrder;
  toggleOrder?: () => void;
}

const AdminDashboardAuthorCommentsGridItem: FC<IProps> = ({
  className = '',
  comment,
  isLoading,
  position,
  order,
  toggleOrder,
}) => {
  const { t } = useTranslation();
  const { navigateToReleaseDetails, navigatoToProfile } = useNavigationPath();

  const { mutateAsync, isPending } = useAdminRemoveAuthorCommentMutation({
    onSettled: () => {
      setConfModalOpen(false);
    },
  });

  const [confModalOpen, setConfModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  return isLoading ? (
    <SkeletonLoader className="w-full h-75 xl:h-12 rounded-lg" />
  ) : (
    <>
      {comment && (
        <>
          {confModalOpen && (
            <ConfirmationModal
              title={t('adminDashboard.authorComments.deleteConfirm')}
              isOpen={confModalOpen}
              onConfirm={() => mutateAsync(comment.id)}
              onCancel={() => setConfModalOpen(false)}
              isLoading={isPending}
            />
          )}

          {editModalOpen && (
            <AuthorCommentFormModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              comment={comment}
            />
          )}
        </>
      )}

      <div
        className={`${className} text-sm font-medium xl:h-12 w-full rounded-lg grid grid-rows-7 xl:grid-rows-1 xl:grid-cols-12 items-center px-3 max-xl:py-2 border border-white/10 text-nowrap`}
      >
        <div className="xl:col-span-1 text-ellipsis line-clamp-1">
          <span className="xl:hidden"># </span>
          {position ?? '#'}
        </div>

        <div className="xl:col-span-2 h-full flex items-center mr-2">
          {comment ? (
            <Link
              to={navigatoToProfile(comment.user.id)}
              className="flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full"
            >
              <img
                loading="lazy"
                decoding="async"
                src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
                  comment.user.avatar === ''
                    ? import.meta.env.VITE_DEFAULT_AVATAR
                    : comment.user.avatar
                }`}
                alt={comment.user.nickname}
                className="max-xl:hidden size-9 object-cover aspect-square rounded-full select-none"
              />
              <span className="xl:hidden">
                {t('adminDashboard.authorComments.authorMobile')}
              </span>
              <span className="line-clamp-2 max-xl:underline underline-offset-4 overflow-hidden text-ellipsis text-wrap">
                {comment.user.nickname}
              </span>
            </Link>
          ) : (
            <span className="px-2">
              {t('adminDashboard.authorComments.author')}
            </span>
          )}
        </div>

        <div className="xl:col-span-2 h-full flex items-center mr-2">
          {comment ? (
            <Link
              to={navigateToReleaseDetails(comment.release.id)}
              className="flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full"
            >
              <img
                loading="lazy"
                decoding="async"
                src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
                  comment.release.img === ''
                    ? import.meta.env.VITE_DEFAULT_COVER
                    : comment.release.img
                }`}
                alt={comment.release.title}
                className="max-xl:hidden size-9 object-cover aspect-square rounded-full select-none"
              />
              <span className="xl:hidden">
                {t('adminDashboard.authorComments.releaseMobile')}
              </span>
              <span className="line-clamp-2 max-xl:underline underline-offset-4 overflow-hidden text-ellipsis text-wrap">
                {comment.release.title}
              </span>
            </Link>
          ) : (
            <span className="px-2">
              {t('adminDashboard.authorComments.release')}
            </span>
          )}
        </div>

        <div className="xl:col-span-2 text-ellipsis text-wrap xl:">
          {comment ? (
            <>
              <span className="xl:hidden">
                {t('adminDashboard.authorComments.publishedAtMobile')}
              </span>
              <span>{comment.createdAt}</span>
            </>
          ) : (
            <button
              onClick={toggleOrder}
              className="cursor-pointer hover:text-white flex items-center gap-x-1.5"
            >
              <span>{t('adminDashboard.authorComments.publishedAt')}</span>
              <ArrowBottomSvg
                className={`size-3 ${
                  order === SortOrdersEnum.ASC ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        <div className="xl:col-span-2 line-clamp-2 overflow-hidden text-ellipsis text-wrap mr-2">
          {comment ? (
            <>
              <span className="xl:hidden">
                {t('adminDashboard.authorComments.titleMobile')}
              </span>
              <span>{comment.title}</span>
            </>
          ) : (
            <span>{t('adminDashboard.authorComments.headline')}</span>
          )}
        </div>

        <div className="xl:col-span-2 line-clamp-2 overflow-hidden text-ellipsis text-wrap">
          {comment ? (
            <>
              <span className="xl:hidden">
                {t('adminDashboard.authorComments.commentMobile')}
              </span>
              <span>{comment.text}</span>
            </>
          ) : (
            <span>{t('adminDashboard.authorComments.commentLabel')}</span>
          )}
        </div>

        <div className="xl:col-span-1 max-xl:mt-1">
          {comment ? (
            <div className="flex gap-x-3 xl:justify-end">
              <AdminOpenButton
                onClick={() => {
                  setEditModalOpen(true);
                }}
              />
              <AdminDeleteButton onClick={() => setConfModalOpen(true)} />
            </div>
          ) : (
            t('adminDashboard.common.action')
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardAuthorCommentsGridItem;
