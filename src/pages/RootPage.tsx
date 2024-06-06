import NavBar from "../components/NavBar/NavBar";
import PlayList from "../components/PlayList/PlayList";
import PlaySong from "../components/PlaySong/PlaySong";

export default function RootPage(){
  return(
    <div className="mx-auto flex h-full max-w-[900px] min-w-[300px] flex-col items-center">
        <NavBar/>
        <div className="flex w-full">
          <div className="flex-auto w-2/3">
            <PlaySong/>
          </div>
          <div className="flex-auto w-1/3">
            <PlayList/>
          </div>
        </div>
    </div>
  );
}