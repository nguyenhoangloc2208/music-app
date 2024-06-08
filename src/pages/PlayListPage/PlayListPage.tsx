import { useCallback, useEffect, useState } from 'react';
import playListIds from './playListIds.json';
import { YoutubePlayListInfo, fetchPlaylistInfo } from '../../services/fetchPlayList';
import { useAtomValue, useSetAtom } from 'jotai';
import { optionsAtom } from '../../atoms/optionsAtom';
import { youtubePlayListAtom } from '../../atoms/youtubePlayList';
import { fetchPlaylistItem } from '../../services/fetchPlayListItem';
import { useNavigate } from 'react-router-dom';
import { selectedSongAtom } from '../../atoms/selectedSongAtom';
import { YoutubePlayListInfoAtom } from '../../atoms/youtubePlayListInfo';

export default function PlayListPage() {
    const [results, setResults] = useState<any>();
    const [loading, setIsLoading] = useState<boolean>(true);
    const setOptions = useSetAtom(optionsAtom);
    const setYoutubePlayList = useSetAtom(youtubePlayListAtom);
    const setSelectedSong = useSetAtom(selectedSongAtom);
    const setYoutubePlayListInfo = useSetAtom(YoutubePlayListInfoAtom);
    const youtubePlayListInfo = useAtomValue(YoutubePlayListInfoAtom);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                if (youtubePlayListInfo.length === 0) {
                    const results = await fetchPlaylistInfo(playListIds);
                    setResults(results);
                    setYoutubePlayListInfo(results);
                } else {
                    setResults(youtubePlayListInfo);
                }
            } catch (error) {
                console.error("Error fetching playlist info:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (youtubePlayListInfo.length === 0) {
            fetchData();
        } else {
            setResults(youtubePlayListInfo);
        }
        setIsLoading(false);
    }, [playListIds, setYoutubePlayListInfo]);

    const onPlayListClick = useCallback(async (item: YoutubePlayListInfo) => {
        try {
            await fetchPlaylistItem(item.id).then((response) => {
                setSelectedSong(response[0]);
                setYoutubePlayList(response);
            });
            setOptions(prev => ({
                ...prev,
                myPlaylist: false
            }));
            document.title = `BeruMusic || ${item.snippet.title}`;
            navigate('/');
        } catch (error) {
            console.error('Error fetching playlist item:', error);
        }
    }, [navigate]);

    if(loading) return (
        <div className='mt-12'>
            {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="stack bg-none md:w-1/3 w-1/2 p-2 mt-5 mb-16 h-[150px]">
                    <div className="bg-gray-200 h-full skeleton rounded"></div>
                    <div className="skeleton h-12 w-full mt-4"></div>
                </div>
            ))}
        </div>
    )

    return (
        <div className='mx-auto h-full w-full min-h-[1000px] min-w-[300px] items-center'>
            {
                results && results.map((item: YoutubePlayListInfo) => (
                    <div 
                        key={item.id} 
                        className="stack mb-2 md:w-1/3 w-1/2 p-2 mt-5 cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => onPlayListClick(item)}
                    >
                        <img src={item.snippet.thumbnails.high.url} className="h-[74%] object-cover transform translate-y-0 scale-100 opacity-100 !important rounded"/>
                        <img src={item.snippet.thumbnails.high.url} className="h-[74%] object-cover transform -translate-y-2 scale-95 opacity-80 !important rounded"/>
                        <img src={item.snippet.thumbnails.high.url} className="h-[74%] object-cover transform -translate-y-4 scale-90 opacity-60 !important rounded"/>
                        <p className='text-base text-black font-mono translate-y-14 h-12 overflow-hidden'>{item.snippet.title}</p>
                    </div>
                ))
            }
        </div>
    );
}