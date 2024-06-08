import { useAtom } from "jotai";
import { playListAtom } from "../../../../atoms/playListAtom";
import { YoutubeSong } from "../../../../hooks/useSearch";
import { IconEllipsis } from "../../../../components/icons/IconEllipsis";
import { useCallback } from "react";
import { selectedSongAtom } from "../../../../atoms/selectedSongAtom";
import { IconPlay } from "../../../../components/icons/IconPlay";
import { optionsAtom } from "../../../../atoms/optionsAtom";
import { youtubePlayListAtom } from "../../../../atoms/youtubePlayList";
import { IconLoop } from "../../../../components/icons/IconLoop";
import { useOutletContext } from "react-router-dom";

interface OutletContextProps {
    handleOpen: () => void;
}

export default function PlayList(){
    const [playList] = useAtom(playListAtom);
    const [selectedSong, setSelectedSong] = useAtom(selectedSongAtom);
    const [options, setOptions] = useAtom(optionsAtom);
    const [youtubePlayList] = useAtom(youtubePlayListAtom);
    const { handleOpen } = useOutletContext<OutletContextProps>();

    const onSongClick = useCallback((play: any) => {
        setSelectedSong(play);
    }, [setSelectedSong]);

    return(
        <div className="w-full mt-20 md:mx-auto mb-10">
            <div className="flex items-center">
                <h2 className="mb-5 font-bold text-2xl">
                    {options.myPlaylist ? 
                        "PlayList"
                        :
                        `${document.title.split(" || ")[1] ? document.title.split(" || ")[1] : `Mix - ${selectedSong.snippet.title}`}`
                        }
                </h2>
                <IconLoop className="ml-5 mb-5 cursor-pointer transition-transform transform hover:scale-110"
                    onClick={() =>
                        setOptions(prev => ({
                            ...prev,
                            myPlaylist: !options.myPlaylist
                        }))
                    }
                />
            </div>
            <hr />
            <div className="h-80 overflow-auto">
                {options.myPlaylist ?
                    playList.length > 0 ? (
                        <div className="mt-5">
                            {playList.map((play: YoutubeSong) => {
                                return (
                                    <div
                                    key={play.id.videoId}
                                        className="flex items-center justify-between h-full"
                                        onClick={() => onSongClick(play)}
                                    >   
                                        {
                                            selectedSong.id.videoId == play.id.videoId ?
                                            <IconPlay
                                                className="h-3 w-3 mr-1"
                                            />
                                            :
                                            <div className="mr-4"></div>
                                        }
                                        <div
                                            className={`relative flex flex-1 hover:bg-[#f3f5f7] transition-all py-[10px] items-center rounded-lg mb-2 cursor-pointer
                                            ${selectedSong.id.videoId != play.id.videoId ? 'bg-white' : 'bg-[#f3f5f7]'}
                                            `}
                                        >
                                            <div className="relative w-[50px] h-[50px] mr-3">
                                                <img    
                                                    src={play.snippet.thumbnails.high.url}
                                                    alt="image"
                                                    width={40}
                                                    height={40}
                                                    className="block w-full min-w-[50px] min-h-[50px] h-full object-cover rounded-lg "
                                                    />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-semibold h-6 overflow-hidden">
                                                    {play.snippet.title}
                                                </h4>
                                                <p className="font-mono text-sm text-gray-500">
                                                    {play.snippet.channelTitle}
                                                </p>
                                            </div>
                                            <div className="absolute right-10">
                                                <IconEllipsis
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-9">
                            <p className="text-[#6b7589] text-lg text-center mb-3 font-bold">
                                Your playlist is empty now!
                            </p>
                            <p className="text-[#a4abb8] text-sm text-center">
                                Please click the button below to add your favorite songs
                                . Or add song from the suggestions
                            </p>
                        </div>
                    )
                    :
                    youtubePlayList.length > 0 ? (
                        <div className="mt-5">
                            {youtubePlayList.map((play: YoutubeSong) => {
                                return (
                                    <div
                                    key={play.id.videoId}
                                        className="flex items-center justify-between h-full"
                                        onClick={() => onSongClick(play)}
                                    >   
                                        {
                                            selectedSong.id.videoId == play.id.videoId ?
                                            <IconPlay
                                                className="h-3 w-3 mr-1"
                                            />
                                            :
                                            <div className="mr-4"></div>
                                        }
                                        <div
                                            className={`relative flex flex-1 hover:bg-[#f3f5f7] transition-all py-[10px] items-center rounded-lg mb-2 cursor-pointer
                                            ${selectedSong.id.videoId != play.id.videoId ? 'bg-white' : 'bg-[#f3f5f7]'}
                                            `}
                                        >
                                            <div className="relative w-[50px] h-[50px] mr-3">
                                                <img    
                                                    src={play.snippet.thumbnails.high.url}
                                                    alt="image"
                                                    width={40}
                                                    height={40}
                                                    className="block w-full min-w-[50px] min-h-[50px] h-full object-cover rounded-lg "
                                                    />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-semibold h-6 overflow-hidden">
                                                    {play.snippet.title}
                                                </h4>
                                                <p className="font-mono text-sm text-gray-500">
                                                    {play.snippet.channelTitle}
                                                </p>
                                            </div>
                                            <div className="absolute right-10">
                                                <IconEllipsis
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-9">
                            <p className="text-[#6b7589] text-lg text-center mb-3 font-bold">
                                Your playlist is empty now!
                            </p>
                            <p className="text-[#a4abb8] text-sm text-center">
                                Please click the button below to add your favorite songs
                                . Or add song from the suggestions
                            </p>
                        </div>
                    )
                }
                {options.myPlaylist &&
                    <button
                    className="mt-2 active:scale-95 border-none block w-fit mx-auto border py-2 px-10 text-gray-700 hover:bg-gray-200"
                    onClick={handleOpen}
                    >
                    + Add my song
                    </button>
                }
            </div>
        </div>
    )
}