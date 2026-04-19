import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewUser } from '../../../types/review';

interface IProps {
  user: ReviewUser;
}

const ReviewAuthor: FC<IProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 justify-center">
      <span className="text-sm lg:text-lg font-semibold block items-center max-w-35 text-ellipsis overflow-hidden whitespace-nowrap">
        {user.nickname}
      </span>
      {user.rank && (
        <span className="ml-1 text-center w-fit text-[12px] rounded-full font-bold bg-red-500 text-white px-1.5 shadow-lg shadow-red-600/50">
          {t('review.author.topRank', { rank: user.rank })}
        </span>
      )}
    </div>
  );
};

export default ReviewAuthor;
