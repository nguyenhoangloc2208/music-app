import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import useSearch, {YoutubeSong } from "../../../../hooks/useSearch";
import { IconPlay } from "../../../icons/IconPlay";

export default function SearchModal() {
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [songs, setSongs] = useState<YoutubeSong[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [pickedId, setPickedId] = useState<string>("");

    const { isMutating, trigger } = useSearch();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);


    const search = useCallback(
        async (value: string) => {
            setLoading(true);
            try {
                const result = await trigger({ q: value });
                
                if (result.items.length > 0) {
                    setSongs(result.items)
                    setError(null);
                } else {
                    setError('No songs found');
                }
            } catch (error) {
                setError('An error occurred while searching');
            } finally {
                setLoading(false);
            }
        },
        [trigger]
    );

    const onInputChange = useCallback(
        debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setInputValue(value);
            setError(null);
            await search(value);
        }, 500),
        [search]
    );

    return (
        <div>
            <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-[600px] w-full z-40 px-4 sm:px-0">
                <div className="w-full relative">
                    <img
                        src="/images/search.png"
                        alt="search icon"
                        width={22}
                        height={22}
                        className="absolute top-1/2 -translate-y-1/2 ml-4"
                    />
                    <input
                        type="text"
                        onChange={onInputChange}
                        placeholder="Search your song"
                        className="py-[15px] pl-[55px] pr-[15px] w-full rounded-lg text-black outline-none"
                        ref={inputRef}
                        aria-label="Search input"
                    />
                </div>
                {isMutating && !error && (
                    <span className='loading loading-spinner loading-sm mt-3 mx-auto block'></span>
                )}
                {error && (
                    <div className="text-red-500 mt-3">{error}</div>
                )}
                {songs.map((song: YoutubeSong) => {
                    const {
                        id: { videoId },
                        snippet: {
                            channelTitle,
                            thumbnails: {
                                medium: { url },
                            },
                            title,
                        },
                    } = song;
                    return (
                        <div
                            key={videoId}
                            className="my-3 py-[10px] px-[15px] hover:scale-105 bg-white rounded-lg cursor-pointer transition-transform flex justify-between items-center"
                        >
                            <div className="flex items-center h-full pr-3">
                                <img
                                    src={url}
                                    alt="song thumbnail"
                                    className="h-[50px] w-[50px] object-cover rounded-lg mr-3"
                                />
                                <div>
                                    <p className="font-semibold text-sm sm:text-base h-6 overflow-hidden">
                                        {title}
                                    </p>
                                    <p className="text-sm font-mono text-gray-500 h-5 overflow-hidden">
                                        {channelTitle}
                                    </p>
                                </div>
                            </div>
                            {pickedId === videoId ? (
                                loading ? (
                                    <span className="loading loading-spinner loading-lg mx-auto block"></span>
                                ) : (
                                    <IconPlay />
                                )
                            ) : (
                                <IconPlay />
                            )}
                        </div>
                    );
                })}
            </div>
            <div
                className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-35 z-20"
                role="dialog"
                aria-modal="true"
            ></div>
        </div>
    );
}
