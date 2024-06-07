import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

export default function RootPage(){
  return(
    <div className="mx-auto p-5 flex h-full max-w-[900px] min-w-[300px] flex-col items-center">
      <nav>
        <NavBar/>
      </nav>
      <div className='mt-5 w-full'>
              <Outlet />
      </div>
    </div>
  );
}