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

    useEffect(() => {
        const handleSubmit = async (videoId: string) => {
            try {
                const response: string = await getAudio(videoId);
                setAudioUrl(response);
            } catch (error) {
                console.error('Error fetching audio URL:', error);
            }
        };
        
        if (selectedSong && selectedSong.id && selectedSong.id.videoId !== '') {
            handleSubmit(selectedSong.id.videoId);
            playAudio();
        } else {
            setIsPlaying(false);
            setAudioUrl('');
        }
    }, [selectedSong]);

    useEffect(() => {
        if (currentTime === duration && currentTime !== 0) {
            nextSong();
        }
    }, [currentTime, duration]);

    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying && audio) {
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } else if (!isPlaying && audio) {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.src = audioUrl;
            if (isPlaying) {
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration);
            });
        }
    }, [audioUrl, isPlaying]);

    const playAudio = () => {
        const audio = audioRef.current;
        if (audio !== null) {
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio !== null) {
        if (!isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
        setIsPlaying(!isPlaying);
        }
    };

    const togglePause = () => {
        const audio = audioRef.current;
        if (audio !== null) {
            audio.pause();
            setIsPlaying(false);
        }
    }
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const nextSong = () => {
        const currentSong = playList.findIndex(song => song.id.videoId === selectedSong.id.videoId);
        console.log(currentSong);
        if (currentSong +1 < playList.length) {
            setSelectedSong(playList[currentSong + 1]);
        } else {
            togglePause();
            alert("Running out of songs in the playlist");
        }
    };

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(event.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    return (
        <div className="mt-12 bg-gray-300">
            <h1>YouTube Audio Player</h1>
            <div>{selectedSong.snippet.title}</div>
                <IconPlay 
                className="cursor-pointer"
                onClick={togglePlay}
                />
            {audioUrl && (
                <audio ref={audioRef} hidden>
                <source src={audioUrl} type="audio/mpeg" />
                </audio>
            )}
            <div>
                {formatTime(currentTime)}
                <input 
                    type="range" 
                    className="w-56 progress" 
                    style={{ background: `linear-gradient(to right, #4299E1 ${currentTime / duration * 100}%, gray ${currentTime / duration * 100}%)` }}
                    value={currentTime} 
                    max={duration} 
                    onChange={handleProgressChange} 
                />
                {formatTime(duration)}
            </div>
            <button onClick={nextSong}>a</button>
        </div>
    );
}