import { useState } from "react";
import IconSearch from "../icons/IconSearch";
import { Modal, Button } from "@mui/material";
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
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <SearchModal/>
                    </Modal>
                </div>
            </div>
        </div>
    );
}