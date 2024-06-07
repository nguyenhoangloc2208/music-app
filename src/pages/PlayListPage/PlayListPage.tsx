import { useEffect, useState } from 'react';
import playListIds from './playListIds.json';
import { YoutubePlayListInfo, fetchPlaylistInfo } from '../../services/fetchPlayList';

export default function PlayListPage() {
    const [results, setResults] = useState<any>();
    const [loading, setIsLoading] = useState<boolean>(true);

    useEffect(()=> {
        if(!results){
            fetchPlaylistInfo(playListIds).then((results) => {
                setResults(results);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching playlist info:", error);
            });
        }
    }, [results]);

    if(loading) return (
        <div className='mt-12'>
            {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="stack w-1/3 p-2 mt-5 mb-16 h-[150px]">
                    <div className="h-full skeleton rounded"></div>
                    <div className="skeleton h-12 w-full mt-4"></div>
                </div>
            ))}
        </div>
    )

    const onPlayListClick = (id: string) => {
        alert(id)
    }

    return (
        <div className='mx-auto h-full w-full min-w-[300px] items-center'>
            {
                results && results.map((item: YoutubePlayListInfo) => (
                    <div 
                        key={item.id} 
                        className="stack w-1/3 p-2 mt-5 cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => onPlayListClick(item.id)}
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