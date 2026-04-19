import { useQuery } from '@tanstack/react-query';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReleaseMediaAPI } from '../../../../api/release/release-media-api';
import CarouselNavButton from '../../../../components/carousel/Carousel-nav-button';
import SkeletonLoader from '../../../../components/utils/Skeleton-loader';
import { useReleaseMediaMeta } from '../../../../hooks/meta';
import { useStore } from '../../../../hooks/use-store';
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys';
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum';
import { CarouselRef } from '../../../../types/common/types/carousel-ref';
import {
  ReleaseMediaQuery,
  ReleaseMediaStatusesEnum,
} from '../../../../types/release';
import { RolesEnum } from '../../../../types/user';
import ReleaseDetailsMediaCarousel from './Release-details-media-carousel';

interface IProps {
  releaseId: string;
}

const ReleaseDetailsMedia: FC<IProps> = ({ releaseId }) => {
  const { t } = useTranslation();
  const { authStore } = useStore();

  const carouselRef = useRef<CarouselRef>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { statuses, isLoading: isReleaseMediaMetaLoading } =
    useReleaseMediaMeta();

  const statusId = statuses.find(
    (el) => el.status === ReleaseMediaStatusesEnum.APPROVED
  )?.id;

  const mediaQuery: ReleaseMediaQuery = {
    statusId,
    releaseId,
    order: SortOrdersEnum.DESC,
  };

  const { data: releaseMediaData, isPending: isReleaseMediaLoading } = useQuery(
    {
      queryKey: releaseMediaKeys.list(mediaQuery),
      queryFn: () => ReleaseMediaAPI.findAll(mediaQuery),
      enabled: statuses.length > 0 && !isReleaseMediaMetaLoading,
      staleTime: 1000 * 60 * 5,
    }
  );

  const userMediaQuery: ReleaseMediaQuery = {
    releaseId,
    userId: authStore.user?.id,
  };

  const { data: userReleaseMediaData, isPending: isUserReleaseMediaLoading } =
    useQuery({
      queryKey: releaseMediaKeys.list(userMediaQuery),
      queryFn: () => ReleaseMediaAPI.findAll(userMediaQuery),
      enabled:
        !!authStore.isAuth && authStore.user?.role.role === RolesEnum.MEDIA,
      staleTime: 1000 * 60 * 5,
    });

  const releaseMedia = releaseMediaData?.items || [];
  const releaseMediaCount = releaseMediaData?.meta.count || 0;
  const userMedia =
    userReleaseMediaData?.items.length === 1
      ? userReleaseMediaData?.items[0]
      : null;

  const items =
    userMedia && userMedia.status.status !== ReleaseMediaStatusesEnum.APPROVED
      ? [userMedia, ...releaseMedia]
      : releaseMedia;

  const isLoading =
    isReleaseMediaLoading ||
    isReleaseMediaMetaLoading ||
    (isUserReleaseMediaLoading &&
      !!authStore.user &&
      authStore.user.role.role === RolesEnum.MEDIA);

  return (
    <section
      className={`gap-3 grid mt-5 w-full ${
        !isLoading && !userMedia && releaseMedia.length === 0 ? 'hidden' : ''
      }`}
    >
      <div className="flex">
        <div className="font-bold shrink-0 flex items-center justify-between space-x-2 lg:space-x-5 col-span-2">
          <div className="text-xl xl:text-2xl font-semibold">
            {t('releaseDetails.media.materialsHeading')}
          </div>

          {!isLoading ? (
            <div className="inline-flex items-center justify-center rounded-full size-10 lg:size-12 bg-white/5 select-none">
              {releaseMediaCount + (userMedia ? 1 : 0)}
            </div>
          ) : (
            <SkeletonLoader className={'rounded-full size-10 lg:size-12'} />
          )}
        </div>

        <div className="flex gap-3 items-center ml-auto">
          <CarouselNavButton
            isNext={false}
            handlePrev={() => carouselRef.current?.scrollPrev()}
            handleNext={() => carouselRef.current?.scrollNext()}
            disabled={!canScrollPrev}
          />
          <CarouselNavButton
            isNext={true}
            handlePrev={() => carouselRef.current?.scrollPrev()}
            handleNext={() => carouselRef.current?.scrollNext()}
            disabled={!canScrollNext}
          />
        </div>
      </div>

      <ReleaseDetailsMediaCarousel
        ref={carouselRef}
        onCanScrollPrevChange={setCanScrollPrev}
        onCanScrollNextChange={setCanScrollNext}
        isLoading={isLoading}
        items={items}
      />
    </section>
  );
};

export default ReleaseDetailsMedia;
