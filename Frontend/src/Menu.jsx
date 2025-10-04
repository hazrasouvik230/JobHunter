import React, { useContext } from 'react'
import { FaUserCog } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const Menu = ({ setShowMenu }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setShowMenu(prev => !prev);
        navigate("/profile");
    };

    const handleLogout = () => {
        logout();
        setShowMenu(prev => !prev);
        navigate("/");
    };

    return (
        <div className='absolute top-14 right-28 z-30'>
            <div className="bg-amber-50 w-40 p-4 rounded-xl shadow-xl relative">
                <p className='flex items-center gap-2 bg-amber-400/30 mb-2 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 hover:shadow-md hover:bg-amber-200' onClick={handleProfileClick}><FaUserCog />Profile</p>
                <p className='flex items-center gap-2 bg-amber-400/30 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 hover:shadow-md hover:bg-amber-200' onClick={handleLogout}><TbLogout /> Logout</p>
            </div>
        </div>
    )
}

export default Menu