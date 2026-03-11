import { FC } from 'react';
import { AuthorTypesEnum } from '../../../../types/author';
import { Release } from '../../../../types/release';
import ReleaseDetailsAuthorsItem from './Release-details-authors-item';

interface IProps {
  release: Release;
}

const ReleaseDetailsAuthors: FC<IProps> = ({ release }) => {
  return (
    <div className="select-none mt-5 flex flex-wrap justify-center lg:justify-start gap-x-2 lg:gap-x-5 items-center lg:-ml-3">
      {!release.authors.artists.length &&
        !release.authors.producers.length &&
        !release.authors.designers.length && (
          <span className="text-sm opacity-50 font-medium ml-3">
            Автор не указан!
          </span>
        )}

      {release.authors.artists.length > 0 &&
        release.authors.artists.map((artist) => (
          <ReleaseDetailsAuthorsItem
            author={artist}
            type={AuthorTypesEnum.ARTIST}
            key={artist.name}
          />
        ))}

      {release.authors.producers.length > 0 && (
        <div className="flex gap-x-1.5 items-center">
          <span className="opacity-70 font-medium">prod.</span>
          {release.authors.producers.map((producer) => (
            <ReleaseDetailsAuthorsItem
              author={producer}
              type={AuthorTypesEnum.PRODUCER}
              key={producer.name}
            />
          ))}
        </div>
      )}

      {release.authors.designers.length > 0 && (
        <div className="flex gap-x-1.5 items-center">
          <span className="opacity-70 font-medium">cover by</span>
          {release.authors.designers.map((designer) => (
            <ReleaseDetailsAuthorsItem
              author={designer}
              type={AuthorTypesEnum.DESIGNER}
              key={designer.name}
            />
          ))}
        </div>
      )}

      <div className="bg-white/10 w-[1px] h-5 max-lg:mx-2" />
      <div className="text-white font-medium max-lg:text-sm">
        {release.publishDate}
      </div>
    </div>
  );
};

export default ReleaseDetailsAuthors;
