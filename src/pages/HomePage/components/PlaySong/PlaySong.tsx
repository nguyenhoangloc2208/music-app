import { useEffect, useRef, useState } from "react";
import { getAudio } from "../../../../services/fetcher";
import { IconPlay } from "../../../../components/icons/IconPlay";
import { useAtom } from "jotai";
import { selectedSongAtom } from "../../../../atoms/selectedSongAtom";
import { playListAtom } from "../../../../atoms/playListAtom";
import { IconPause } from "../../../../components/icons/IconPause";
import { IconSpeakerWave } from "../../../../components/icons/IconSpeakerWave";
import { IconPrevious } from "../../../../components/icons/IconPrevious";
import { IconNext } from "../../../../components/icons/IconNext";
import { IconLoop } from "../../../../components/icons/IconLoop";
import { IconRandom } from "../../../../components/icons/IconRandom";
import { IconYoutube } from "../../../../components/icons/IconYoutube";
import { IconSpeakerX } from "../../../../components/icons/IconSpeakerX";
import { optionsAtom } from "../../../../atoms/optionsAtom";

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
    const [isVolumeAppear, setIsVolumneAppear] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [options, setOptions] = useAtom(optionsAtom);

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
                if (current === duration && !options.isLoop) {
                    if(!options.isRandom){
                        nextSong();
                    }else{
                        randomSong();
                    }
                }
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
            if(options.isLoop){
                audio.loop = options.isLoop;
            }else{
                if(options.isRandom){
                    audio.onended = randomSong;
                }else{
                    audio.onended = nextSong;
                }
            }
        }
    }, [audioChangeCounter]);

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
            if (isPlaying == false) audio.play();
            else audio.pause();
            setIsPlaying(!isPlaying);
        }
    };

    const nextSong = () => {
        if(options.isRandom) {
            randomSong();
        }else{
            const currentIndex = playList.findIndex(song => song.id.videoId === selectedSong.id.videoId);
            if (currentIndex + 1 < playList.length) {
                setSelectedSong(playList[currentIndex + 1]);
            } else {
                const audio = audioRef.current
                if(audio){
                    if(options.isRandom){
                        randomSong();
                    } else{
                        alert("Running out of songs in the playlist");
                        console.log('random', options.isRandom);
                    }
                }
            }
        }
    };

    const prevSong = () => {
        const currentIndex = playList.findIndex(song => song.id.videoId === selectedSong.id.videoId);
        if (currentIndex !== 0) {
            setSelectedSong(playList[currentIndex -1]);
        } else {
            alert("No more previous song");
        }
    };

    const randomSong = () => {
        const totalSong = playList.length;
        const randomSongIndex = Math.ceil(Math.random() * totalSong) - 1;
        setSelectedSong(playList[randomSongIndex])
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

    return (
        <div className="md:mt-36 mt-20 w-full max-w-[900px] min-w-[300px] flex flex-col md:mx-auto items-center md:items-start md:flex-row z-20">
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
                    <IconPause className="cursor-pointer fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                ) : (
                    <IconPlay className="cursor-pointer fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
            </div>
            <div className="md:max-w-[500px] w-full">
                <div>
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
                        <p className="text-sm text-gray-500 font-mono mb-8">
                            {selectedSong.snippet.channelTitle}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 font-mono mb-8">
                            Please select your song
                        </p>
                    )}
                    {audioUrl && <audio ref={audioRef} hidden />}
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
                            <IconSpeakerWave
                            className="cursor-pointer transition-transform transform hover:scale-110"
                            />
                        ):(
                            <IconSpeakerX
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
                                } absolute left-1/2 -translate-x-1/2 h-1 bg-white dark:bg-black rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-black/25 dark:[&::-webkit-slider-runnable-track]:bg-white/25 p-3 shadow-md`}
                                onChange={(event) => {
                                    setVolume(event.target.valueAsNumber);
                                }}
                            />
                    </div>
                    <IconRandom
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
                    <IconPrevious
                        className="cursor-pointer transition-transform transform hover:scale-110"
                        onClick={prevSong}
                    />
                    {isPlaying ? 
                        <IconPause
                            className="cursor-pointer transition-transform transform hover:scale-110"
                            onClick={togglePlay}
                        />
                    :
                        <IconPlay
                            className="cursor-pointer transition-transform transform hover:scale-110"
                            onClick={togglePlay}
                        />
                    }
                    <IconNext
                        className="cursor-pointer transition-transform transform hover:scale-110"
                        onClick={nextSong}
                    />
                    <IconLoop
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
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.youtube.com/watch?v=${selectedSong.id.videoId}`}
                        onClick={togglePlay}
                    >
                        <IconYoutube
                            className="cursor-pointer transition-transform transform hover:scale-110 fill-gray-800"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
