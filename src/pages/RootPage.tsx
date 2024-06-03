import NavBar from "../components/NavBar/NavBar";
import PlaySong from "../components/PlaySong/PlaySong";

export default function RootPage(){
  return(
    <div className="mx-auto flex h-full w-11/12 md:w-2/3 lg:w-2/3 xl:w-2/3 min-w-[300px] flex-col items-center">
        <NavBar/>
        <PlaySong/>
    </div>
  );
};