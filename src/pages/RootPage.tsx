import NavBar from "../components/NavBar/NavBar";
import PlayList from "../components/PlayList/PlayList";
import PlaySong from "../components/PlaySong/PlaySong";

export default function RootPage(){
  return(
    <div className="mx-auto flex h-full max-w-[900px] min-w-[300px] flex-col items-center">
        <NavBar/>
        <PlaySong/>
        <PlayList/>
    </div>
  );
}