import { useEffect, useRef, useState } from "react";
import { getAudio } from "../../services/fetcher";
import { IconPlay } from "../icons/IconPlay";
import { useAtom } from "jotai";
import { selectedSongAtom } from "../../atoms/selectedSongAtom";
import { playListAtom } from "../../atoms/playListAtom";

export default function PlaySong() {
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [selectedSong, setSelectedSong] = useAtom(selectedSongAtom);
    const [playList] = useAtom(playListAtom);
    const [maxTime, setMaxTime] = useState<string>("0:00");
    const [minTime, setMinTime] = useState<string>("0:00");
    const [audioChangeCounter, setAudioChangeCounter] = useState(0);

    useEffect(() => {
        setAudioChangeCounter(prevCounter => prevCounter + 1);
    }, [audioUrl]);

    useEffect(() => {
        const fetchAudio = async (videoId: string) => {
            try {
                const response: string = await getAudio(videoId);
                setAudioUrl(response);
            } catch (error) {
                console.error('Error fetching audio URL:', error);
            }
        };

        if (selectedSong?.id?.videoId) {
            fetchAudio(selectedSong.id.videoId);
        } else {
            setAudioUrl('');
        }
    }, [selectedSong]);

    useEffect(() => {
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
                if (current === duration) nextSong();
            }
        };

        const audio = audioRef.current;
        if(audio && audioUrl) {
            audio.src = audioUrl;
            audio.play().then(() => {
                setIsPlaying(true);
            });
            audio.onloadedmetadata = updateMetadata;
            audio.ontimeupdate = updateTime;
            audio.onended = nextSong;
        }
    }, [audioChangeCounter]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying == false) audio.play();
            else audio.pause();
            setIsPlaying(!isPlaying);
        }
    };

    const nextSong = () => {
        const currentIndex = playList.findIndex(song => song.id.videoId === selectedSong.id.videoId);
        if (currentIndex + 1 < playList.length) {
            setSelectedSong(playList[currentIndex + 1]);
        } else {
            setIsPlaying(false);
            alert("Running out of songs in the playlist");
        }
    };

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

    return (
        <div className="mt-36 w-full max-w-[900px] flex flex-col mx-4 md:mx-auto items-center md:items-start md:flex-row z-20">
            <div
                    className="w-[250px] h-[250px] mr-5 relative rounded-full cursor-pointer mb-3 md:mb-0 bg-black dark:bg-white "
                    onClick={togglePlay}
                >
                {selectedSong.snippet.thumbnails.medium.url ? (
                    <img
                        src={selectedSong.snippet.thumbnails.medium.url}
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
                    <IconPlay className="cursor-pointer fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                ) : (
                    <IconPlay className="cursor-pointer fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
            </div>
            <div className="md:max-w-[500px] w-full">
                {selectedSong.snippet.title ? (
                    <h2 className="font-bold text-4xl mb-2 h-20 overflow-hidden">
                        {selectedSong.snippet.title?.length >= 45 ? (
                            <>{selectedSong.snippet.title}</>
                        ) : (
                            selectedSong.snippet.title
                        )}
                    </h2>
                ) : (
                    <h2 className="font-bold text-4xl mb-2">
                        Waiting...
                    </h2>
                )}
                {selectedSong.snippet.channelTitle ? (
                    <p className="text-sm text-gray-500 font-mono mb-8 dark:text-white">
                        {selectedSong.snippet.channelTitle}
                    </p>
                ) : (
                    <p className="text-sm text-gray-500 font-mono mb-8 dark:text-white">
                        Please select your song
                    </p>
                )}
                {audioUrl && <audio ref={audioRef} hidden />}
                <div className="flex justify-between mb-0">
                    <p className="text-gray-500 font-mono dark:text-white">{minTime}</p>
                    <p className="text-gray-500 font-mono dark:text-white">{maxTime}</p>
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
        </div>
    );
}
