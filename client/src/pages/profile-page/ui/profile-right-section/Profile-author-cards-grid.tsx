import { useQuery } from '@tanstack/react-query';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { FC } from 'react';
import { AuthorAPI } from '../../../../api/author/author-api';
import AuthorCard from '../../../../components/author/authors-grid/Author-card';
import { authorsKeys } from '../../../../query-keys/authors-keys';
import { AuthorsQuery } from '../../../../types/author';

interface IProps {
  userId: string;
}

const options: EmblaOptionsType = { dragFree: true, align: 'start' };

const ProfileAuthorCardsGrid: FC<IProps> = ({ userId }) => {
  const [emblaRef] = useEmblaCarousel(options);

  const query: AuthorsQuery = {
    onlyRegistered: true,
    userId,
  };

  const { data, isLoading } = useQuery({
    queryKey: authorsKeys.list(query),
    queryFn: () => AuthorAPI.findAll(query),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const authorCards = data?.items || [];

  return (
    <div className="embla w-full">
      <div className="embla__viewport w-full" ref={emblaRef}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-3 w-full">
          {isLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <AuthorCard
                  key={`Skeleton-author-card-${idx}`}
                  isLoading={true}
                />
              ))
            : authorCards?.map((author) => (
                <AuthorCard key={author.id} author={author} isLoading={false} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileAuthorCardsGrid;
