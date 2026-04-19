import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../tooltip/Tooltip';
import TooltipSpan from '../../tooltip/Tooltip-span';
import AuthorLikeColorSvg from '../author-like/svg/Author-like-color-svg';

interface IProps {
  count: number;
  iconClassname?: string;
}

const RegisteredAuthorGivenLikes: FC<IProps> = ({
  count,
  iconClassname = '',
}) => {
  const { t } = useTranslation();

  return (
    count > 0 && (
      <TooltipSpan
        tooltip={<Tooltip>{t('author.givenAuthorLikesTooltip')}</Tooltip>}
        spanClassName="text-white relative cursor-pointer flex items-center gap-0.5"
        centered={true}
      >
        <AuthorLikeColorSvg className={iconClassname} />
        <span className="font-bold text-sm">{count}</span>
      </TooltipSpan>
    )
  );
};

export default RegisteredAuthorGivenLikes;
