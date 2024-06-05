import { useAtom } from "jotai";
import { IconPlay } from "../icons/IconPlay";
import { playListAtom } from "../../atoms/playListAtom";
import { YoutubeSong } from "../../hooks/useSearch";

export default function PlayList(){
    const [playList] = useAtom(playListAtom);
    return(
        <div className="max-w-[770px] w-full mx-4 md:mx-auto mt-20 mb-10">
            <h2 className="mb-5 font-bold text-2xl">
                PlayList
            </h2>
            <hr />
            {playList.length > 0 ? (
                <div className="mt-5">
            
                    {playList.map((play: YoutubeSong) => {
                        return (
                            <div
                            key={play.id.videoId}
                                className="flex items-center justify-between"
                            >
                                <div
                                    className={"relative flex flex-1 mr-3 hover:bg-[#f3f5f7] transition-all py-[10px] items-center px-[15px] rounded-lg mb-2 cursor-pointer bg-white"}
                                >
                                    <div className="relative w-[40px] h-[40px] mr-3">
                                        <img
                                            src={play.snippet.thumbnails.medium.url}
                                            alt="image"
                                            width={40}
                                            height={40}
                                            className="block w-full min-w-[40px] min-h-[40px] h-full object-cover rounded-lg "
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
                                </div>
                                <div className="flex items-center">
                                    <IconPlay
                                        className="fill-gray-400 cursor-pointer hover:scale-125 transition-transform hover:fill-black transition-color text-xl ml-3"
                                    />
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
            )}
            <button
                className="mt-9 active:scale-95 border-none block w-fit mx-auto border py-2 px-10 text-gray-700 hover:bg-gray-200"
            >
                + Add my song
            </button>
        </div>
    )
}