import { FC } from "react";
import { ReviewUser } from "../../../types/review";
import { getLevelConfig, getUserLevel } from "../../../utils/user-level";
import Tooltip from "../../tooltip/Tooltip";
import TooltipSpan from "../../tooltip/Tooltip-span";

interface IProps {
  user: ReviewUser;
}

const ReviewUserImage: FC<IProps> = ({ user }) => {
  const level = getUserLevel(user.points);

  return (
    <div className="relative">
      <img
        loading="lazy"
        decoding="async"
        alt={user.nickname}
        src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
          user.avatar === "" ? import.meta.env.VITE_DEFAULT_AVATAR : user.avatar
        }`}
        className="rounded-full border border-white/10 min-w-10 size-10 lg:size-11 cursor-pointer aspect-square object-cover"
      />
      {level && (
        <TooltipSpan
          tooltip={
            <Tooltip>{`${getLevelConfig(level).name} пользователя`}</Tooltip>
          }
          spanClassName="text-white cursor-pointer absolute -bottom-1.5 -right-2.5"
          centered={true}
        >
          <img
            alt={"level"}
            src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
              getLevelConfig(level).image
            }`}
            className="size-7 "
          />
        </TooltipSpan>
      )}
    </div>
  );
};

export default ReviewUserImage;
