import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LyricsApi } from '../../../api/lyrics-api';
import ModalOverlay from '../../../components/modals/Modal-overlay';
import SkeletonLoader from '../../../components/utils/Skeleton-loader';
import { releasesKeys } from '../../../query-keys/releases-keys';

interface IProps {
  releaseId: string;
  isOpen: boolean;
  onCancel: () => void;
}

const renderLyrics = (text: string) => {
  return text.split('\n').map((rawLine, idx) => {
    const line = rawLine.replace(/\r/g, '');
    const trimmed = line.trim();

    if (trimmed === '') {
      return <div key={idx} className="h-2" />;
    }

    if (/^\[.*\]$/.test(trimmed)) {
      const content = trimmed.replace(/^\[|\]$/g, '');
      return (
        <p
          key={idx}
          className="text-base font-semibold uppercase text-white/80 mb-1 mt-4"
        >
          {content}
        </p>
      );
    }

    if (/^\(.*\)$/.test(trimmed)) {
      return (
        <p key={idx} className="text-sm italic text-white/70 mb-0.5">
          {trimmed}
        </p>
      );
    }

    return (
      <p key={idx} className="text-sm leading-6 text-white/60 mb-0.5">
        {trimmed}
      </p>
    );
  });
};

const LyricsModal = ({ isOpen, onCancel, releaseId }: IProps) => {
  const { t } = useTranslation();
  const { data: lyrics, isPending } = useQuery({
    queryKey: releasesKeys.lyrics(releaseId),
    queryFn: () => LyricsApi.fetchLyrics(releaseId),
    enabled: !!releaseId && isOpen,
    staleTime: Infinity,
    retry: false,
  });

  const text = lyrics?.lyrics;

  return (
    <ModalOverlay isOpen={isOpen} onCancel={onCancel}>
      <div
        className={`relative rounded-xl w-full lg:max-w-3xl border border-white/10 bg-zinc-950 transition-transform duration-300 p-6 max-h-[80vh] overflow-y-auto max-w-[90vw]`}
      >
        <div className="prose prose-invert">
          {isPending && (
            <div className="space-y-2 w-60 md:w-130 h-130">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <SkeletonLoader className="h-4 w-full rounded" />
                  <SkeletonLoader className="h-4 w-5/6 rounded" />
                  <SkeletonLoader className="h-4 w-11/12 rounded" />
                  <SkeletonLoader className="h-4 w-3/4 rounded" />
                  <SkeletonLoader className="h-4 w-full rounded" />
                  <SkeletonLoader className="h-4 w-4/5 rounded" />
                  <SkeletonLoader className="h-4 w-2/3 rounded" />
                </div>
              ))}
            </div>
          )}
          {!isPending && text
            ? renderLyrics(text)
            : !isPending && (
                <div className="space-y-2 w-60 md:w-130 h-40">
                  <p className="text-sm text-white/70">
                    {t('releaseDetails.lyrics.unavailable')}
                  </p>
                </div>
              )}
        </div>
      </div>
    </ModalOverlay>
  );
};

export default LyricsModal;
