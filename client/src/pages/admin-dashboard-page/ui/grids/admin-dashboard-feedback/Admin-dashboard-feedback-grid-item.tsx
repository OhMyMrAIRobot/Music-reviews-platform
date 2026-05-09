import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FeedbackStatusIcon from '../../../../../components/feedback/Feedback-status-icon';
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg';
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal';
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader';
import { useAdminRemoveFeedbackMutation } from '../../../../../hooks/mutations';
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum';
import { SortOrder } from '../../../../../types/common/types/sort-order';
import { Feedback } from '../../../../../types/feedback';
import { translateFeedbackAdminStatus } from '../../../../../utils/admin/translate-feedback-status';
import { getFeedbackStatusColor } from '../../../../../utils/get-feedback-status-color';
import { formatDateTime } from '../../../../../utils/date';
import AdminDeleteButton from '../../buttons/Admin-delete-button';
import AdminOpenButton from '../../buttons/Admin-open-button';
import FeedbackFormModal from './Feedback-form-modal';

interface IProps {
  className?: string;
  feedback?: Feedback;
  position?: number;
  isLoading: boolean;
  order?: SortOrder;
  toggleOrder?: () => void;
  isDeleteLoading?: boolean;
}

const AdminDashboardFeedbackGridItem: FC<IProps> = ({
  className = '',
  feedback,
  position,
  isLoading,
  order,
  toggleOrder,
}) => {
  const { t } = useTranslation();
  const [confModalOpen, setConfModalOpen] = useState<boolean>(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);

  const { mutateAsync, isPending } = useAdminRemoveFeedbackMutation({
    onSettled() {
      setConfModalOpen(false);
    },
  });

  return isLoading ? (
    <SkeletonLoader className="w-full xl:h-12 rounded-lg" />
  ) : (
    <>
      {feedback && (
        <>
          {confModalOpen && (
            <ConfirmationModal
              title={t('adminDashboard.feedback.deleteConfirm')}
              isOpen={confModalOpen}
              onConfirm={() => mutateAsync(feedback.id)}
              onCancel={() => setConfModalOpen(false)}
              isLoading={isPending}
            />
          )}

          {detailsModalOpen && (
            <FeedbackFormModal
              isOpen={detailsModalOpen}
              onClose={() => setDetailsModalOpen(false)}
              feedback={feedback}
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

        <div className="xl:col-span-2 text-ellipsis line-clamp-1 mr-2">
          <span className="xl:hidden">Email: </span>
          {feedback?.email ?? 'Email'}
        </div>

        <div className="xl:col-span-2 text-ellipsis text-wrap ">
          {feedback ? (
            <>
              <span className="xl:hidden">
                {t('adminDashboard.feedback.sentAtMobile')}
              </span>
              <span>{formatDateTime(feedback.createdAt)}</span>
            </>
          ) : (
            <button
              onClick={toggleOrder}
              className="cursor-pointer hover:text-white flex items-center gap-x-1.5"
            >
              <span>{t('adminDashboard.feedback.sentAt')}</span>
              <ArrowBottomSvg
                className={`size-3 ${
                  order === SortOrdersEnum.ASC ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        <div className="xl:col-span-2 flex gap-x-1 items-center text-ellipsis line-clamp-1 ">
          {feedback ? (
            <>
              <span className="xl:hidden">
                {t('adminDashboard.feedback.statusMobile')}
              </span>
              <div
                className={`flex gap-x-1 items-center ${getFeedbackStatusColor(
                  feedback.feedbackStatus.status
                )}`}
              >
                <FeedbackStatusIcon
                  status={feedback.feedbackStatus.status}
                  className="size-5"
                />
                <span>
                  {translateFeedbackAdminStatus(
                    t,
                    feedback.feedbackStatus.status
                  )}
                </span>
              </div>
            </>
          ) : (
            <span>{t('adminDashboard.common.status')}</span>
          )}
        </div>

        <div className="xl:col-span-2  line-clamp-2 overflow-hidden text-ellipsis text-wrap mr-2">
          {feedback ? (
            <>
              <span className="xl:hidden">
                {t('adminDashboard.feedback.titleMobile')}
              </span>
              <span>{feedback.title}</span>
            </>
          ) : (
            <span>{t('adminDashboard.common.title')}</span>
          )}
        </div>

        <div className="xl:col-span-2  line-clamp-2 overflow-hidden text-ellipsis text-wrap">
          {feedback ? (
            <>
              <span className="xl:hidden">
                {t('adminDashboard.feedback.textMobile')}
              </span>
              <span>{feedback.message}</span>
            </>
          ) : (
            <span>{t('adminDashboard.common.text')}</span>
          )}
        </div>

        <div className="xl:col-span-1 max-xl:mt-1">
          {feedback ? (
            <div className="flex gap-x-3 xl:justify-end">
              <AdminOpenButton onClick={() => setDetailsModalOpen(true)} />
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

export default AdminDashboardFeedbackGridItem;
