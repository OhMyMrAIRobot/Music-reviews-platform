import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { AuthorAPI } from "../../api/author/author-api";
import { ReleaseAPI } from "../../api/release/release-api";
import AuthorsGrid from "../../components/author/authors-grid/Authors-grid";
import ReleasesGrid from "../../components/release/Releases-grid";
import useNavigationPath from "../../hooks/use-navigation-path";
import { authorsKeys } from "../../query-keys/authors-keys";
import { releasesKeys } from "../../query-keys/releases-keys";
import { AuthorsQuery } from "../../types/author";
import { SearchTypesEnum } from "../../types/common/enums/search-types-enum";
import { ReleasesQuery } from "../../types/release";

const perPage = 10;

const SearchPage = () => {
  const { type } = useParams();

  const navigate = useNavigate();

  const { navigateToMain } = useNavigationPath();

  const [isLoading, setIsloading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const authorsQuery: AuthorsQuery = {
    search: query.trim() || undefined,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
  };

  const authorsQ = useQuery({
    queryKey: authorsKeys.list(authorsQuery),
    queryFn: () => AuthorAPI.findAll(authorsQuery),
    enabled: query.length > 0 && type === SearchTypesEnum.AUTHORS,
    staleTime: 1000 * 60 * 5,
  });

  const releasesQuery: ReleasesQuery = {
    search: query || undefined,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
  };

  const releasesQ = useQuery({
    queryKey: releasesKeys.list(releasesQuery),
    queryFn: () => ReleaseAPI.findAll(releasesQuery),
    enabled: query.length > 0 && type === SearchTypesEnum.RELEASES,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (
      !type ||
      !Object.values(SearchTypesEnum).includes(type as SearchTypesEnum)
    ) {
      navigate(navigateToMain);
    }
    setIsloading(false);
  }, [navigate, navigateToMain, type]);

  return (
    !isLoading && (
      <>
        {type === SearchTypesEnum.AUTHORS && (
          <AuthorsGrid
            items={authorsQ.data?.items ?? []}
            isLoading={authorsQ.isPending}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={authorsQ.data?.meta.count ?? 0}
            perPage={perPage}
          />
        )}
        {type === SearchTypesEnum.RELEASES && (
          <ReleasesGrid
            items={releasesQ.data?.items ?? []}
            isLoading={releasesQ.isPending}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={releasesQ.data?.meta.count ?? 0}
            perPage={perPage}
          />
        )}
      </>
    )
  );
};

export default SearchPage;
