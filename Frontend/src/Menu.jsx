import React, { useContext } from 'react'
import { FaUserCog } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import toast from 'react-hot-toast';

const Menu = ({ setShowMenu }) => {
    const { role, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setShowMenu(prev => !prev);
        if(role === "HR") {
            navigate("/hr_profile");
        } else {
            navigate("/profile");
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        setShowMenu(prev => !prev);
        navigate("/");
    };

    return (
        <div className='fixed top-14 right-28 z-30'>
            <div className="bg-amber-50 w-40 p-4 rounded-xl shadow-xl relative">
                { role !== "Admin" && <p className='flex items-center gap-2 bg-amber-400/30 mb-2 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 hover:shadow-md hover:bg-amber-200' onClick={handleProfileClick}><FaUserCog />Profile</p>}
                <p className='flex items-center gap-2 bg-amber-400/30 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 hover:shadow-md hover:bg-amber-200' onClick={handleLogout}><TbLogout /> Logout</p>
            </div>
        </div>
    )
}

export default Menu