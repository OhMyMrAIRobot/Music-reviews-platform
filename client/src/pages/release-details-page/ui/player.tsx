import { Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

declare global {
  interface Window {
    YT: {
      Player: new (id: string, options: YTPlayerOptions) => YTPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  height?: string;
  width?: string;
  videoId: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
  };
}

interface BottomPlayerProps {
  youtubeId: string;
  coverUrl?: string;
  title: string;
  artist: string;
  onClose?: () => void;
  isOpen: boolean;
}

const BottomPlayer: React.FC<BottomPlayerProps> = ({
  youtubeId,
  coverUrl,
  title,
  artist,
  onClose = () => {},
  isOpen,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player('youtube-hidden-player', {
        height: '0',
        width: '0',
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: YTPlayerEvent) => {
            setDuration(event.target.getDuration());
            event.target.setVolume(volume * 100);
            setIsPlayerReady(true);
          },
          onStateChange: (event: YTPlayerEvent) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isPlayerReady) {
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPlayerReady]);

  const togglePlay = () => {
    if (!isPlayerReady || !playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(time, true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(vol * 100);
    }
  };

  const toggleMute = () => {
    const newVol = volume === 0 ? 0.5 : 0;
    setVolume(newVol);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVol * 100);
    }
  };

  const playedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  const sliderThumbClasses = `
    [&::-webkit-slider-thumb]:appearance-none 
    [&::-webkit-slider-thumb]:w-3 
    [&::-webkit-slider-thumb]:h-3 
    [&::-webkit-slider-thumb]:bg-white 
    [&::-webkit-slider-thumb]:rounded-full 
    [&::-moz-range-thumb]:border-none 
    [&::-moz-range-thumb]:w-3 
    [&::-moz-range-thumb]:h-3 
    [&::-moz-range-thumb]:bg-white 
    [&::-moz-range-thumb]:rounded-full
  `;

  return createPortal(
    <div
      className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed left-1/2 -translate-x-1/2 px-2 py-2 md:p-4 w-[90%] lg:w-full lg:max-w-[60vw] bottom-2 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-2xl transition-all duration-500 z-40 lg:max-h-20 bg-zinc-800/80 backdrop-blur-xl`}
    >
      <div id="youtube-hidden-player" className="hidden"></div>

      <div className="flex items-center gap-2 md:gap-3 w-full md:w-1/4">
        <img
          ref={imgRef}
          src={coverUrl}
          alt="Cover"
          crossOrigin="anonymous"
          className="size-10 md:size-12.5 rounded-md object-cover shadow-md flex-shrink-0"
        />
        <div className="flex flex-col h-full text-white truncate min-w-0">
          <span className="font-bold truncate text-white text-sm md:text-base mb-1">
            {title}
          </span>
          <span className="text-xs md:text-sm font-medium text-white/80 truncate">
            {artist}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full md:w-2/4 px-2 md:px-4 gap-2 mt-2 md:mt-0">
        <button
          onClick={togglePlay}
          disabled={!isPlayerReady}
          className={`bg-white text-black p-2 md:p-2.5 rounded-full transition-transform flex-shrink-0 ${
            isPlayerReady ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isPlaying ? (
            <Pause size={14} fill="currentColor" className="md:size-4" />
          ) : (
            <Play size={14} fill="currentColor" className="ml-0.5 md:size-4" />
          )}
        </button>

        <div className="w-full max-w-xl group flex items-center h-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step="any"
            value={currentTime}
            onChange={handleSeekChange}
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer outline-none transition-all ${sliderThumbClasses} [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100 [&::-moz-range-thumb]:opacity-0 group-hover:[&::-moz-range-thumb]:opacity-100`}
            style={{
              background: `linear-gradient(to right, #ffffff ${playedPercentage}%, rgba(255, 255, 255, 0.2) ${playedPercentage}%)`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 md:gap-4 w-full md:w-1/4 mt-2 md:mt-0 text-white">
        <div className="hidden md:flex items-center gap-2 group h-8">
          <button
            onClick={toggleMute}
            className="hover:text-white/80 transition-colors"
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className={`w-24 h-1 rounded-lg appearance-none cursor-pointer outline-none transition-all group-hover:opacity-100 ${sliderThumbClasses}`}
            style={{
              background: `linear-gradient(to right, #ffffff ${volumePercentage}%, rgba(255, 255, 255, 0.2) ${volumePercentage}%)`,
            }}
          />
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
        >
          <X size={16} className="md:size-5" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default BottomPlayer;
