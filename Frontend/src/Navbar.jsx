import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import LoginModal from './LoginModal'
import Menu from './Menu';

import { FaUser } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa6";
import { BsPersonVideo2 } from "react-icons/bs";
import { MdLibraryAdd } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { PiBuildingsFill } from "react-icons/pi";
import { MdSpaceDashboard } from "react-icons/md";
import { AuthContext } from './context/AuthContext';
import Notifications from './Notifications';

const Navbar = () => {
  const { isLoggedIn, role } = useContext(AuthContext);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notification, setNotification] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    setIsLoginOpen(false);
  };

  const handleMenu = () => {
    setShowMenu(prev => !prev);
  };

  const handleNotificationModal = () => {
    console.log("clicked")
    setNotification(!notification);
  };

  // const [isNotifications, setIsNotifications] = useState(false);

  const userNavLinks = [
    { label: "Home", icon: IoHome, path: "/" },
    { label: "All Jobs", icon: FaBriefcase, path: "/user/all-jobs" },
    { label: "Applied Jobs", icon: FaFileCircleCheck, path: "/user/applied-jobs" },
    { label: "Saved Jobs", icon: FaBookmark, path: "/user/saved-jobs" },
    { label: "Interview", icon: BsPersonVideo2, path: "/user/interview" },
  ];

  const humanResourceNavLinks = [
    { label: "Home", icon: IoHome, path: "/" },
    { label: "Post Job", icon: MdLibraryAdd, path: "/hr/post-job" },
    { label: "All Posted Jobs", icon: FaBriefcase, path: "/hr/all-posted-jobs" },
    { label: "Interview", icon: BsPersonVideo2, path: "/hr/interview" },
  ];

  const adminNavLinks = [
    { label: "Dashboard", icon: MdSpaceDashboard, path: "/admin/dashboard" },
    { label: "All Users", icon: FaUsers, path: "/admin/all-users" },
    { label: "All Companies", icon: PiBuildingsFill, path: "/admin/all-companies" },
    { label: "Revenue", icon: FaSackDollar, path: "/admin/revenue" },
  ];

  const getNavLinks = () => {
    if(role === "Admin") return adminNavLinks;
    if(role === "HR") return humanResourceNavLinks;
    if(role === "User") return userNavLinks;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if(storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setRole(userObj.role);
      } catch (error) {
        console.log("Error parsing user data:", error);
      }
    }
  }, []);


  const notifications = [
      { id: 1, title: "Interview scheduled", status: "unread" },
      { id: 2, title: "Rejected", status: "unread" },
      { id: 3, title: "New post", status: "unread" },
  ];

  return (
    <>
      <div className='fixed w-full z-20 bg-white flex items-center justify-between px-32 py-4 shadow-xl'>
        <img src='/Logo(C)-1.png' alt='JobHunterLogo' className='cursor-pointer h-8 hover:scale-110' onClick={() => navigate("/")} />

        {/* Navitems */}
        {
            isLoggedIn && getNavLinks() && <div className='flex space-x-12'>
                {
                    getNavLinks().map((navItem) => {
                      const isActive = location.pathname === navItem.path;
                        return <p className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-400/50 hover:scale-110 duration-300 ease-in-out ${isActive ? "border-b-3 border-blue-600 font-semibold" : "" }`} key={navItem.label} onClick={() => navigate(navItem.path)}>{<navItem.icon />}{navItem.label}</p>
                    })
                }
            </div>
        }

        {
          isLoggedIn ? <div className='flex gap-4'>
            <IoNotifications className='relative text-3xl cursor-pointer' onClick={handleNotificationModal} />
            <span className='absolute right-43 text-center bg-red-400 text-xs font-semibold text-white h-4 w-4 rounded-full'>{notifications.length}</span>
            {
              JSON.parse(localStorage.getItem("user")).profileImage === "" ? <FaUser className='border text-3xl rounded-full cursor-pointer hover:scale-105' onClick={handleMenu} /> : (
                <>
                  <img src={`http://localhost:3000/uploads/profile-images/${JSON.parse(localStorage.getItem("user")).profileImage}`} alt="" className='h-7.5 border w-7.5 rounded-full' onClick={handleMenu} />
                </>
              )
            }
            
          </div> : <div>
            <button className=' bg-sky-400/85 text-white font-semibold hover:scale-[1.20] px-6 py-1 rounded transition duration-500 ease-in-out sm:flex cursor-pointer' onClick={() => setIsLoginOpen(true)}>Login</button>
          </div>
        }
      </div>

      {
        isLoginOpen && <LoginModal handleClose={handleClose} />
      }

      {
        showMenu && <Menu setShowMenu={setShowMenu} />
      }

      {
        notification && <Notifications notifications={notifications} />
      }
    </>
  )
}

export default Navbar