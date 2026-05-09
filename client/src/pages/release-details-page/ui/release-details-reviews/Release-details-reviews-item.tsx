import { useMutation } from '@tanstack/react-query';
import { Languages } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ReviewAPI } from '../../../../api/review/review-api';
import ReviewAuthor from '../../../../components/review/review-card/Review-author';
import ReviewLikes from '../../../../components/review/review-card/Review-likes';
import ReviewMarks from '../../../../components/review/review-card/Review-marks';
import ReviewUserImage from '../../../../components/review/review-card/Review-user-image';
import SkeletonLoader from '../../../../components/utils/Skeleton-loader';
import { useToggleFavReview } from '../../../../hooks/mutations/toggle-fav/use-toggle-fav-review';
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler';
import useNavigationPath from '../../../../hooks/use-navigation-path';
import { useStore } from '../../../../hooks/use-store';
import { Review } from '../../../../types/review';
import { TranslatedReview } from '../../../../types/review/entities/translated-review';
import { ReviewLanguagesEnum } from '../../../../types/review/enums/review-languages-enum';
import { formatDateTime } from '../../../../utils/date';
import { detectReviewLanguage } from '../../../../utils/review';

interface IProps {
  review?: Review;
  isLoading: boolean;
}

const ReleaseDetailsReviewsItem: FC<IProps> = observer(
  ({ review, isLoading }) => {
    const { t } = useTranslation();
    const { authStore } = useStore();
    const handleApiError = useApiErrorHandler();
    const isFav =
      review?.userFavReview?.some(
        (item) => item.userId === authStore.user?.id
      ) ?? false;

    const [translation, setTranslation] = useState<TranslatedReview | null>(
      null
    );
    const [showTranslated, setShowTranslated] = useState(false);

    const { from, to } = useMemo(() => {
      if (!review) {
        return {
          from: ReviewLanguagesEnum.EN,
          to: ReviewLanguagesEnum.RU,
        };
      }
      const detected = detectReviewLanguage(review.title, review.text);
      const target =
        detected === ReviewLanguagesEnum.RU
          ? ReviewLanguagesEnum.EN
          : ReviewLanguagesEnum.RU;
      return { from: detected, to: target };
    }, [review]);

    useEffect(() => {
      setTranslation(null);
      setShowTranslated(false);
    }, [review?.id]);

    const translateMutation = useMutation({
      mutationFn: () => ReviewAPI.translateReview(review!.id, from, to),
      onSuccess: (data) => {
        setTranslation(data);
        setShowTranslated(true);
      },
      onError: (error: unknown) => {
        handleApiError(error, t('releaseDetails.reviews.translateError'));
      },
    });

    /** HOOKS */
    const { navigatoToProfile } = useNavigationPath();
    const { toggleFav, toggling } = useToggleFavReview(review, isFav);

    const displayTitle =
      showTranslated && translation
        ? translation.title || review?.title
        : review?.title;
    const displayText =
      showTranslated && translation
        ? translation.text || review?.text
        : review?.text;

    const translateAriaLabel = !translation
      ? to === ReviewLanguagesEnum.EN
        ? t('releaseDetails.reviews.translateToEn')
        : t('releaseDetails.reviews.translateToRu')
      : showTranslated
        ? t('releaseDetails.reviews.showOriginal')
        : t('releaseDetails.reviews.showTranslation');

    const onTranslateClick = () => {
      if (!review || translateMutation.isPending) return;
      if (!translation) {
        translateMutation.mutate();
        return;
      }
      setShowTranslated((v) => !v);
    };

    return isLoading ? (
      <SkeletonLoader className="w-full h-70 rounded-[15px] lg:rounded-[20px]" />
    ) : (
      review && (
        <div className="relative w-full bg-zinc-900 p-1.5 lg:p-[5px] flex flex-col border border-zinc-800 rounded-[15px] lg:rounded-[20px]">
          <div className="bg-zinc-950/70 px-2 py-2 rounded-[12px] flex gap-3 justify-between items-center select-none">
            <Link
              to={navigatoToProfile(review.user.id)}
              className="flex items-center space-x-2 lg:space-x-3"
            >
              <ReviewUserImage user={review.user} />
              <ReviewAuthor user={review.user} />
            </Link>
            <ReviewMarks values={review.values} />
          </div>
          <div className="px-1.5">
            <h5 className="text-base lg:text-lg mt-3 font-semibold break-words">
              {displayTitle}
            </h5>
            <p className="text-sm lg:text-lg font-light mt-2 break-words">
              {displayText}
            </p>
            <div className="text-xs opacity-60 mt-1">
              {formatDateTime(review.createdAt)}
            </div>
            <div className="mt-3 mb-2 flex justify-between items-center gap-2">
              <ReviewLikes
                toggling={toggling}
                isLiked={isFav}
                likesCount={review.userFavReview.length}
                authorLikes={review.authorFavReview}
                toggleFavReview={toggleFav}
              />
              <button
                type="button"
                title={translateAriaLabel}
                aria-label={translateAriaLabel}
                disabled={translateMutation.isPending}
                onClick={onTranslateClick}
                className={`cursor-pointer shrink-0 size-10 lg:size-11 rounded-xl flex items-center justify-center transition-all duration-200 border backdrop-blur-sm
                  bg-gradient-to-br from-zinc-800/95 to-zinc-950/90 border-white/[0.08] text-white/90 shadow-[0_0_20px_-4px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:border-white/[0.14] hover:scale-[1.03] active:scale-[0.98]
                  disabled:pointer-events-none disabled:opacity-40 ${
                    showTranslated && translation
                      ? 'border-white/25 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
                      : ''
                  }`}
              >
                <Languages
                  className={`size-[1.125rem] lg:size-5 ${translateMutation.isPending ? 'animate-pulse' : ''}`}
                  strokeWidth={1.85}
                />
              </button>
            </div>
          </div>
        </div>
      )
    );
  }
);

export default ReleaseDetailsReviewsItem;
