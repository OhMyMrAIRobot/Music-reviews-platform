import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BookmarkSvg from '../svg/Bookmark-svg';
import Tooltip from '../tooltip/Tooltip';
import TooltipSpan from '../tooltip/Tooltip-span';

interface IProps {
  count: number;
  className?: string;
}

const LikesCount: FC<IProps> = ({ count, className = '' }) => {
  const { t } = useTranslation();

  return (
    <TooltipSpan
      tooltip={<Tooltip>{t('utils.likesTooltip')}</Tooltip>}
      spanClassName="text-white relative"
      centered={true}
    >
      <div className="flex gap-x-1 items-center justify-center font-medium">
        <BookmarkSvg className={`${className} fill-[rgba(35,101,199,1)]`} />
        <span>{count}</span>
      </div>
    </TooltipSpan>
  );
};

export default LikesCount;
