import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AuthorCommentColorSvg from '../author/author-comment/svg/Author-comment-color-svg';
import AuthorLikeColorSvg from '../author/author-like/svg/Author-like-color-svg';
import Tooltip from '../tooltip/Tooltip';
import TooltipSpan from '../tooltip/Tooltip-span';

interface IProps {
  hasAuthorComments: boolean;
  hasAuthorLikes: boolean;
  className?: string;
}

const ReleaseAuthorActions: FC<IProps> = ({
  hasAuthorComments,
  hasAuthorLikes,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex gap-2 ${className}`}>
      {hasAuthorComments && (
        <TooltipSpan
          tooltip={
            <Tooltip>{t('release.authorActions.commentedTooltip')}</Tooltip>
          }
          spanClassName="text-white cursor-pointer relative"
          centered={true}
        >
          <AuthorCommentColorSvg className={'size-5'} />
        </TooltipSpan>
      )}

      {hasAuthorLikes && (
        <TooltipSpan
          tooltip={
            <Tooltip>{t('release.authorActions.likedReviewsTooltip')}</Tooltip>
          }
          spanClassName="text-white cursor-pointer relative"
          centered={true}
        >
          <AuthorLikeColorSvg className={'size-5'} />
        </TooltipSpan>
      )}
    </div>
  );
};

export default ReleaseAuthorActions;
