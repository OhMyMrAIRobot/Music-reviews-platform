import { FC } from "react";
import { Link } from "react-router";
import useNavigationPath from "../../../hooks/use-navigation-path";
import { AuthorLike } from "../../../types/review";

interface IProps {
  authorLike: AuthorLike;
}

const AuthorLikeCardHeader: FC<IProps> = ({ authorLike }) => {
  const { navigatoToProfile, navigateToReleaseDetails } = useNavigationPath();

  return (
    <div className="relative py-1 px-1.5">
      <div className="relative flex items-center w-full">
        <div className="relative flex items-center">
          <Link
            to={navigatoToProfile(authorLike.review.user.id)}
            className="absolute inset-0"
          />
          <img
            loading="lazy"
            decoding="async"
            alt={authorLike.review.user.nickname}
            src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
              authorLike.review.user.avatar === ""
                ? import.meta.env.VITE_DEFAULT_AVATAR
                : authorLike.review.user.avatar
            }`}
            className="shrink-0 size-10 lg:size-14 border border-white/10 rounded-full object-cover"
          />

          <span className="ml-2.5 text-sm max-w-30 text-ellipsis font-medium whitespace-nowrap overflow-hidden">
            {authorLike.review.user.nickname}
          </span>
        </div>

        <Link
          to={navigateToReleaseDetails(authorLike.release.id)}
          className="ml-auto z-100"
        >
          <img
            loading="lazy"
            decoding="async"
            alt={authorLike.release.title}
            src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
              authorLike.release.img === ""
                ? import.meta.env.VITE_DEFAULT_COVER
                : authorLike.release.img
            }`}
            className="size-11.5 rounded-md object-cover aspect-square"
          />
        </Link>
      </div>
    </div>
  );
};

export default AuthorLikeCardHeader;
