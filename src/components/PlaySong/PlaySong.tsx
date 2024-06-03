import { useRef, useState } from "react";
import { getData } from "../../services/fetcher";
import { IconPlay } from "../icons/IconPlay";

export default function PlaySong() {
    const [videoID, setVideoID] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response: string = await getData(videoID);
            setAudioUrl(response);
        } catch (error) {
        console.error('Error fetching audio URL:', error);
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

    return (
        <div className="mt-12">
        <h1>YouTube Audio Player</h1>
            <input
            type="text"
            placeholder="Nhập ID YouTube"
            value={videoID}
            onChange={(e) => setVideoID(e.target.value)}
            />
            <IconPlay
                className='cursor-pointer'
                onClick={handleSubmit}
            />
            <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        {audioUrl && (
            <audio ref={audioRef} hidden>
            <source src={audioUrl} type="audio/mpeg" />
            </audio>
        )}
        </div>
    );
}