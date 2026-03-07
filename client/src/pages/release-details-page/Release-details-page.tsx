import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ReleaseAPI } from "../../api/release/release-api";
import Loader from "../../components/utils/Loader.tsx";
import useNavigationPath from "../../hooks/use-navigation-path";
import { releasesKeys } from "../../query-keys/releases-keys.ts";
import authStore from "../../stores/auth-store.ts";
import { ReleaseTypesEnum } from "../../types/release";
import ReleaseDetailsAlbumValue from "./ui/release-details-album-value/Release-details-album-value.tsx";
import ReleaseDetailsAuthorComments from "./ui/release-details-author-comments/Release-details-author-comments.tsx";
import ReleaseDetailsEstimation from "./ui/release-details-estimation/Release-details-estimation.tsx";
import ReleaseDetailsHeader from "./ui/Release-details-header.tsx";
import ReleaseDetailsMedia from "./ui/release-details-media/Release-details-media.tsx";
import ReleaseDetailsReviews from "./ui/release-details-reviews/Release-details-reviews.tsx";
import SendAuthorCommentForm from "./ui/send-author-comment-form/Send-author-comment-form.tsx";

const ReleaseDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { navigateToMain } = useNavigationPath();

  const { data: release, isPending: isReleaseLoading } = useQuery({
    queryKey: id ? releasesKeys.details(id) : releasesKeys.details("unknown"),
    queryFn: () => (id ? ReleaseAPI.fetchById(id) : Promise.resolve(undefined)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!release && !isReleaseLoading) {
      navigate(navigateToMain);
    }
  }, [isReleaseLoading, navigate, navigateToMain, release]);

  if (!id) {
    navigate(navigateToMain);
    return <></>;
  }

  const registeredAuthorIds = authStore.user
    ? authStore.user.registeredAuthor.map((ra) => ra.authorId)
    : [];

  const isUserAuthor =
    release?.authors.artists?.some((ra) =>
      registeredAuthorIds.includes(ra.id),
    ) ||
    release?.authors.producers?.some((rp) =>
      registeredAuthorIds.includes(rp.id),
    ) ||
    release?.authors.designers?.some((rd) =>
      registeredAuthorIds.includes(rd.id),
    );

  if (isReleaseLoading) {
    return (
      <div className="w-full">
        <Loader className={"mx-auto size-20 border-white"} />
      </div>
    );
  }

  return (
    release && (
      <>
        <ReleaseDetailsHeader release={release} />

        {release.releaseType.type === ReleaseTypesEnum.ALBUM && (
          <ReleaseDetailsAlbumValue releaseId={release.id} />
        )}

        <ReleaseDetailsMedia releaseId={release.id} />

        <ReleaseDetailsAuthorComments releaseId={release.id} />

        {isUserAuthor ? (
          <SendAuthorCommentForm releaseId={release.id} />
        ) : (
          <ReleaseDetailsEstimation release={release} />
        )}

        <ReleaseDetailsReviews releaseId={id} />
      </>
    )
  );
};

export default ReleaseDetailsPage;
