import { useEffect, useRef, useState } from "react";
import { getAudio } from "../../../../services/fetcher";
import { useAtom } from "jotai";
import { selectedSongAtom } from "../../../../atoms/selectedSongAtom";
import { playListAtom } from "../../../../atoms/playListAtom";
import { optionsAtom } from "../../../../atoms/optionsAtom";
import { youtubePlayListAtom } from "../../../../atoms/youtubePlayList";
import Icons from "../../../../components/icons/Icons";
import { YoutubeSong } from "../../../../hooks/useSearch";

export default function PlaySong() {
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [selectedSong, setSelectedSong] = useAtom(selectedSongAtom);
    const [playList] = useAtom(playListAtom);
    const [youtubePlayList] = useAtom(youtubePlayListAtom);
    const [maxTime, setMaxTime] = useState<string>("0:00");
    const [minTime, setMinTime] = useState<string>("0:00");
    const [audioChangeCounter, setAudioChangeCounter] = useState(0);
    const [isVolumeAppear, setIsVolumneAppear] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [options, setOptions] = useAtom(optionsAtom);

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
        setAudioChangeCounter(prevCounter => prevCounter + 1);
    }, [audioUrl]);

    useEffect(() => {
        if (selectedSong?.id?.videoId) {
            fetchAudio(selectedSong.id.videoId);
            setCurrentTime(0);
            setDuration(0);
            setMinTime("0:00");
            setMaxTime("0:00");
        } else {
            setAudioUrl('');
        }
    }, [selectedSong]);

    const fetchAudio = async (videoId: string) => {
        try {
            const response: string = await getAudio(videoId);
            setAudioUrl(response);
        } catch (error) {
            console.error('Error fetching audio URL:', error);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if(audio && audioUrl) {
            audio.src = audioUrl;
            if(!isPlaying)
            audio.play().then(() => {
                setIsPlaying(true);
            });
            audio.onloadedmetadata = updateMetadata;
            audio.ontimeupdate = updateTime;
            if(options.isLoop){
                audio.loop = options.isLoop;
            } else{
                audio.onended = nextSong;
            }
        }
        updateMediaSessionMetadata(selectedSong);
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
            setMaxTime(`${h > 0 ? `${h}:` : ""}${m}:${s < 10 ? `0${s}` : s}`);
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
            setMinTime(`${h > 0 ? `${h}:` : ""}${m}:${s < 10 ? `0${s}` : s}`);
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
                    { src: song.snippet.thumbnails.high.url, sizes: '512x512', type: 'image/jpeg' }
                ]
            });
    
            navigator.mediaSession.setActionHandler('play', () => {
                if(audioRef.current){
                    audioRef.current.play();
                    setIsPlaying(true);
                }
            });
    
            navigator.mediaSession.setActionHandler('pause', () => {
                if(audioRef.current){
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
        const audio = audioRef.current;
        if (audio) {
            if (!isPlaying) audio.play();
            else audio.pause();
            setIsPlaying(!isPlaying);
        }
    };

    const nextSong = () => {
        setIsPlaying(false);
        if(options.isRandom) {
            randomSong();
        }else{
            const playlist = options.myPlaylist ? playList : youtubePlayList;
            const currentIndex = playlist.findIndex(song => song.id.videoId === selectedSong.id.videoId);
            if (currentIndex + 1 < playlist.length) {
                setSelectedSong(playlist[currentIndex + 1]);
            } else {
                const audio = audioRef.current
                if(audio){
                    if(options.isRandom){
                        randomSong();
                    } else{
                        alert("Running out of songs in the playlist");
                    }
                }
            }
        }
    };

    const prevSong = () => {
        setIsPlaying(false);
        const playlist = options.myPlaylist ? playList : youtubePlayList;
        const currentIndex = playlist.findIndex(song => song.id.videoId === selectedSong.id.videoId);
        if (currentIndex !== 0) {
            setSelectedSong(playlist[currentIndex -1]);
        } else {
            alert("No more previous song");
        }
    };

    const randomSong = () => {
        setIsPlaying(false);
        const playlist = options.myPlaylist ? playList : youtubePlayList;
        const totalSong = playlist.length;
        const randomSongIndex = Math.ceil(Math.random() * totalSong) - 1;
        setSelectedSong(playlist[randomSongIndex])
    }

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Math.floor(Number(e.target.value));
        setCurrentTime(newTime);
        const [h, m, s] = [
            Math.floor(newTime / 3600),
            Math.floor((newTime % 3600) / 60),
            Math.floor((newTime % 3600) % 60),
        ];
        setMinTime(`${h > 0 ? `${h}:` : ""}${m}:${s < 10 ? `0${s}` : s}`);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleAudioLoaded = () => {
        if(audioRef.current && isPlaying === true){
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
            setMaxTime(`${h > 0 ? `${h}:` : ""}${m}:${s < 10 ? `0${s}` : s}`);
            setCurrentTime(0);
            setMinTime("0:00");
        }
    }

    const handleAudioError = async () => {        
        if(selectedSong.id.videoId.length > 0){
            fetchAudio(selectedSong.id.videoId)
        }
    };

    return (
        <div className="md:mt-32 mt-20 w-full max-w-[900px] min-w-[300px] flex flex-col md:mx-auto items-center md:items-start md:flex-row z-20">
            <audio 
                ref={audioRef} 
                hidden 
                preload="metadata"
                src={audioUrl}
                onLoadedMetadata={handleAudioLoaded}
                onError={handleAudioError}
            />
            <div
                    className="w-[250px] h-[250px] mr-5 relative rounded-full cursor-pointer mb-3 md:mb-0 bg-black"
                    onClick={togglePlay}
                >
                {selectedSong.snippet.thumbnails.high.url ? (
                    <img
                        src={selectedSong.snippet.thumbnails.high.url}
                        alt="song"
                        width={250}
                        height={250}
                        className={`h-[250px] rounded-full object-cover ${
                            isPlaying
                                ? "animate-[spin_30s_linear_infinite]"
                                : ""
                        }`}
                    />
                ):
                (
                    <div className="h-[250px] w-[250px] bg-black rounded-full flex justify-center items-center">
                    </div>
                )}
                {isPlaying ? (
                    <Icons.pause className="cursor-pointer fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform transform hover:scale-110" />
                ) : (
                    <Icons.play className="cursor-pointer fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform transform hover:scale-110" />
                )}
            </div>
            <div className="md:max-w-[500px] w-full">
                <div>
                    {selectedSong.snippet.title ? (
                        <h2 className="font-bold text-4xl mb-2 h-20 overflow-hidden">
                            {selectedSong.snippet.title}
                        </h2>
                    ) : (
                        <h2 className="font-bold text-4xl mb-2">
                            Waiting...
                        </h2>
                    )}
                    {selectedSong.snippet.channelTitle ? (
                        <p className="text-sm text-gray-500 font-mono mb-8">
                            {selectedSong.snippet.channelTitle}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 font-mono mb-8">
                            Please select your song
                        </p>
                    )}
                    <div className="flex justify-between mb-0">
                        <p className="text-gray-500 font-mono">{minTime}</p>
                        <p className="text-gray-500 font-mono">{maxTime}</p>
                    </div>
                    <input
                        type="range"
                        value={currentTime}
                        min={0}
                        step={1}
                        max={duration}
                        className="w-full mb-5 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black"
                        onChange={handleProgressChange}
                    />
                </div>
                <div className="w-full flex items-center justify-between">
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
                            <Icons.speakerwave
                            className="cursor-pointer transition-transform transform hover:scale-110"
                            />
                        ):(
                            <Icons.speakerx
                            className="cursor-pointer transition-transform transform hover:scale-110"
                            />
                        )}
                        <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={volume}
                                className={`${
                                    isVolumeAppear ? "block" : "hidden"
                                } absolute left-1/2 -translate-x-1/2 h-1 bg-white rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-black/25 p-3 shadow-md`}
                                onChange={(event) => {
                                    setVolume(event.target.valueAsNumber);
                                }}
                            />
                    </div>
                    <Icons.random
                        className={`${options.isRandom ? "fill-black hover:scale-110" : "fill-gray-500 hover:scale-110"} cursor-pointer transition-transform transform hover:scale-110 `}
                        onClick={() => 
                            {if(options.isRandom){
                                setOptions((prev) => ({
                                    ...prev,
                                    isRandom: false,
                                }))
                            }else{
                                setOptions((prev) => ({
                                    ...prev,
                                    isRandom: true,
                                    isLoop: false
                                }))
                            }}
                        }
                    />
                    <Icons.previous
                        className="cursor-pointer transition-transform transform hover:scale-110"
                        onClick={prevSong}
                    />
                    <div className="w-14 h-14 bg-black flex justify-center items-center rounded-full">
                        {isPlaying ? 
                            <Icons.pause
                                className="cursor-pointer fill-white transition-transform transform hover:scale-110"
                                onClick={togglePlay}
                            />
                        :
                            <Icons.play
                                className="cursor-pointer fill-white transition-transform transform hover:scale-110"
                                onClick={togglePlay}
                            />
                        }
                    </div>
                    <Icons.next
                        className="cursor-pointer transition-transform transform hover:scale-110"
                        onClick={nextSong}
                    />
                    <Icons.loop
                        className={`${options.isLoop ? "fill-black scale-110 hover:scale-110" : "fill-gray-500 hover:scale-110"} cursor-pointer transition-transform transform hover:scale-110 `}
                        onClick={() => 
                            {if(options.isLoop){
                                setOptions((prev) => ({
                                    ...prev,
                                    isLoop: false,
                                }))
                            }else{
                                setOptions((prev) => ({
                                    ...prev,
                                    isLoop: true,
                                    isRandom: false
                                }))
                            }}
                        }
                    />
                    {selectedSong.id.videoId.length > 0 ? (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://www.youtube.com/watch?v=${selectedSong.id.videoId}`}
                            onClick={togglePlay}
                        >
                            <Icons.youtube
                                className="cursor-pointer transition-transform transform hover:scale-110 fill-gray-800"
                            />
                        </a>
                    ) : (
                        <Icons.youtube
                            className="fill-gray-500"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
