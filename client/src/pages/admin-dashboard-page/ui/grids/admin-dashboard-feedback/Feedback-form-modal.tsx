import { useQuery } from '@tanstack/react-query';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeedbackReplyAPI } from '../../../../../api/feedback/feedback-reply-api';
import FormButton from '../../../../../components/form-elements/Form-button';
import FormLabel from '../../../../../components/form-elements/Form-label';
import FormTextbox from '../../../../../components/form-elements/Form-textbox';
import ModalOverlay from '../../../../../components/modals/Modal-overlay';
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader';
import { useFeedbackMeta } from '../../../../../hooks/meta';
import {
  useAdminCreateFeedbackReplyMutation,
  useAdminUpdateFeedbackMutation,
} from '../../../../../hooks/mutations';
import { useStore } from '../../../../../hooks/use-store';
import { feedbackKeys } from '../../../../../query-keys/feedback-keys';
import {
  CreateFeedbackReplyData,
  Feedback,
  FeedbackReply,
  FeedbackStatusesEnum,
} from '../../../../../types/feedback';
import { translateFeedbackAdminStatus } from '../../../../../utils/admin/translate-feedback-status';
import { constraints } from '../../../../../utils/constraints';
import { getFeedbackStatusColor } from '../../../../../utils/get-feedback-status-color';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback;
}

const FeedbackFormModal: FC<IProps> = ({ isOpen, onClose, feedback }) => {
  const { t } = useTranslation();
  const { notificationStore } = useStore();
  const { statuses, isLoading: isMetaLoading } = useFeedbackMeta();

  const [reply, setReply] = useState<FeedbackReply | null>(null);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  /**
   * Query to get the reply for the feedback
   */
  const { data: replyData, isPending: isReplyLoading } = useQuery({
    queryKey: feedbackKeys.reply(feedback.id),
    queryFn: () => FeedbackReplyAPI.findByFeedbackId(feedback.id),
    enabled:
      isOpen &&
      feedback.feedbackStatus.status === FeedbackStatusesEnum.ANSWERED,
    staleTime: 1000 * 60 * 5,
  });

  /**
   * Mutation to update a feedback status
   */
  const { mutateAsync: updateStatusMutation, isPending: isStatusUpdating } =
    useAdminUpdateFeedbackMutation();

  /**
   * Mutation to create a reply for the feedback
   */
  const { mutateAsync: createReplyMutation, isPending: isReplyCreating } =
    useAdminCreateFeedbackReplyMutation();

  const createReply = (replyData: CreateFeedbackReplyData) => {
    return createReplyMutation(replyData, {
      onSuccess(data) {
        setReply(data);
        setShowReply(false);
        setReplyText('');
        onClose();
      },
    });
  };

  /**
   * Handler to update the feedback status to "READ"
   */
  const updateReadStatus = () => {
    if (feedback.feedbackStatus.status !== FeedbackStatusesEnum.NEW) {
      notificationStore.addErrorNotification(
        t('adminDashboard.feedback.cannotMarkRead')
      );
      return;
    }

    const newStatus = statuses.find(
      (entry) => entry.status === FeedbackStatusesEnum.READ
    );

    if (newStatus) {
      return updateStatusMutation({
        feedbackId: feedback.id,
        statusId: newStatus.id,
      });
    }
  };

  /**
   * Handler to post a reply to the feedback
   */
  const postReply = () => {
    if (
      reply ||
      replyText.trim().length < constraints.feedback.replyMinLength ||
      replyText.trim().length > constraints.feedback.replyMaxLength
    )
      return;

    createReply({
      message: replyText,
      feedbackId: feedback.id,
    });
  };

  /** EFFECTS */
  useEffect(() => {
    setReply(null);
    setReplyText('');
    if (feedback.feedbackStatus.status === FeedbackStatusesEnum.ANSWERED) {
      setReply(replyData || null);
    }
  }, [feedback, replyData]);

  const modalTitle = useMemo(() => {
    if (!showReply) return t('adminDashboard.feedback.modalViewingMessage');
    if (!reply) return t('adminDashboard.feedback.modalComposingReply');
    return t('adminDashboard.feedback.modalViewingReply');
  }, [showReply, reply, t]);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onCancel={onClose}
      isLoading={isStatusUpdating || isReplyCreating}
      className="max-lg:size-full"
    >
      {isReplyLoading &&
      feedback.feedbackStatus.status === FeedbackStatusesEnum.ANSWERED ? (
        <SkeletonLoader className="w-240 h-148 rounded-xl" />
      ) : (
        <div
          className={`relative rounded-xl w-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6 max-h-full overflow-y-scroll`}
        >
          <h1 className="border-b border-white/10 text-3xl font-bold py-4 text-center">
            {modalTitle}
          </h1>
          {!(showReply && !reply) && (
            <div className="border-b border-white/10 px-6 py-4 flex gap-2 w-full flex-col font-medium h-38">
              {!showReply && (
                <h6 className="line-clamp-1">{`Email: ${feedback.email}`}</h6>
              )}
              {!showReply && (
                <h6 className="break-words">
                  {t('adminDashboard.feedback.titleWithValue', {
                    value: feedback.title,
                  })}
                </h6>
              )}
              {showReply ? (
                reply && (
                  <h6>
                    {t('adminDashboard.feedback.repliedBy', {
                      name:
                        reply.user?.nickname ??
                        t('adminDashboard.common.unknown'),
                    })}
                  </h6>
                )
              ) : (
                <h6>
                  {t('adminDashboard.feedback.statusPrefix')}{' '}
                  <span
                    className={`${getFeedbackStatusColor(
                      feedback.feedbackStatus.status
                    )}`}
                  >
                    {translateFeedbackAdminStatus(
                      t,
                      feedback.feedbackStatus.status
                    )}
                  </span>
                </h6>
              )}

              {showReply ? (
                reply && (
                  <h6 className="break-words">
                    {t('adminDashboard.feedback.replyDate', {
                      value: reply.createdAt,
                    })}
                  </h6>
                )
              ) : (
                <h6 className="break-words">
                  {t('adminDashboard.feedback.sentDate', {
                    value: feedback.createdAt,
                  })}
                </h6>
              )}
            </div>
          )}
          {showReply && !reply ? (
            <div className="flex flex-col gap-3 px-6 py-4 h-70 max-h-70">
              <FormLabel
                name={t('adminDashboard.common.replyText')}
                htmlFor={'feedback-reply-textbox'}
                isRequired={true}
              />
              <FormTextbox
                id={'feedback-reply-textbox'}
                placeholder={t('adminDashboard.common.replyPlaceholder')}
                value={replyText}
                setValue={setReplyText}
                className="h-full"
              />
            </div>
          ) : (
            <div className="px-6 py-4 flex gap-10 w-full h-70 max-h-70 overflow-y-scroll font-light">
              <h6 className="break-words w-full">
                <span className="font-bold">
                  {showReply
                    ? t('adminDashboard.feedback.bodyReplyPrefix')
                    : t('adminDashboard.feedback.bodyMessagePrefix')}
                </span>
                {showReply && reply ? reply.message : feedback.message}
              </h6>
            </div>
          )}
          <div className="pt-6 px-6 grid grid-rows-2 sm:flex gap-3 sm:justify-start border-t-1 border-white/10">
            {isMetaLoading ? (
              <SkeletonLoader className="w-full sm:w-35 h-10 rounded-md" />
            ) : (
              <>
                {showReply && !reply ? (
                  <>
                    <div className="w-full sm:w-35">
                      <FormButton
                        title={t('adminDashboard.common.send')}
                        isInvert={true}
                        onClick={postReply}
                        disabled={!replyText.trim() || isReplyCreating}
                        isLoading={isReplyCreating}
                      />
                    </div>
                    <div className="w-full sm:w-25">
                      <FormButton
                        title={t('adminDashboard.common.back')}
                        isInvert={false}
                        onClick={() => {
                          setShowReply(false);
                          setReplyText('');
                        }}
                        disabled={isReplyCreating}
                      />
                    </div>
                  </>
                ) : feedback.feedbackStatus.status ===
                  FeedbackStatusesEnum.NEW ? (
                  <div className="w-full sm:w-35">
                    <FormButton
                      title={t('adminDashboard.common.markRead')}
                      isInvert={true}
                      onClick={updateReadStatus}
                      disabled={
                        feedback.feedbackStatus.status !==
                          FeedbackStatusesEnum.NEW || isStatusUpdating
                      }
                      isLoading={isStatusUpdating}
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-35">
                    <FormButton
                      title={
                        reply
                          ? showReply
                            ? t('adminDashboard.feedback.viewMessage')
                            : t('adminDashboard.feedback.viewReply')
                          : t('adminDashboard.feedback.writeReply')
                      }
                      isInvert={true}
                      onClick={() => setShowReply(!showReply)}
                      disabled={false}
                    />
                  </div>
                )}
              </>
            )}

            <div className="w-full sm:w-25 sm:ml-auto">
              <FormButton
                title={t('adminDashboard.common.close')}
                isInvert={false}
                onClick={onClose}
                disabled={isReplyCreating || isStatusUpdating}
              />
            </div>
          </div>
        </div>
      )}
    </ModalOverlay>
  );
};

export default FeedbackFormModal;
