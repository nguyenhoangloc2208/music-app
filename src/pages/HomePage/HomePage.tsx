import PlayList from "./components/PlayList/PlayList";
import PlaySong from "./components/PlaySong/PlaySong";

export default function HomePage() {
    return(
        <div className="mx-auto h-full w-full min-w-[300px] items-center">
            <PlaySong/>
            <PlayList/>
        </div>
    )
}