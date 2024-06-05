import { useState } from "react";
import IconSearch from "../icons/IconSearch";
import { Modal } from "@mui/material";
import SearchModal from "./components/SearchModal/SearchModal";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return(
        <div className="fixed w-full z-10 top-0 left-0 bg-white">
            <div className="max-w-[900px] px-4 md:px-0 mx-auto flex justify-between items-center py-3">
                <a href="/" className="flex items-center cursor-pointer">
                    <p className="font-black italic">
                        BeruMusic
                    </p>
                </a>
                <div className="flex items-center">
                    <IconSearch
                        className="cursor-pointer fill-black text-xl"
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