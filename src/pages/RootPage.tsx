import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const RootPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <div className="bg-white mx-auto p-5 flex h-full max-w-[900px] min-w-[300px] flex-col items-center">
            <nav>
                <NavBar isOpen={isOpen} handleOpen={handleOpen} handleClose={handleClose} />
            </nav>
            <div className="mt-5 bg-white h-96 w-full">
                <Outlet context={{ handleOpen }} />
            </div>
        </div>
    );
};

export default RootPage;
