import { useEffect, useRef, useState } from 'react';
import { getAudio } from '../../../../services/fetcher';
import { useAtom } from 'jotai';
import { selectedSongAtom } from '../../../../atoms/selectedSongAtom';
import { playListAtom } from '../../../../atoms/playListAtom';
import { optionsAtom } from '../../../../atoms/optionsAtom';
import { youtubePlayListAtom } from '../../../../atoms/youtubePlayList';
import Icons from '../../../../components/icons/Icons';
import { YoutubeSong } from '../../../../hooks/useSearch';

export default function PlaySong() {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [selectedSong, setSelectedSong] = useAtom(selectedSongAtom);
  const [playList] = useAtom(playListAtom);
  const [youtubePlayList] = useAtom(youtubePlayListAtom);
  const [maxTime, setMaxTime] = useState<string>('0:00');
  const [minTime, setMinTime] = useState<string>('0:00');
  const [audioChangeCounter, setAudioChangeCounter] = useState(0);
  const [isVolumeAppear, setIsVolumneAppear] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [options, setOptions] = useAtom(optionsAtom);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isLoading) {
      timer = setTimeout(() => {
        if (isLoading) {
          nextSong();
        }
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      return () => {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      };
    }
  }, []);

  useEffect(() => {
    setAudioChangeCounter((prevCounter) => prevCounter + 1);
  }, [audioUrl]);

  useEffect(() => {
    if (selectedSong?.id?.videoId) {
      fetchAudio(selectedSong.id.videoId);
      setCurrentTime(0);
      setDuration(0);
      setMinTime('0:00');
      setMaxTime('0:00');
    } else {
      setAudioUrl('');
    }
  }, [selectedSong]);

  const fetchAudio = async (videoId: string) => {
    setIsLoading(true);
    try {
      const response: string = await getAudio(videoId);
      setAudioUrl(response);
    } catch (error) {
      console.error('Error fetching audio URL:', error);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audioUrl) {
      audio.src = audioUrl;
      if (!isPlaying)
        audio.play().then(() => {
          setIsPlaying(true);
        });
      audio.onloadedmetadata = updateMetadata;
      audio.ontimeupdate = updateTime;
      if (options.isLoop) {
        audio.loop = options.isLoop;
      } else {
        audio.onended = nextSong;
      }
    }
    updateMediaSessionMetadata(selectedSong);
    setIsLoading(false);
  }, [audioChangeCounter]);

  const updateMetadata = () => {
    if (audioRef.current) {
      const time = Math.floor(audioRef.current.duration);
      setDuration(time);
      const [h, m, s] = [
        Math.floor(time / 3600),
        Math.floor((time % 3600) / 60),
        Math.floor(time % 60),
      ];
      setMaxTime(`${h > 0 ? `${h}:` : ''}${m}:${s < 10 ? `0${s}` : s}`);
    }
  };

  const updateTime = () => {
    if (audioRef.current) {
      const current = Math.floor(audioRef.current.currentTime);
      const [h, m, s] = [
        Math.floor(current / 3600),
        Math.floor((current % 3600) / 60),
        Math.floor(current % 60),
      ];
      setMinTime(`${h > 0 ? `${h}:` : ''}${m}:${s < 10 ? `0${s}` : s}`);
      setCurrentTime(current);
    }
  };

  const updateMediaSessionMetadata = (song: YoutubeSong) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.snippet.title,
        artist: song.snippet.channelTitle,
        album: 'Beru Music',
        artwork: [
          {
            src: song.snippet.thumbnails.high.url,
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });

      navigator.mediaSession.setActionHandler('previoustrack', prevSong);
      navigator.mediaSession.setActionHandler('nexttrack', nextSong);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = options.isLoop;
    }
  }, [options.isLoop]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    // const audio = audioRef.current;
    // if (audio) {
    //     if (!isPlaying) audio.play();
    //     else audio.pause();
    //     setIsPlaying(!isPlaying);
    // }
    alert(
      '403 Forbidden: Access to this video is restricted. Google has dropped the ban hammer. Just sit tight until some kind soul hacks this again',
    );
  };

  const nextSong = () => {
    setIsPlaying(false);
    if (options.isRandom) {
      randomSong();
    } else {
      const playlist = options.myPlaylist ? playList : youtubePlayList;
      const currentIndex = playlist.findIndex(
        (song) => song.id.videoId === selectedSong.id.videoId,
      );
      if (currentIndex + 1 < playlist.length) {
        setSelectedSong(playlist[currentIndex + 1]);
      } else {
        const audio = audioRef.current;
        if (audio) {
          if (options.isRandom) {
            randomSong();
          } else {
            alert('Running out of songs in the playlist');
          }
        }
      }
    }
  };

  const prevSong = () => {
    setIsPlaying(false);
    const playlist = options.myPlaylist ? playList : youtubePlayList;
    const currentIndex = playlist.findIndex(
      (song) => song.id.videoId === selectedSong.id.videoId,
    );
    if (currentIndex !== 0) {
      setSelectedSong(playlist[currentIndex - 1]);
    } else {
      alert('No more previous song');
    }
  };

  const randomSong = () => {
    setIsPlaying(false);
    const playlist = options.myPlaylist ? playList : youtubePlayList;
    const totalSong = playlist.length;
    const randomSongIndex = Math.ceil(Math.random() * totalSong) - 1;
    setSelectedSong(playlist[randomSongIndex]);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Math.floor(Number(e.target.value));
    setCurrentTime(newTime);
    const [h, m, s] = [
      Math.floor(newTime / 3600),
      Math.floor((newTime % 3600) / 60),
      Math.floor((newTime % 3600) % 60),
    ];
    setMinTime(`${h > 0 ? `${h}:` : ''}${m}:${s < 10 ? `0${s}` : s}`);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleAudioLoaded = () => {
    if (audioRef.current && isPlaying === true) {
      audioRef.current.play();
    }
    if (audioRef.current) {
      const duration = Math.floor(audioRef.current.duration);
      setDuration(duration);
      const [h, m, s] = [
        Math.floor(duration / 3600),
        Math.floor((duration % 3600) / 60),
        Math.floor(duration % 60),
      ];
      setMaxTime(`${h > 0 ? `${h}:` : ''}${m}:${s < 10 ? `0${s}` : s}`);
      setCurrentTime(0);
      setMinTime('0:00');
    }
  };

  const handleAudioError = async () => {
    if (selectedSong.id.videoId.length > 0) {
      fetchAudio(selectedSong.id.videoId);
    }
  };

  return (
    <div className="z-20 mt-20 flex w-full min-w-[300px] max-w-[900px] flex-col items-center md:mx-auto md:mt-32 md:flex-row md:items-start">
      <audio
        ref={audioRef}
        hidden
        preload="metadata"
        src={audioUrl}
        onLoadedMetadata={handleAudioLoaded}
        onError={handleAudioError}
      />
      <div
        className="relative mb-3 mr-5 h-[250px] w-[250px] cursor-pointer rounded-full bg-black md:mb-0"
        onClick={togglePlay}
      >
        {selectedSong.snippet.thumbnails.high.url ? (
          <img
            src={selectedSong.snippet.thumbnails.high.url}
            alt="song"
            width={250}
            height={250}
            className={`h-[250px] rounded-full object-cover ${
              isPlaying && !isLoading
                ? 'animate-[spin_30s_linear_infinite]'
                : ''
            }`}
          />
        ) : (
          <div className="flex h-[250px] w-[250px] items-center justify-center rounded-full bg-black"></div>
        )}
        {isLoading ? (
          <span className="loading loading-spinner loading-sm absolute left-1/2 top-1/2 mx-auto mt-3 block -translate-x-1/2 -translate-y-1/2 transform text-white transition-transform hover:scale-110"></span>
        ) : isPlaying ? (
          <Icons.pause className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer fill-white transition-transform hover:scale-110" />
        ) : (
          <Icons.play className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer fill-white transition-transform hover:scale-110" />
        )}
      </div>
      <div className="w-full md:max-w-[500px]">
        <div>
          {selectedSong.snippet.title ? (
            <h2 className="mb-2 h-20 overflow-hidden text-4xl font-bold">
              {selectedSong.snippet.title}
            </h2>
          ) : (
            <h2 className="mb-2 text-4xl font-bold">Waiting...</h2>
          )}
          {selectedSong.snippet.channelTitle ? (
            <p className="mb-8 font-mono text-sm text-gray-500">
              {selectedSong.snippet.channelTitle}
            </p>
          ) : (
            <p className="mb-8 font-mono text-sm text-gray-500">
              Please select your song
            </p>
          )}
          <div className="mb-0 flex justify-between">
            <p className="font-mono text-gray-500">{minTime}</p>
            <p className="font-mono text-gray-500">{maxTime}</p>
          </div>
          <input
            type="range"
            value={currentTime}
            min={0}
            step={1}
            max={duration}
            className="mb-5 h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-400 [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
            onChange={handleProgressChange}
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <div
            className="relative"
            onMouseEnter={() => {
              setIsVolumneAppear(true);
            }}
            onMouseLeave={() => {
              setIsVolumneAppear(false);
            }}
          >
            {volume !== 0 ? (
              <Icons.speakerwave className="transform cursor-pointer transition-transform hover:scale-110" />
            ) : (
              <Icons.speakerx className="transform cursor-pointer transition-transform hover:scale-110" />
            )}
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              className={`${
                isVolumeAppear ? 'block' : 'hidden'
              } absolute left-1/2 h-1 -translate-x-1/2 cursor-pointer appearance-none rounded-lg bg-white p-3 shadow-md [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black`}
              onChange={(event) => {
                setVolume(event.target.valueAsNumber);
              }}
            />
          </div>
          <Icons.random
            className={`${options.isRandom ? 'fill-black hover:scale-110' : 'fill-gray-500 hover:scale-110'} transform cursor-pointer transition-transform hover:scale-110 `}
            onClick={() => {
              if (options.isRandom) {
                setOptions((prev) => ({
                  ...prev,
                  isRandom: false,
                }));
              } else {
                setOptions((prev) => ({
                  ...prev,
                  isRandom: true,
                  isLoop: false,
                }));
              }
            }}
          />
          <Icons.previous
            className="transform cursor-pointer transition-transform hover:scale-110"
            onClick={prevSong}
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black">
            {isLoading ? (
              <span className="loading loading-spinner loading-sm mx-auto block transform text-white transition-transform hover:scale-110"></span>
            ) : isPlaying ? (
              <Icons.pause
                className="transform cursor-pointer fill-white transition-transform hover:scale-110"
                onClick={togglePlay}
              />
            ) : (
              <Icons.play
                className="transform cursor-pointer fill-white transition-transform hover:scale-110"
                onClick={togglePlay}
              />
            )}
          </div>
          <Icons.next
            className="transform cursor-pointer transition-transform hover:scale-110"
            onClick={nextSong}
          />
          <Icons.loop
            className={`${options.isLoop ? 'scale-110 fill-black hover:scale-110' : 'fill-gray-500 hover:scale-110'} transform cursor-pointer transition-transform hover:scale-110 `}
            onClick={() => {
              if (options.isLoop) {
                setOptions((prev) => ({
                  ...prev,
                  isLoop: false,
                }));
              } else {
                setOptions((prev) => ({
                  ...prev,
                  isLoop: true,
                  isRandom: false,
                }));
              }
            }}
          />
          {selectedSong.id.videoId.length > 0 ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.youtube.com/watch?v=${selectedSong.id.videoId}`}
              onClick={togglePlay}
            >
              <Icons.youtube className="transform cursor-pointer fill-gray-800 transition-transform hover:scale-110" />
            </a>
          ) : (
            <Icons.youtube className="fill-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
}
