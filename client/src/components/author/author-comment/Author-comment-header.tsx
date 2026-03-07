import { FC } from "react";
import { Link } from "react-router";
import useNavigationPath from "../../../hooks/use-navigation-path";
import { AuthorComment } from "../../../types/author";
import ReviewAuthor from "../../review/review-card/Review-author";
import ReviewUserImage from "../../review/review-card/Review-user-image";
import RegisteredAuthorGivenLikes from "../registered-author/Registered-author-given-likes";
import RegisteredAuthorTypes from "../registered-author/Registered-author-types";
import RegisteredAuthorWrittenComments from "../registered-author/Registered-author-written-comments";

interface IProps {
  comment: AuthorComment;
  showRelease?: boolean;
}

const AuthorCommentHeader: FC<IProps> = ({ comment, showRelease = false }) => {
  const { navigatoToProfile, navigateToReleaseDetails } = useNavigationPath();

  return (
    <div className="bg-white/7 p-2 rounded-[12px] flex w-full items-center">
      <div className="flex items-center gap-x-3 w-full">
        <Link to={navigatoToProfile(comment.user.id)}>
          <ReviewUserImage user={comment.user} />
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            to={navigatoToProfile(comment.user.id)}
            className="text-sm lg:text-lg font-semibold max-w-42 text-ellipsis whitespace-nowrap overflow-hidden"
          >
            <ReviewAuthor user={comment.user} />
          </Link>
          <RegisteredAuthorTypes
            className={"size-5"}
            types={comment.author.type}
          />
          <RegisteredAuthorGivenLikes
            count={comment.author.totalAuthorLikes}
            iconClassname="size-5"
          />
          <RegisteredAuthorWrittenComments
            count={comment.author.totalComments}
            iconClassname="size-5"
          />
        </div>
      </div>

      {showRelease && (
        <Link
          to={navigateToReleaseDetails(comment.release.id)}
          className="shrink-0 size-10 lg:size-11 rounded-md z-10 block"
        >
          <img
            loading="lazy"
            decoding="async"
            alt={comment.release.id}
            src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
              comment.release.img === ""
                ? import.meta.env.VITE_DEFAULT_COVER
                : comment.release.img
            }`}
            className="size-full aspect-square rounded-md"
          />
        </Link>
      )}
    </div>
  );
};

export default AuthorCommentHeader;
