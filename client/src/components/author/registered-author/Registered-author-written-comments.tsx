import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../tooltip/Tooltip';
import TooltipSpan from '../../tooltip/Tooltip-span';
import AuthorCommentColorSvg from '../author-comment/svg/Author-comment-color-svg';

interface IProps {
  count: number;
  iconClassname?: string;
}

const RegisteredAuthorWrittenComments: FC<IProps> = ({
  count,
  iconClassname = '',
}) => {
  const { t } = useTranslation();

  return (
    count > 0 && (
      <TooltipSpan
        tooltip={<Tooltip>{t('author.writtenAuthorCommentsTooltip')}</Tooltip>}
        spanClassName="text-white relative cursor-pointer flex items-center gap-1"
        centered={true}
      >
        <AuthorCommentColorSvg className={iconClassname} />
        <span className="font-bold text-sm">{count}</span>
      </TooltipSpan>
    )
  );
};

export default RegisteredAuthorWrittenComments;
