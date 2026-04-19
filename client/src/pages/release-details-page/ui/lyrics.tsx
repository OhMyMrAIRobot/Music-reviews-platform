import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SongLyricsSvg from '../../../components/svg/Song-lyrics-svg';
import LyricsModal from './lyrics-modal';

interface IProps {
  releaseId: string;
}

export const ReleaseDetailsLyrics = ({ releaseId }: IProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LyricsModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        releaseId={releaseId}
      />
      <button
        className="flex items-center select-none cursor-pointer text-sm gap-1 bg-zinc-800 h-8 border border-white/10 rounded-full px-5 hover:bg-white/10 transition-colors duration-200 font-medium"
        onClick={() => setIsModalOpen(true)}
      >
        <SongLyricsSvg className="size-4" />
        <span>{t('releaseDetails.lyrics.title')}</span>
      </button>
    </>
  );
};
