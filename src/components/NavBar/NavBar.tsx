import { useCallback, useState } from "react";
import IconSearch from "../icons/IconSearch";
import { Modal } from "@mui/material";
import SearchModal from "./components/SearchModal/SearchModal";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const onPlayListPage = useCallback(() => {
        navigate('/playlist');
    }, [navigate]);

    const onHomePage = useCallback(() => {
        navigate('/');
    }, [navigate]);

    return(
        <div className="fixed w-full z-40 top-0 left-0 bg-white">
            <div className="max-w-[900px] px-4 md:px-0 mx-auto flex justify-between items-center py-3">
                <p className="flex items-center cursor-pointer text-center"
                    onClick={onHomePage}
                >
                    <img src="/logo.svg" alt="logo" className="w-5 h-5 mr-2"/>
                    <p className="font-black italic">
                        BeruMusic
                    </p>
                </p>
                <div className="flex items-center"
                >
                    <p
                        className="text-sm md:block text-gray-500 cursor-pointer"
                        onClick={onPlayListPage}
                    >
                        Beru playlists
                    </p>
                    <IconSearch
                        className="ml-7 cursor-pointer fill-black text-xl"
                        onClick={handleOpen}
                    />
                    <Modal
                        open={isOpen}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        onClose={handleClose}
                    >
                        <div className="fixed z-10 top-0 left-1/2 -translate-x-1/2 max-w-[600px] w-full px-4 sm:px-0">
                            <SearchModal />
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}