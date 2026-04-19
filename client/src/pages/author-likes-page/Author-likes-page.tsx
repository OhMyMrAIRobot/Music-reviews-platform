import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserFavReviewAPI } from '../../api/review/user-fav-review-api';
import AuthorLikeCard from '../../components/author/author-like/Author-like-card';
import AuthorLikeColorSvg from '../../components/author/author-like/svg/Author-like-color-svg';
import Pagination from '../../components/pagination/Pagination';
import { authorLikesKeys } from '../../query-keys/author-likes-keys';
import { AuthorLikesQuery } from '../../types/review';

const limit = 9;

const AuthorLikesPage = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const query: AuthorLikesQuery = {
    limit,
    offset: (currentPage - 1) * limit,
  };

  const { data, isPending } = useQuery({
    queryKey: authorLikesKeys.list(query),
    queryFn: () => UserFavReviewAPI.findAuthorLikes(query),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];
  const totalCount = data?.meta.count ?? 0;

  return (
    <>
      <div className="flex items-center gap-x-2.5">
        <AuthorLikeColorSvg className="size-8" />
        <h1 id="author-likes" className="text-2xl lg:text-3xl font-semibold">
          {t('pages.authorLikes.title')}
        </h1>
      </div>

      <section className="mt-5 py-2">
        <div className="gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1">
          {isPending
            ? Array.from({ length: limit }).map((_, idx) => (
                <AuthorLikeCard
                  key={`Skeleton-author-like-${idx}`}
                  isLoading={true}
                />
              ))
            : items.map((like) => (
                <div
                  className="overflow-hidden"
                  key={`${like.author.id}-${like.review.user.id}-${like.release.id}`}
                >
                  <AuthorLikeCard authorLike={like} isLoading={false} />
                </div>
              ))}

          {items.length === 0 && !isPending && (
            <p className="text-center text-2xl font-semibold mt-10 w-full absolute">
              {t('pages.authorLikes.notFound')}
            </p>
          )}
        </div>
      </section>

      {items.length > 0 && (
        <div className="mt-20">
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={limit}
            setCurrentPage={setCurrentPage}
            idToScroll={'author-likes'}
          />
        </div>
      )}
    </>
  );
};

export default AuthorLikesPage;
