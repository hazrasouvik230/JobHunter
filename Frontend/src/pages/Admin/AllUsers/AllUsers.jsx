import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const response = await axios.get("http://localhost:3000/api/list");
        console.log(response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleRemove = (id) => {
    const confirmation = window.confirm("Are you sure to remove this user?");
    if(confirmation) {
      const newArr = users.filter(user => user._id !== id);
      setUsers(newArr);
    }
  };

  const navigate = useNavigate();
  const handleUser = (id) => {
    alert(`Switching to ${id}`);
    navigate(`/admin/specific-users/${id}`);
  };

  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
      <div className='text-center mb-8 mt-16'>
          <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

          <p className='text-4xl font-bold text-gray-900 mb-4'>All Users List</p>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
      </div>


      <div className='flex justify-between gap-2'>
        <div className='bg-white border-2 border-gray-400 rounded-xl shadow-xl w-2/3 p-6'>
          {
            users && (
              users.map((user) => {
                return <div key={user._id} className='flex items-center justify-between bg-amber-100 my-4 p-4 px-6 rounded-md hover:shadow-lg hover:scale-101'>
                  <div className="flex gap-4">
                    <img src={`http://localhost:3000/uploads/profile-images/${user.profileImage}`} alt={user.profileImage} className='h-12 w-12 rounded-full border-2 border-gray-400' />
                    <div>
                      <p className='text-lg font-medium'>{user.name}</p>
                      <p className='text-xs'>Role of the user: {user.role}</p>
                    </div>
                  </div>

                  {
                    user.role !== "Admin" && (
                      <div className='flex gap-2'>
                        <button className='bg-gradient-to-r from-lime-300 to-lime-500 px-6 py-2 text-white font-medium rounded cursor-pointer hover:scale-105' onClick={() => handleUser(user._id)}>Show details</button>
                        <button className='bg-red-500/60 px-6 py-2 text-white font-medium rounded cursor-pointer hover:scale-105' onClick={() => handleRemove(user._id)}>Remove</button>
                      </div>
                    )
                  }
                </div>
              })
            )
          }
        </div>

        <div className="bg-white border-2 border-gray-400 rounded-xl shadow-xl p-6 w-1/3">
          <div className="flex gap-4 flex-col">
            <div className='border text-center w-full py-4 rounded-lg bg-gradient-to-bl from-cyan-400 to-cyan-500 text-white'>
              <p className='text-2xl font-bold'>0</p>
              <p className='font-semibold'>Admin</p>
            </div>
            <div className='border text-center w-full py-4 rounded-lg bg-gradient-to-bl from-cyan-400 to-cyan-500 text-white'>
              <p className='text-2xl font-bold'>0</p>
              <p className='font-semibold'>HR Manager</p>
            </div>
            <div className='border text-center w-full py-4 rounded-lg bg-gradient-to-bl from-cyan-400 to-cyan-500 text-white'>
              <p className='text-2xl font-bold'>0</p>
              <p className='font-semibold'>Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllUsers